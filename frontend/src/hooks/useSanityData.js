import { useState, useEffect, useMemo } from 'react';
import {
  client,
  queries,
  transformArtwork,
  transformDueDates,
} from '../lib/sanity';

/**
 * Hook to fetch all artworks from Sanity
 * Returns data in the same format as the legacy artworks.json
 */
export function useArtworks() {
  const [data, setData] = useState({ artworks: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function fetchArtworks() {
      try {
        const result = await client.fetch(queries.allArtworks);
        if (!cancelled) {
          const transformedArtworks = result.map(transformArtwork);
          setData({ artworks: transformedArtworks, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching artworks:', err);
          setData({ artworks: [], loading: false, error: err });
        }
      }
    }

    fetchArtworks();

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
          console.error('Error fetching artwork:', err);
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
          console.error('Error fetching due dates:', err);
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

/**
 * Hook to create a map of artwork IDs to due dates
 * Used by flashcard utilities
 */
export function useDueDatesMap() {
  const { dueDates, loading, error } = useDueDates();

  const dueDatesMap = useMemo(() => {
    const map = new Map();

    dueDates.assignments.forEach((assignment) => {
      // Only process numeric IDs (artwork IDs)
      const id = parseInt(assignment.id, 10);
      if (!isNaN(id) && assignment.dueDate) {
        // Parse M-D format and convert to Date
        const [month, day] = assignment.dueDate.split('-').map(Number);
        const now = new Date();
        let year = now.getFullYear();

        // Academic year logic: Sept-Dec = current year, Jan-Aug = next year
        if (month >= 9) {
          // Sept or later
          if (now.getMonth() < 8) {
            // If we're before September, use previous year
            year = now.getFullYear() - 1;
          }
        } else {
          // Jan-Aug
          if (now.getMonth() >= 8) {
            // If we're in Sept or later, use next year
            year = now.getFullYear() + 1;
          }
        }

        const date = new Date(year, month - 1, day);
        map.set(id, date);
      }
    });

    return map;
  }, [dueDates]);

  return { dueDatesMap, loading, error };
}
