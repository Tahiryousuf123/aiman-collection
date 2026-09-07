const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']); } catch(e){}
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://aimanyousuf78_db_user:RP1ejc8Hy54nJ7Mg@cluster0.llqvcmf.mongodb.net/aiman_collection?retryWrites=true&w=majority&appName=Cluster0';

async function cleanup() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const collection = mongoose.connection.collection('products');

  // Remove test/dummy junk products with undefined title or dummy data
  const junkIds = ['prod-01', 'prod-02', 'prod-03', 'prod-04', 'prod-05', 'prod-1788659024834', 'prod-1788663982954', 'prod-1788786967473'];
  const delResult = await collection.deleteMany({ id: { $in: junkIds } });
  console.log('Deleted junk docs count:', delResult.deletedCount);

  // Sync real products from db_store.json
  const localDb = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/db_store.json'), 'utf8'));
  const products = (localDb.products || []).filter(p => !junkIds.includes(String(p.id)));

  for (const p of products) {
    const cleanTitle = p.title || p.name || 'Bohra Libas Ensemble';
    const doc = {
      id: String(p.id),
      slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: cleanTitle,
      title: cleanTitle,
      category: p.category || 'heavy-rida',
      price: Number(p.price) || 0,
      regularPrice: Number(p.regularPrice || p.originalPrice || (p.price * 1.5)),
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
    await collection.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
    console.log('✓ Cleanly Synced:', doc.id, doc.title);
  }

  // Update data/db_store.json as well to eliminate junk
  localDb.products = products;
  fs.writeFileSync(path.join(__dirname, '../data/db_store.json'), JSON.stringify(localDb, null, 2), 'utf8');

  const finalDocs = await collection.find().toArray();
  console.log(`\n🎉 Total clean docs now in MongoDB Atlas: ${finalDocs.length}`);
  finalDocs.forEach(d => console.log(` -> [${d.id}] "${d.title}" (Rs. ${d.price})`));

  await mongoose.disconnect();
}

cleanup().catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
