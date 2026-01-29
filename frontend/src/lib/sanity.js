import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'o12a3h5d',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for faster reads (data is cached)
  apiVersion: '2024-01-01', // Use current date for API version
});

// Image URL builder
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image reference
 * @param {Object} source - Sanity image object
 * @returns {Function} - Image URL builder with chainable methods
 */
export function urlFor(source) {
  return builder.image(source);
}

/**
 * Get image URL with default optimizations and hotspot support
 * @param {Object} source - Sanity image object (includes hotspot/crop data)
 * @param {Object} options - Optional size/format options
 * @returns {string} - Optimized image URL
 */
export function getImageUrl(source, options = {}) {
  if (!source) return '';

  const { width = 800, height, format = 'webp', quality = 80, fit = 'max' } = options;

  let url = builder.image(source).format(format).quality(quality);

  // When using fit='crop', the builder automatically uses hotspot data
  if (fit) url = url.fit(fit);
  if (width) url = url.width(width);
  if (height) url = url.height(height);

  return url.url();
}

/**
 * Get CSS object-position value from Sanity image hotspot
 * Use this when displaying images with object-fit: cover to ensure
 * the hotspot (focal point) stays visible
 * @param {Object} source - Sanity image object with hotspot data
 * @returns {string} - CSS object-position value (e.g., "30% 20%")
 */
export function getImageHotspot(source) {
  if (!source?.hotspot) return 'center center';

  const { x, y } = source.hotspot;
  // Hotspot values are 0-1, convert to percentage
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}

// GROQ Queries
export const queries = {
  // Get all artworks (sorted by ID)
  allArtworks: `*[_type == "artwork"] | order(id asc) {
    id,
    name,
    location,
    artistCulture,
    dateRange,
    materials,
    unit,
    museum,
    displayedLocation,
    displayedCoordinates,
    originatedCoordinates,
    "images": images[] {
      ...,
      hotspot,
      crop,
      asset->
    },
    videos
  }`,

  // Get single artwork by ID
  artworkById: (id) => `*[_type == "artwork" && id == ${id}][0] {
    id,
    name,
    location,
    artistCulture,
    dateRange,
    materials,
    unit,
    museum,
    displayedLocation,
    displayedCoordinates,
    originatedCoordinates,
    "images": images[] {
      ...,
      hotspot,
      crop,
      asset->
    },
    videos
  }`,

  // Get all due dates with artwork references expanded
  allDueDates: `*[_type == "dueDate"] | order(dueDate asc) {
    _id,
    type,
    title,
    dueDate,
    notes,
    "artwork": artwork-> {
      id,
      name
    }
  }`,

  // Get due dates for a date range
  dueDatesInRange: (startDate, endDate) => `*[_type == "dueDate" && dueDate >= "${startDate}" && dueDate <= "${endDate}"] | order(dueDate asc) {
    _id,
    type,
    title,
    dueDate,
    notes,
    "artwork": artwork-> {
      id,
      name
    }
  }`,
};

/**
 * Transform Sanity artwork to match legacy JSON structure
 * This allows existing components to work without modification
 */
export function transformArtwork(sanityArtwork) {
  if (!sanityArtwork) return null;

  const { dateRange, displayedCoordinates, originatedCoordinates, images, videos, artistCulture, ...rest } = sanityArtwork;

  // Convert dateRange object to legacy string format
  let date = '';
  if (dateRange) {
    if (dateRange.startYear === dateRange.endYear) {
      date = String(dateRange.startYear);
    } else {
      date = `${dateRange.startYear}/${dateRange.endYear}`;
    }
  }

  // Convert images array to legacy format (array of URLs) for backward compatibility
  const image = images?.map((img) => getImageUrl(img, { width: 1200 })) || [];

  // Also keep raw image data with hotspot info for components that need it
  const imageData = images || [];

  // Convert videos array to legacy format
  const videoLink = videos?.map((v) => v.url).filter(Boolean) || null;
  const transcript = videos?.map((v) =>
    v.transcript ? JSON.stringify(v.transcript) : null
  ).filter(Boolean) || null;

  return {
    ...rest,
    artist_culture: artistCulture || 'None',
    date,
    displayedLatitude: displayedCoordinates?.latitude,
    displayedLongitude: displayedCoordinates?.longitude,
    originatedLatitude: originatedCoordinates?.latitude,
    originatedLongitude: originatedCoordinates?.longitude,
    image,
    imageData, // Raw Sanity image objects with hotspot/crop data
    videoLink: videoLink?.length ? videoLink : null,
    transcript: transcript?.length ? transcript : null,
  };
}

/**
 * Transform Sanity due dates to match legacy DueDates.json structure
 */
export function transformDueDates(sanityDueDates) {
  const assignments = [];
  const quizzes = [];

  sanityDueDates.forEach((item) => {
    // Convert YYYY-MM-DD to M-D format
    const dateParts = item.dueDate?.split('-');
    const formattedDate = dateParts
      ? `${parseInt(dateParts[1], 10)}-${parseInt(dateParts[2], 10)}`
      : '';

    if (item.type === 'artwork' && item.artwork) {
      assignments.push({
        id: String(item.artwork.id),
        dueDate: formattedDate,
      });
    } else if (item.type === 'event') {
      assignments.push({
        id: item.title,
        dueDate: formattedDate,
      });
    } else if (item.type === 'quiz') {
      quizzes.push({
        title: item.title,
        dueDate: formattedDate,
      });
    }
  });

  return { assignments, quizzes };
}
