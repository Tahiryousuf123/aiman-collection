const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://aimanyousuf78_db_user:RP1ejc8Hy54nJ7Mg@cluster0.llqvcmf.mongodb.net/aiman_collection?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to MongoDB Atlas!');

  const localDb = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/db_store.json'), 'utf8'));
  const products = localDb.products || [];
  console.log(`Found ${products.length} products in data/db_store.json`);

  const Product = mongoose.connection.collection('products');

  try {
    await Product.dropIndex('slug_1');
    console.log('✓ Successfully dropped restrictive slug_1 unique index from MongoDB Atlas!');
  } catch (e) {
    console.log('Index note:', e.message);
  }

  for (const p of products) {
    const doc = {
      id: String(p.id),
      slug: p.slug || (p.title || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: p.name || p.title,
      title: p.title || p.name,
      category: p.category || 'heavy-rida',
      price: Number(p.price) || 0,
      regularPrice: Number(p.regularPrice || p.originalPrice || p.price * 1.5),
      discount: Number(p.discount) || 0,
      image: p.image || 'images/summer_collection.jpg',
      imageStyle: p.imageStyle || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      stockStatus: p.stockStatus || 'in-stock',
      status: p.stockStatus || 'available',
      inStock: p.stockStatus !== 'sold-out',
      isNew: Boolean(p.isNew),
      isSale: Boolean(p.isSale),
      bestSeller: Boolean(p.bestSeller)
    };

    await Product.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
    console.log(`  ✓ Synced product: [${doc.id}] ${doc.title} (${doc.category})`);
  }

  const count = await Product.countDocuments();
  console.log(`\n🎉 Total products now in MongoDB Atlas: ${count}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Sync error:', err);
  process.exit(1);
});
