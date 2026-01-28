/**
 * Migration Script: Upload artworks and due dates to Sanity CMS
 *
 * Prerequisites:
 * 1. Create a Sanity project at https://sanity.io/manage
 * 2. Copy project ID and create API token with write access
 * 3. Set environment variables (see .env.example)
 *
 * Usage:
 * 1. cd scripts
 * 2. npm install @sanity/client
 * 3. SANITY_PROJECT_ID=xxx SANITY_TOKEN=xxx node migrate-to-sanity.js
 *
 * Options:
 * --dry-run    Preview changes without uploading
 * --artworks   Only migrate artworks
 * --duedates   Only migrate due dates
 * --images     Include image uploads (slower, requires more API calls)
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  projectId: process.env.SANITY_PROJECT_ID || 'o12a3h5d',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN, // API token with write access
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for mutations
};

// Validate config
if (!config.projectId || !config.token) {
  console.error('Error: Missing required environment variables');
  console.error('Required: SANITY_PROJECT_ID, SANITY_TOKEN');
  console.error('\nGet these from https://sanity.io/manage');
  process.exit(1);
}

const client = createClient(config);

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_ARTWORKS = args.includes('--artworks');
const ONLY_DUEDATES = args.includes('--duedates');
const INCLUDE_IMAGES = args.includes('--images');

// Paths to data files
const ARTWORKS_PATH = path.join(
  __dirname,
  '../frontend/src/data/artworks.json'
);
const DUEDATES_PATH = path.join(
  __dirname,
  '../frontend/src/pages/Calendar/DueDates.json'
);
const IMAGES_PATH = path.join(__dirname, '../frontend/src/artImages');

/**
 * Parse legacy date string into dateRange object
 * Examples: "-25500/-25300", "1767", "1425/1452"
 */
function parseDateString(dateStr) {
  if (!dateStr) return { startYear: 0, endYear: 0 };

  const parts = dateStr.split('/');
  const startYear = parseInt(parts[0], 10);
  const endYear = parts.length > 1 ? parseInt(parts[1], 10) : startYear;

  return { startYear, endYear };
}

/**
 * Parse legacy transcript string into array of objects
 */
function parseTranscript(transcriptStr) {
  if (!transcriptStr) return null;

  try {
    const parsed = JSON.parse(transcriptStr);
    if (Array.isArray(parsed)) {
      return parsed.map((entry) => ({
        _type: 'transcriptEntry',
        _key: `t-${entry.start}-${entry.end}`.replace(/\./g, '-'),
        start: entry.start,
        end: entry.end,
        text: entry.text,
      }));
    }
    return null;
  } catch (e) {
    console.warn('Failed to parse transcript:', e.message);
    return null;
  }
}

/**
 * Upload an image to Sanity and return the asset reference
 */
async function uploadImage(imagePath, filename) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
    });
    return {
      _type: 'image',
      _key: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Failed to upload image ${filename}:`, error.message);
    return null;
  }
}

/**
 * Transform legacy artwork to Sanity document
 */
async function transformArtwork(artwork, uploadImages = false) {
  const dateRange = parseDateString(artwork.date);

  // Transform videos and transcripts
  let videos = null;
  if (artwork.videoLink && artwork.videoLink.length > 0) {
    videos = artwork.videoLink.map((url, index) => {
      const transcript =
        artwork.transcript && artwork.transcript[index]
          ? parseTranscript(artwork.transcript[index])
          : null;

      return {
        _type: 'video',
        _key: `video-${index}`,
        url,
        transcript,
      };
    });
  }

  // Handle images
  let images = [];
  if (uploadImages && artwork.image && artwork.image.length > 0) {
    for (const imageName of artwork.image) {
      const imagePath = path.join(IMAGES_PATH, imageName);
      if (fs.existsSync(imagePath)) {
        const uploaded = await uploadImage(imagePath, imageName);
        if (uploaded) images.push(uploaded);
      } else {
        console.warn(`Image not found: ${imageName}`);
      }
    }
  }

  return {
    _type: 'artwork',
    _id: `artwork-${artwork.id}`, // Deterministic ID for easy reference
    id: artwork.id,
    name: artwork.name,
    location: artwork.location || '',
    artistCulture: artwork.artist_culture || 'None',
    dateRange,
    materials: artwork.materials || '',
    unit: artwork.unit,
    museum: artwork.museum || '',
    displayedLocation: artwork.displayedLocation || '',
    displayedCoordinates: {
      latitude: artwork.displayedLatitude,
      longitude: artwork.displayedLongitude,
    },
    originatedCoordinates: {
      latitude: artwork.originatedLatitude,
      longitude: artwork.originatedLongitude,
    },
    images,
    videos,
  };
}

/**
 * Transform due date entry to Sanity document
 */
function transformDueDate(entry, type, index, academicYear) {
  const [month, day] = entry.dueDate.split('-').map(Number);

  // Calculate full date based on academic year
  // Sept-Dec = academicYear, Jan-Aug = academicYear + 1
  const year = month >= 9 ? academicYear : academicYear + 1;
  const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isArtwork = type === 'assignment' && !isNaN(parseInt(entry.id, 10));

  const doc = {
    _type: 'dueDate',
    _id: `duedate-${type}-${index}-${entry.dueDate.replace('-', '')}`,
    type: type === 'quiz' ? 'quiz' : isArtwork ? 'artwork' : 'event',
    dueDate: fullDate,
  };

  if (isArtwork) {
    doc.artwork = {
      _type: 'reference',
      _ref: `artwork-${entry.id}`,
    };
  } else {
    doc.title = type === 'quiz' ? entry.title : entry.id;
  }

  return doc;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('='.repeat(60));
  console.log('Sanity CMS Migration Script');
  console.log('='.repeat(60));
  console.log(`Project ID: ${config.projectId}`);
  console.log(`Dataset: ${config.dataset}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`Include Images: ${INCLUDE_IMAGES ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));
  console.log('');

  // Load data
  const artworks = JSON.parse(fs.readFileSync(ARTWORKS_PATH, 'utf-8'));
  const dueDates = JSON.parse(fs.readFileSync(DUEDATES_PATH, 'utf-8'));

  console.log(`Found ${artworks.length} artworks`);
  console.log(
    `Found ${dueDates.assignments.length} assignments, ${dueDates.quizzes.length} quizzes`
  );
  console.log('');

  // Determine current academic year (Sept = start of new year)
  const now = new Date();
  const academicYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  console.log(`Using academic year: ${academicYear}-${academicYear + 1}`);
  console.log('');

  // Migrate artworks
  if (!ONLY_DUEDATES) {
    console.log('Migrating artworks...');
    console.log('-'.repeat(40));

    const artworkDocs = [];
    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i];
      process.stdout.write(`\rProcessing artwork ${i + 1}/${artworks.length}: ${artwork.name.slice(0, 30)}...`);

      const doc = await transformArtwork(artwork, INCLUDE_IMAGES);
      artworkDocs.push(doc);
    }
    console.log('');
    console.log(`Prepared ${artworkDocs.length} artwork documents`);

    if (!DRY_RUN) {
      console.log('Uploading to Sanity in batches...');
      const BATCH_SIZE = 25;
      let uploaded = 0;

      for (let i = 0; i < artworkDocs.length; i += BATCH_SIZE) {
        const batch = artworkDocs.slice(i, i + BATCH_SIZE);
        const transaction = client.transaction();

        for (const doc of batch) {
          transaction.createOrReplace(doc);
        }

        try {
          await transaction.commit();
          uploaded += batch.length;
          console.log(`Uploaded ${uploaded}/${artworkDocs.length} artworks...`);
        } catch (error) {
          console.error(`Failed to upload batch starting at ${i}:`, error.message);
        }
      }
      console.log('Artworks uploaded successfully!');
    } else {
      console.log('DRY RUN: Would upload artworks to Sanity');
      // Show sample document
      console.log('\nSample artwork document:');
      console.log(JSON.stringify(artworkDocs[0], null, 2));
    }
    console.log('');
  }

  // Migrate due dates
  if (!ONLY_ARTWORKS) {
    console.log('Migrating due dates...');
    console.log('-'.repeat(40));

    const dueDateDocs = [];

    // Process assignments
    dueDates.assignments.forEach((entry, index) => {
      const doc = transformDueDate(entry, 'assignment', index, academicYear);
      dueDateDocs.push(doc);
    });

    // Process quizzes
    dueDates.quizzes.forEach((entry, index) => {
      const doc = transformDueDate(entry, 'quiz', index, academicYear);
      dueDateDocs.push(doc);
    });

    console.log(`Prepared ${dueDateDocs.length} due date documents`);

    if (!DRY_RUN) {
      console.log('Uploading to Sanity in batches...');
      const BATCH_SIZE = 50;
      let uploaded = 0;

      for (let i = 0; i < dueDateDocs.length; i += BATCH_SIZE) {
        const batch = dueDateDocs.slice(i, i + BATCH_SIZE);
        const transaction = client.transaction();

        for (const doc of batch) {
          transaction.createOrReplace(doc);
        }

        try {
          await transaction.commit();
          uploaded += batch.length;
          console.log(`Uploaded ${uploaded}/${dueDateDocs.length} due dates...`);
        } catch (error) {
          console.error(`Failed to upload batch starting at ${i}:`, error.message);
        }
      }
      console.log('Due dates uploaded successfully!');
    } else {
      console.log('DRY RUN: Would upload due dates to Sanity');
      // Show sample documents
      console.log('\nSample assignment document:');
      console.log(JSON.stringify(dueDateDocs.find((d) => d.type === 'artwork'), null, 2));
      console.log('\nSample event document:');
      console.log(JSON.stringify(dueDateDocs.find((d) => d.type === 'event'), null, 2));
      console.log('\nSample quiz document:');
      console.log(JSON.stringify(dueDateDocs.find((d) => d.type === 'quiz'), null, 2));
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Migration complete!');
  console.log('='.repeat(60));

  if (DRY_RUN) {
    console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
  } else if (!INCLUDE_IMAGES) {
    console.log('\nNote: Images were not uploaded. Run with --images to include them.');
    console.log('This will take longer as each image needs to be uploaded individually.');
  }
}

// Run migration
migrate().catch(console.error);
