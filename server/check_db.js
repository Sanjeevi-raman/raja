const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Admins
  const admin = await db.collection('admins').findOne({});
  console.log('ADMINS:', JSON.stringify(admin));
  if (admin) {
    const ok = await bcrypt.compare('Raja@123', admin.passwordHash);
    console.log('PASSWORD Raja@123 matches:', ok);
    const ok2 = await bcrypt.compare(process.env.ADMIN_PASSWORD, admin.passwordHash);
    console.log('PASSWORD from env matches:', ok2, 'env pw:', process.env.ADMIN_PASSWORD);
  }

  // Content
  const content = await db.collection('contents').findOne({ key: 'main' });
  if (content) {
    const data = content.data || {};
    console.log('CONTENT products count:', (data.products || []).length);
    console.log('CONTENT products:', (data.products || []).map(p => ({ id: p.id, name: p.name })));
    console.log('CONTENT has projects:', Array.isArray(data.projects), 'gallery:', (data.gallery || []).length);
    console.log('CONTENT categories:', (data.categories || []).map(c => c.name));
    console.log('CONTENT brands:', (data.brands || []).map(b => b.name));
    console.log('CONTENT industries:', (data.industries || []).map(i => i.name));
  } else {
    console.log('NO CONTENT RECORD');
  }

  // Enquiries & Orders
  console.log('ENQUIRIES count:', await db.collection('enquiries').countDocuments());
  console.log('ORDERS count:', await db.collection('orders').countDocuments());
  console.log('PRODUCTS count:', await db.collection('products').countDocuments());
  console.log('PRODUCTS:', await db.collection('products').find({}, { projection: { _id: 0, id: 1, name: 1, category: 1 } }).sort({ createdAt: -1 }).toArray());
  console.log('CATALOGUES count:', await db.collection('catalogues').countDocuments());

  // Check image size in content
  if (content) {
    const raw = JSON.stringify(content.data || {});
    console.log('Content doc size bytes:', Buffer.byteLength(raw));
    const matches = raw.match(/data:image\/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]{50,}/g) || [];
    console.log('Base64 image data urls embedded:', matches.length);
    matches.forEach(m => console.log('  prefix:', m.slice(0, 60), '... length:', m.length));
  }

  await mongoose.disconnect();
}

run().catch(e => { console.error('ERROR:', e); process.exit(1); });
