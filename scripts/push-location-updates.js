/**
 * Push Location Updates to Sanity CMS
 *
 * Reads approved updates from suggested-updates.json and pushes them to Sanity.
 * Applies coordinate spreading for artworks at the same museum.
 *
 * Usage:
 *   cd scripts
 *   SANITY_PROJECT_ID=xxx SANITY_TOKEN=xxx node push-location-updates.js
 *
 * Options:
 *   --dry-run    Preview changes without updating Sanity
 *   --no-spread  Skip coordinate spreading (use exact museum center)
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
  token: process.env.SANITY_TOKEN,
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

// Load museum bounds data
const MUSEUM_BOUNDS_PATH = path.join(__dirname, 'data/museum-bounds.json');
const UPDATES_PATH = path.join(__dirname, 'output/suggested-updates.json');
const museumBounds = JSON.parse(fs.readFileSync(MUSEUM_BOUNDS_PATH, 'utf-8'));

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const NO_SPREAD = args.includes('--no-spread');

/**
 * Find museum data by name
 */
function findMuseumData(museumName) {
  if (!museumName) return null;

  const normalizedName = museumName.toLowerCase().trim();

  for (const [name, data] of Object.entries(museumBounds)) {
    if (name.toLowerCase() === normalizedName) {
      return { name, ...data };
    }
    if (data.aliases && data.aliases.some(alias => alias.toLowerCase() === normalizedName)) {
      return { name, ...data };
    }
    if (normalizedName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedName)) {
      return { name, ...data };
    }
    if (data.aliases && data.aliases.some(alias =>
      normalizedName.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalizedName)
    )) {
      return { name, ...data };
    }
  }

  return null;
}

/**
 * Distribute coordinates within museum bounds using a spiral pattern
 * This prevents all artworks from the same museum overlapping on the map
 */
function spreadCoordinates(center, bounds, index, total) {
  if (total <= 1 || !bounds) {
    return center;
  }

  // Calculate spread area (use 80% of bounds to keep points inside)
  const latRange = (bounds.maxLat - bounds.minLat) * 0.8;
  const lngRange = (bounds.maxLng - bounds.minLng) * 0.8;

  // Use a grid pattern for distribution
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);

  const col = index % cols;
  const row = Math.floor(index / cols);

  // Calculate offset from center
  const latOffset = (row - (rows - 1) / 2) * (latRange / Math.max(rows - 1, 1));
  const lngOffset = (col - (cols - 1) / 2) * (lngRange / Math.max(cols - 1, 1));

  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset,
  };
}

/**
 * Group updates by museum for coordinate spreading
 */
function groupByMuseum(updates) {
  const groups = {};

  for (const update of updates) {
    const museumData = findMuseumData(update.museum);
    const key = museumData ? museumData.name : update.museum;

    if (!groups[key]) {
      groups[key] = {
        museumData,
        updates: [],
      };
    }
    groups[key].updates.push(update);
  }

  return groups;
}

/**
 * Apply coordinate spreading to all updates
 */
function applyCoordinateSpreading(updates) {
  if (NO_SPREAD) {
    return updates;
  }

  const groups = groupByMuseum(updates);
  const spreadUpdates = [];

  for (const [museum, group] of Object.entries(groups)) {
    const { museumData, updates: museumUpdates } = group;

    if (!museumData?.bounds || museumUpdates.length <= 1) {
      // No spreading needed
      spreadUpdates.push(...museumUpdates);
      continue;
    }

    // Apply spreading within museum bounds
    museumUpdates.forEach((update, index) => {
      const spreadCoords = spreadCoordinates(
        museumData.center,
        museumData.bounds,
        index,
        museumUpdates.length
      );

      spreadUpdates.push({
        ...update,
        displayedCoordinates: {
          latitude: spreadCoords.lat,
          longitude: spreadCoords.lng,
        },
        spreadApplied: true,
        originalCoords: update.displayedCoordinates,
      });
    });

    console.log(`  Spread ${museumUpdates.length} artworks within ${museum} bounds`);
  }

  return spreadUpdates;
}

/**
 * Push updates to Sanity in batches
 */
async function pushUpdates(updates) {
  const BATCH_SIZE = 25;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    const transaction = client.transaction();

    for (const update of batch) {
      const patch = {
        displayedCoordinates: {
          latitude: update.displayedCoordinates.latitude,
          longitude: update.displayedCoordinates.longitude,
        },
      };

      // Also update origin coordinates if provided
      if (update.originatedCoordinates) {
        patch.originatedCoordinates = {
          latitude: update.originatedCoordinates.latitude,
          longitude: update.originatedCoordinates.longitude,
        };
      }

      transaction.patch(`artwork-${update.id}`, p => p.set(patch));
    }

    try {
      await transaction.commit();
      updated += batch.length;
      console.log(`  Updated ${updated}/${updates.length} artworks...`);
    } catch (error) {
      console.error(`  Error updating batch starting at ${i}:`, error.message);
      errors += batch.length;
    }
  }

  return { updated, errors };
}

/**
 * Generate a log of changes
 */
function generateChangeLog(updates) {
  const now = new Date().toISOString();
  let log = `# Location Update Log
Generated: ${now}

## Summary
- Total updates: ${updates.length}
- Spread applied: ${updates.filter(u => u.spreadApplied).length}

## Updates Applied

| ID | Name | Museum | Latitude | Longitude | Spread |
|----|------|--------|----------|-----------|--------|
`;

  for (const update of updates.sort((a, b) => a.id - b.id)) {
    const name = update.name.length > 30 ? update.name.substring(0, 30) + '...' : update.name;
    const museum = (update.museum || '-').length > 20 ? (update.museum || '-').substring(0, 20) + '...' : (update.museum || '-');
    const spread = update.spreadApplied ? 'Yes' : 'No';
    log += `| ${update.id} | ${name} | ${museum} | ${update.displayedCoordinates.latitude.toFixed(4)} | ${update.displayedCoordinates.longitude.toFixed(4)} | ${spread} |\n`;
  }

  return log;
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Push Location Updates to Sanity');
  console.log('='.repeat(60));
  console.log(`Project ID: ${config.projectId}`);
  console.log(`Dataset: ${config.dataset}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`Coordinate Spreading: ${NO_SPREAD ? 'Disabled' : 'Enabled'}`);
  console.log('='.repeat(60));
  console.log('');

  // Load updates
  if (!fs.existsSync(UPDATES_PATH)) {
    console.error('Error: suggested-updates.json not found');
    console.error('Run research-locations.js first to generate this file');
    process.exit(1);
  }

  const allUpdates = JSON.parse(fs.readFileSync(UPDATES_PATH, 'utf-8'));
  console.log(`Found ${allUpdates.length} updates in suggested-updates.json`);

  // Filter to only approved updates
  const approvedUpdates = allUpdates.filter(u => u.approved === true);
  console.log(`Approved updates: ${approvedUpdates.length}`);

  if (approvedUpdates.length === 0) {
    console.log('\nNo approved updates to process.');
    console.log('Edit suggested-updates.json and set approved: true for entries you want to push.');
    return;
  }

  console.log('\nApplying coordinate spreading...');
  const spreadUpdates = applyCoordinateSpreading(approvedUpdates);

  console.log('\nUpdates to apply:');
  console.log('-'.repeat(40));
  for (const update of spreadUpdates.slice(0, 10)) {
    console.log(`  ${update.id}. ${update.name.substring(0, 40)}`);
    console.log(`     -> ${update.displayedCoordinates.latitude.toFixed(4)}, ${update.displayedCoordinates.longitude.toFixed(4)}${update.spreadApplied ? ' (spread)' : ''}`);
  }
  if (spreadUpdates.length > 10) {
    console.log(`  ... and ${spreadUpdates.length - 10} more`);
  }
  console.log('');

  if (DRY_RUN) {
    console.log('DRY RUN: Would update the above artworks in Sanity');

    // Generate preview log
    const logContent = generateChangeLog(spreadUpdates);
    const logPath = path.join(__dirname, 'output/update-preview.md');
    fs.writeFileSync(logPath, logContent, 'utf-8');
    console.log(`\nPreview log written to: ${logPath}`);
    return;
  }

  // Push to Sanity
  console.log('Pushing updates to Sanity...');
  const { updated, errors } = await pushUpdates(spreadUpdates);

  console.log('\n' + '='.repeat(60));
  console.log('Update complete!');
  console.log('='.repeat(60));
  console.log(`Successfully updated: ${updated}`);
  console.log(`Errors: ${errors}`);

  // Write change log
  const logContent = generateChangeLog(spreadUpdates);
  const timestamp = new Date().toISOString().split('T')[0];
  const logPath = path.join(__dirname, `output/update-log-${timestamp}.md`);
  fs.writeFileSync(logPath, logContent, 'utf-8');
  console.log(`\nChange log written to: ${logPath}`);
}

main().catch(console.error);
