import { useState, useEffect, useMemo } from 'react';
import {
  client,
  queries,
  transformArtwork,
  transformDueDates,
} from '../lib/sanity';
import { logger } from '../lib/logger';

// Module-level cache — survives component remounts, cleared on page reload
let artworksCache: ReturnType<typeof transformArtwork>[] | null = null;
let artworksFetchPromise: Promise<ReturnType<typeof transformArtwork>[]> | null = null;

/**
 * Hook to fetch all artworks from Sanity.
 * Results are cached in-memory for the browser session so navigating between
 * pages doesn't trigger a new network request.
 */
export function useArtworks() {
  const [data, setData] = useState({
    artworks: artworksCache ?? [],
    loading: artworksCache === null,
    error: null as unknown,
  });

  useEffect(() => {
    if (artworksCache !== null) return;

    let cancelled = false;

    if (!artworksFetchPromise) {
      artworksFetchPromise = client
        .fetch(queries.allArtworks)
        .then((result) => result.map(transformArtwork));
    }

    artworksFetchPromise
      .then((artworks) => {
        // Only cache a populated result. A transient empty response must not be
        // cached, or line 27's short-circuit would serve [] for the rest of the
        // session; nulling the promise lets a later mount/navigation retry.
        if (artworks.length > 0) {
          artworksCache = artworks;
        } else {
          artworksFetchPromise = null;
        }
        if (!cancelled) setData({ artworks, loading: false, error: null });
      })
      .catch((err) => {
        artworksFetchPromise = null;
        if (!cancelled) {
          logger.error('Error fetching artworks:', err);
          setData({ artworks: [], loading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

/**
 * Hook to fetch a single artwork by ID
 * @param {number} id - Artwork ID
 */
export function useArtwork(id) {
  const [data, setData] = useState({ artwork: null, loading: true, error: null });

  useEffect(() => {
    if (!id) {
      setData({ artwork: null, loading: false, error: null });
      return;
    }

    let cancelled = false;

    async function fetchArtwork() {
      try {
        const result = await client.fetch(queries.artworkById(id));
        if (!cancelled) {
          setData({
            artwork: transformArtwork(result),
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          logger.error('Error fetching artwork:', err);
          setData({ artwork: null, loading: false, error: err });
        }
      }
    }

    fetchArtwork();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return data;
}

/**
 * Hook to fetch all due dates from Sanity
 * Returns data in the same format as the legacy DueDates.json
 */
export function useDueDates() {
  const [data, setData] = useState({
    dueDates: { assignments: [], quizzes: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchDueDates() {
      try {
        const result = await client.fetch(queries.allDueDates);
        if (!cancelled) {
          const transformed = transformDueDates(result);
          setData({ dueDates: transformed, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          logger.error('Error fetching due dates:', err);
          setData({
            dueDates: { assignments: [], quizzes: [] },
            loading: false,
            error: err,
          });
        }
      }
    }

    fetchDueDates();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

/**
 * Hook to get artworks organized by unit
 * Useful for flashcard settings
 */
export function useArtworksByUnit() {
  const { artworks, loading, error } = useArtworks();

  const byUnit = useMemo(() => {
    const grouped = {};
    artworks.forEach((artwork) => {
      const unit = artwork.unit;
      if (!grouped[unit]) {
        grouped[unit] = [];
      }
      grouped[unit].push(artwork);
    });
    return grouped;
  }, [artworks]);

  const units = useMemo(() => {
    return [...new Set(artworks.map((a) => a.unit))].sort((a, b) => a - b);
  }, [artworks]);

  return { byUnit, units, loading, error };
}
