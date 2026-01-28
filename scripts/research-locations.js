/**
 * Location Research Script
 *
 * Analyzes artworks from Sanity CMS to identify missing coordinates
 * and generates a research report for manual review.
 *
 * Usage:
 *   cd scripts
 *   SANITY_PROJECT_ID=xxx SANITY_TOKEN=xxx node research-locations.js
 *
 * Options:
 *   --dry-run    Preview without generating report files
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
  useCdn: true,
};

// Validate config
if (!config.projectId) {
  console.error('Error: Missing SANITY_PROJECT_ID');
  process.exit(1);
}

const client = createClient(config);

// Load museum bounds data
const MUSEUM_BOUNDS_PATH = path.join(__dirname, 'data/museum-bounds.json');
const museumBounds = JSON.parse(fs.readFileSync(MUSEUM_BOUNDS_PATH, 'utf-8'));

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

/**
 * Find museum data by name (checks exact match and aliases)
 */
function findMuseumData(museumName) {
  if (!museumName) return null;

  const normalizedName = museumName.toLowerCase().trim();

  for (const [name, data] of Object.entries(museumBounds)) {
    // Check exact match
    if (name.toLowerCase() === normalizedName) {
      return { name, ...data };
    }
    // Check aliases
    if (data.aliases && data.aliases.some(alias => alias.toLowerCase() === normalizedName)) {
      return { name, ...data };
    }
    // Check partial match
    if (normalizedName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedName)) {
      return { name, ...data };
    }
    // Check partial alias match
    if (data.aliases && data.aliases.some(alias =>
      normalizedName.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalizedName)
    )) {
      return { name, ...data };
    }
  }

  return null;
}

/**
 * Analyze an artwork and determine what coordinate data is missing
 */
function analyzeArtwork(artwork) {
  const hasDisplayCoords = artwork.displayedCoordinates?.latitude && artwork.displayedCoordinates?.longitude;
  const hasOriginCoords = artwork.originatedCoordinates?.latitude && artwork.originatedCoordinates?.longitude;

  const analysis = {
    id: artwork.id,
    name: artwork.name,
    museum: artwork.museum || '',
    displayedLocation: artwork.displayedLocation || '',
    location: artwork.location || '',
    hasDisplayCoords,
    hasOriginCoords,
    missingDisplay: !hasDisplayCoords,
    missingOrigin: !hasOriginCoords,
    currentDisplayLat: artwork.displayedCoordinates?.latitude,
    currentDisplayLng: artwork.displayedCoordinates?.longitude,
    currentOriginLat: artwork.originatedCoordinates?.latitude,
    currentOriginLng: artwork.originatedCoordinates?.longitude,
    suggestedDisplayCoords: null,
    suggestedOriginCoords: null,
    confidence: 'none',
    notes: [],
  };

  // Try to find museum coordinates if display coords are missing
  if (!hasDisplayCoords && artwork.museum) {
    const museumData = findMuseumData(artwork.museum);
    if (museumData) {
      analysis.suggestedDisplayCoords = museumData.center;
      analysis.suggestedMuseum = museumData.name;
      analysis.confidence = 'high';
      analysis.notes.push(`Found museum match: ${museumData.name} in ${museumData.city}`);
    } else {
      analysis.notes.push(`Museum "${artwork.museum}" not found in database`);
    }
  }

  return analysis;
}

/**
 * Group artworks by museum for coordinate spreading
 */
function groupByMuseum(artworks) {
  const groups = {};

  for (const artwork of artworks) {
    if (artwork.museum) {
      const museumData = findMuseumData(artwork.museum);
      const key = museumData ? museumData.name : artwork.museum;

      if (!groups[key]) {
        groups[key] = {
          museumData,
          artworks: [],
        };
      }
      groups[key].artworks.push(artwork);
    }
  }

  return groups;
}

/**
 * Generate markdown report
 */
function generateReport(analyses, museumGroups, totalArtworks) {
  const now = new Date().toISOString();
  const missingDisplay = analyses.filter(a => a.missingDisplay);
  const missingOrigin = analyses.filter(a => a.missingOrigin);
  const withSuggestions = analyses.filter(a => a.suggestedDisplayCoords);
  const needsManualReview = missingDisplay.filter(a => !a.suggestedDisplayCoords);

  let report = `# Location Research Report
Generated: ${now}

## Summary
- **Total artworks:** ${totalArtworks}
- **Missing display coordinates:** ${missingDisplay.length} (${((missingDisplay.length / totalArtworks) * 100).toFixed(1)}%)
- **Missing origin coordinates:** ${missingOrigin.length} (${((missingOrigin.length / totalArtworks) * 100).toFixed(1)}%)
- **Auto-suggested from museum data:** ${withSuggestions.length}
- **Needs manual research:** ${needsManualReview.length}

---

## Auto-Suggested Updates (Ready for Review)

These artworks have museums that match our database. Verify and approve before applying.

| ID | Name | Museum | Suggested Lat | Suggested Lng | Confidence | Notes |
|----|------|--------|---------------|---------------|------------|-------|
`;

  for (const analysis of withSuggestions.sort((a, b) => a.id - b.id)) {
    const name = analysis.name.length > 35 ? analysis.name.substring(0, 35) + '...' : analysis.name;
    const museum = analysis.suggestedMuseum || analysis.museum;
    const museumShort = museum.length > 25 ? museum.substring(0, 25) + '...' : museum;
    report += `| ${analysis.id} | ${name} | ${museumShort} | ${analysis.suggestedDisplayCoords.lat.toFixed(4)} | ${analysis.suggestedDisplayCoords.lng.toFixed(4)} | ${analysis.confidence} | ${analysis.notes.join('; ')} |\n`;
  }

  report += `
---

## Needs Manual Research

These artworks have missing display coordinates and could not be automatically resolved.
Research each one to find the current museum/location.

| ID | Name | Listed Museum | Listed Display Location | Search Query |
|----|------|---------------|-------------------------|--------------|
`;

  for (const analysis of needsManualReview.sort((a, b) => a.id - b.id)) {
    const name = analysis.name.length > 30 ? analysis.name.substring(0, 30) + '...' : analysis.name;
    const museum = analysis.museum.length > 20 ? analysis.museum.substring(0, 20) + '...' : analysis.museum;
    const displayLoc = analysis.displayedLocation.length > 20 ? analysis.displayedLocation.substring(0, 20) + '...' : analysis.displayedLocation;
    const searchQuery = encodeURIComponent(`"${analysis.name}" museum current location`);
    report += `| ${analysis.id} | ${name} | ${museum || '-'} | ${displayLoc || '-'} | [Search](https://www.google.com/search?q=${searchQuery}) |\n`;
  }

  report += `
---

## Museum Coordinate Spreading

When multiple artworks share the same museum, coordinates should be spread within the museum bounds.

| Museum | Artwork Count | Has Bounds Data | Spread Range |
|--------|---------------|-----------------|--------------|
`;

  for (const [museum, group] of Object.entries(museumGroups).sort((a, b) => b[1].artworks.length - a[1].artworks.length)) {
    if (group.artworks.length > 1) {
      const hasBounds = group.museumData?.bounds ? 'Yes' : 'No';
      let spreadRange = '-';
      if (group.museumData?.bounds) {
        const latRange = (group.museumData.bounds.maxLat - group.museumData.bounds.minLat).toFixed(4);
        const lngRange = (group.museumData.bounds.maxLng - group.museumData.bounds.minLng).toFixed(4);
        spreadRange = `${latRange}° lat, ${lngRange}° lng`;
      }
      report += `| ${museum} | ${group.artworks.length} | ${hasBounds} | ${spreadRange} |\n`;
    }
  }

  report += `
---

## Missing Origin Coordinates

These artworks have missing origin (creation location) coordinates.

| ID | Name | Listed Origin Location | Search Query |
|----|------|------------------------|--------------|
`;

  for (const analysis of missingOrigin.sort((a, b) => a.id - b.id)) {
    const name = analysis.name.length > 35 ? analysis.name.substring(0, 35) + '...' : analysis.name;
    const location = analysis.location.length > 30 ? analysis.location.substring(0, 30) + '...' : analysis.location;
    const searchQuery = encodeURIComponent(`"${analysis.location}" coordinates`);
    report += `| ${analysis.id} | ${name} | ${location || '-'} | [Search](https://www.google.com/search?q=${searchQuery}) |\n`;
  }

  report += `
---

## All Artworks Status

Complete list showing coordinate status for every artwork.

| ID | Name | Display Coords | Origin Coords | Museum |
|----|------|----------------|---------------|--------|
`;

  for (const analysis of analyses.sort((a, b) => a.id - b.id)) {
    const name = analysis.name.length > 30 ? analysis.name.substring(0, 30) + '...' : analysis.name;
    const displayStatus = analysis.hasDisplayCoords ? `✓ ${analysis.currentDisplayLat?.toFixed(2)}, ${analysis.currentDisplayLng?.toFixed(2)}` : '✗ Missing';
    const originStatus = analysis.hasOriginCoords ? `✓ ${analysis.currentOriginLat?.toFixed(2)}, ${analysis.currentOriginLng?.toFixed(2)}` : '✗ Missing';
    const museum = (analysis.museum || '-').length > 25 ? (analysis.museum || '-').substring(0, 25) + '...' : (analysis.museum || '-');
    report += `| ${analysis.id} | ${name} | ${displayStatus} | ${originStatus} | ${museum} |\n`;
  }

  return report;
}

/**
 * Generate JSON file with suggested updates for push script
 */
function generateUpdatesJson(analyses) {
  const updates = analyses
    .filter(a => a.suggestedDisplayCoords)
    .map(a => ({
      id: a.id,
      name: a.name,
      museum: a.suggestedMuseum || a.museum,
      displayedCoordinates: {
        latitude: a.suggestedDisplayCoords.lat,
        longitude: a.suggestedDisplayCoords.lng,
      },
      confidence: a.confidence,
      autoSuggested: true,
      approved: false, // Set to true after manual review
    }));

  return JSON.stringify(updates, null, 2);
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Artwork Location Research Script');
  console.log('='.repeat(60));
  console.log(`Project ID: ${config.projectId}`);
  console.log(`Dataset: ${config.dataset}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'GENERATE REPORTS'}`);
  console.log('='.repeat(60));
  console.log('');

  // Fetch all artworks from Sanity
  console.log('Fetching artworks from Sanity...');
  const query = `*[_type == "artwork"] | order(id asc) {
    id,
    name,
    museum,
    displayedLocation,
    location,
    displayedCoordinates,
    originatedCoordinates
  }`;

  const artworks = await client.fetch(query);
  console.log(`Found ${artworks.length} artworks\n`);

  // Analyze each artwork
  console.log('Analyzing coordinate data...');
  const analyses = artworks.map(analyzeArtwork);

  // Group by museum
  const museumGroups = groupByMuseum(artworks);

  // Statistics
  const missingDisplay = analyses.filter(a => a.missingDisplay).length;
  const missingOrigin = analyses.filter(a => a.missingOrigin).length;
  const withSuggestions = analyses.filter(a => a.suggestedDisplayCoords).length;

  console.log('\nAnalysis Results:');
  console.log('-'.repeat(40));
  console.log(`Total artworks: ${artworks.length}`);
  console.log(`Missing display coordinates: ${missingDisplay} (${((missingDisplay / artworks.length) * 100).toFixed(1)}%)`);
  console.log(`Missing origin coordinates: ${missingOrigin} (${((missingOrigin / artworks.length) * 100).toFixed(1)}%)`);
  console.log(`Auto-suggested updates: ${withSuggestions}`);
  console.log(`Needs manual research: ${missingDisplay - withSuggestions}`);
  console.log(`Museums with multiple pieces: ${Object.values(museumGroups).filter(g => g.artworks.length > 1).length}`);
  console.log('');

  if (DRY_RUN) {
    console.log('DRY RUN: Would generate the following files:');
    console.log('  - scripts/output/location-research-report.md');
    console.log('  - scripts/output/suggested-updates.json');
    return;
  }

  // Generate reports
  console.log('Generating reports...');

  const reportContent = generateReport(analyses, museumGroups, artworks.length);
  const reportPath = path.join(__dirname, 'output/location-research-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  console.log(`✓ Written: ${reportPath}`);

  const updatesContent = generateUpdatesJson(analyses);
  const updatesPath = path.join(__dirname, 'output/suggested-updates.json');
  fs.writeFileSync(updatesPath, updatesContent, 'utf-8');
  console.log(`✓ Written: ${updatesPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('Research complete!');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Review location-research-report.md');
  console.log('2. Manually research items in "Needs Manual Research" section');
  console.log('3. Edit suggested-updates.json - set approved: true for verified entries');
  console.log('4. Add manual research findings to suggested-updates.json');
  console.log('5. Run push-location-updates.js to apply changes to Sanity');
}

main().catch(console.error);
