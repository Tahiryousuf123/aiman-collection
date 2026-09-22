import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../apps/api/src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);

  const cleanMap = {
    'prod-1788691956929': 'images/uploads/ambossed_fabric.jpg',
    'prod-1788691452220': 'images/uploads/self_print_orange.jpg',
    'prod-1788691110455': 'images/uploads/self_boski_blue.jpg',
    'prod-1788690672181': 'images/uploads/self_boski_brown.jpg',
    'prod-1788690322612': 'images/uploads/self_boski_lavender.jpg'
  };

  // 1. Update real merchant products with clean image file paths in MongoDB
  for (const [id, imgPath] of Object.entries(cleanMap)) {
    const res = await Product.updateOne({ id }, { $set: { image: imgPath } });
    console.log(`Updated real product ${id} -> ${imgPath} (matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);
  }

  // 2. Clear mock images from mock products 1..12 in MongoDB
  for (let i = 1; i <= 12; i++) {
    const res = await Product.updateOne({ id: String(i) }, { $set: { image: '', imageStyle: '' } });
    console.log(`Cleared mock image for id ${i} (matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);
  }

  // 3. Clear any products that still reference mock picture files
  const mockImgs = [
    'images/black_formal.jpg',
    'images/summer_collection.jpg',
    'images/mauve_pret.jpg',
    'images/boski_fabric.jpg',
    'images/silk_rida.jpg',
    'images/cosmetic_bag.png',
    'images/designer_handbag.png',
    'images/lavender_rida.png',
    'images/luxury_rida.png'
  ];
  const resExtra = await Product.updateMany({ image: { $in: mockImgs } }, { $set: { image: '', imageStyle: '' } });
  console.log('Extra mock images cleared in MongoDB:', resExtra.modifiedCount);

  // 4. Verify MongoDB contents
  const all = await Product.find({}).sort({ createdAt: -1 });
  console.log('\n=== CURRENT MONGODB ATLAS PRODUCTS ===');
  all.forEach((p, idx) => {
    console.log(`${idx + 1}. ID: ${p.id} | Title: ${p.title} | Image: "${p.image || '(No image / Clean)'}"`);
  });

  await mongoose.disconnect();
  console.log('\n✅ MongoDB Atlas image sync completed successfully!');
}

run().catch(err => {
  console.error('Error syncing MongoDB images:', err);
  process.exit(1);
});
