import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: 'o12a3h5d',
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const artworks = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/data/artworks.json')));
const imagesDir = path.join(__dirname, '../frontend/src/artImages');

async function uploadAllImages() {
  console.log(`Uploading images for ${artworks.length} artworks...`);

  for (const artwork of artworks) {
    if (!artwork.image || artwork.image.length === 0) continue;

    const images = [];
    for (const imgName of artwork.image) {
      const imgPath = path.join(imagesDir, imgName);
      if (!fs.existsSync(imgPath)) {
        console.log(`  Missing: ${imgName}`);
        continue;
      }

      try {
        const buffer = fs.readFileSync(imgPath);
        const asset = await client.assets.upload('image', buffer, { filename: imgName });
        images.push({
          _type: 'image',
          _key: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          asset: { _type: 'reference', _ref: asset._id }
        });
      } catch (err) {
        console.log(`  Error uploading ${imgName}: ${err.message}`);
      }
    }

    if (images.length > 0) {
      await client.patch(`artwork-${artwork.id}`).set({ images }).commit();
      console.log(`Artwork ${artwork.id}: ${artwork.name.slice(0, 30)} - ${images.length} image(s)`);
    }
  }
  console.log('All images uploaded!');
}

uploadAllImages().catch(console.error);
