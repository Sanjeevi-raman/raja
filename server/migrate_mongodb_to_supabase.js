const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

const mongoose = require('mongoose');
const supabase = require('./supabase');

function cleanObject(value) {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(cleanObject);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    // Convert MongoDB ObjectId / BSON objects safely
    if (
      value._bsontype === 'ObjectId' ||
      value._bsontype === 'ObjectID'
    ) {
      return value.toString();
    }

    const result = {};

    for (const [key, val] of Object.entries(value)) {
      if (key === '_id') {
        result.mongoId = String(val);
      } else {
        result[key] = cleanObject(val);
      }
    }

    return result;
  }

  return value;
}

function makeId(item, index, prefix) {
  if (item?.id) return String(item.id);

  if (item?._id) return String(item._id);

  return `${prefix}-${index + 1}`;
}

async function upsertRows(table, rows) {
  if (!rows.length) {
    console.log(`⚠️ ${table}: no records`);
    return;
  }

  const { error } = await supabase
    .from(table)
    .upsert(rows, {
      onConflict: 'id',
    });

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  console.log(`✅ ${table}: ${rows.length} records migrated`);
}

async function migrate() {
  console.log('');
  console.log('======================================');
  console.log(' MongoDB → Supabase Migration');
  console.log('======================================');
  console.log('');

  // ------------------------------------
  // Connect MongoDB
  // ------------------------------------

  await mongoose.connect(process.env.MONGODB_URI);

  console.log('✅ MongoDB connected');

  const db = mongoose.connection.db;

  // ------------------------------------
  // CONTENTS
  // ------------------------------------

  const content = await db
    .collection('contents')
    .findOne({ key: 'main' });

  if (!content) {
    console.log('⚠️ No contents document with key "main"');
  } else {
    const data = cleanObject(content.data || {});

    // ----------------------------------
    // SITE SETTINGS
    // ----------------------------------

    const { error: siteError } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 1,
          data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

    if (siteError) {
      throw new Error(`site_settings: ${siteError.message}`);
    }

    console.log('✅ site_settings migrated');

    // ----------------------------------
    // PRODUCTS FROM CONTENT
    // ----------------------------------

    const contentProducts = Array.isArray(data.products)
      ? data.products
      : [];

    const productRows = contentProducts.map((item, index) => ({
      id: makeId(item, index, 'product'),
      name: item.name || `Product ${index + 1}`,
      category: item.category || null,
      description: item.description || null,
      price:
        typeof item.price === 'number'
          ? item.price
          : null,
      image:
        item.image ||
        item.imageUrl ||
        item.thumbnail ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('products', productRows);

    // ----------------------------------
    // PROJECTS
    // ----------------------------------

    const projects = Array.isArray(data.projects)
      ? data.projects
      : [];

    const projectRows = projects.map((item, index) => ({
      id: makeId(item, index, 'project'),
      name:
        item.name ||
        item.title ||
        `Project ${index + 1}`,
      description:
        item.description ||
        null,
      image:
        item.image ||
        item.imageUrl ||
        item.thumbnail ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('projects', projectRows);

    // ----------------------------------
    // GALLERY
    // ----------------------------------

    const gallery = Array.isArray(data.gallery)
      ? data.gallery
      : [];

    const galleryRows = gallery.map((item, index) => ({
      id: makeId(item, index, 'gallery'),
      title:
        item.title ||
        item.name ||
        `Gallery ${index + 1}`,
      image:
        item.image ||
        item.imageUrl ||
        item.url ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('gallery', galleryRows);

    // ----------------------------------
    // BRANDS
    // ----------------------------------

    const brands = Array.isArray(data.brands)
      ? data.brands
      : [];

    const brandRows = brands.map((item, index) => ({
      id: makeId(item, index, 'brand'),
      name:
        item.name ||
        `Brand ${index + 1}`,
      logo:
        item.logo ||
        item.image ||
        item.imageUrl ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('brands', brandRows);

    // ----------------------------------
    // CATEGORIES
    // ----------------------------------

    const categories = Array.isArray(data.categories)
      ? data.categories
      : [];

    const categoryRows = categories.map((item, index) => ({
      id: makeId(item, index, 'category'),
      name:
        item.name ||
        `Category ${index + 1}`,
      image:
        item.image ||
        item.imageUrl ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('categories', categoryRows);

    // ----------------------------------
    // INDUSTRIES
    // ----------------------------------

    const industries = Array.isArray(data.industries)
      ? data.industries
      : [];

    const industryRows = industries.map((item, index) => ({
      id: makeId(item, index, 'industry'),
      name:
        item.name ||
        `Industry ${index + 1}`,
      image:
        item.image ||
        item.imageUrl ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    }));

    await upsertRows('industries', industryRows);
  }

  // ------------------------------------
  // EXISTING PRODUCTS COLLECTION
  // ------------------------------------

  const mongoProducts = await db
    .collection('products')
    .find({})
    .toArray();

  console.log(
    `MongoDB products collection: ${mongoProducts.length}`
  );

  for (let i = 0; i < mongoProducts.length; i++) {
    const item = cleanObject(mongoProducts[i]);

    const row = {
      id: makeId(item, i, 'product-db'),
      name:
        item.name ||
        `Product ${i + 1}`,
      category:
        item.category ||
        null,
      description:
        item.description ||
        null,
      price:
        typeof item.price === 'number'
          ? item.price
          : null,
      image:
        item.image ||
        item.imageUrl ||
        null,
      data: item,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(row, {
        onConflict: 'id',
      });

    if (error) {
      console.error(
        `❌ Product ${row.id}:`,
        error.message
      );
    }
  }

  console.log('✅ MongoDB products collection migrated');

  // ------------------------------------
  // ENQUIRIES
  // ------------------------------------

  const enquiries = await db
    .collection('enquiries')
    .find({})
    .toArray();

  for (const item of enquiries) {
    const clean = cleanObject(item);

    delete clean.id;

    const { error } = await supabase
      .from('enquiries')
      .insert({
        data: clean,
        created_at:
          item.createdAt instanceof Date
            ? item.createdAt.toISOString()
            : new Date().toISOString(),
      });

    if (error) {
      console.error(
        '❌ Enquiry migration:',
        error.message
      );
    }
  }

  console.log(
    `✅ Enquiries migrated: ${enquiries.length}`
  );

  // ------------------------------------
  // ORDERS
  // ------------------------------------

  const orders = await db
    .collection('orders')
    .find({})
    .toArray();

  for (const item of orders) {
    const clean = cleanObject(item);

    delete clean.id;

    const { error } = await supabase
      .from('orders')
      .insert({
        data: clean,
        created_at:
          item.createdAt instanceof Date
            ? item.createdAt.toISOString()
            : new Date().toISOString(),
      });

    if (error) {
      console.error(
        '❌ Order migration:',
        error.message
      );
    }
  }

  console.log(
    `✅ Orders migrated: ${orders.length}`
  );

  // ------------------------------------
  // CATALOGUES
  // ------------------------------------

  const catalogues = await db
    .collection('catalogues')
    .find({})
    .toArray();

  for (const item of catalogues) {
    const clean = cleanObject(item);

    delete clean.id;

    const { error } = await supabase
      .from('catalogues')
      .insert({
        data: clean,
        created_at:
          item.createdAt instanceof Date
            ? item.createdAt.toISOString()
            : new Date().toISOString(),
      });

    if (error) {
      console.error(
        '❌ Catalogue migration:',
        error.message
      );
    }
  }

  console.log(
    `✅ Catalogues migrated: ${catalogues.length}`
  );

  // ------------------------------------
  // ADMINS
  // ------------------------------------

  const admins = await db
    .collection('admins')
    .find({})
    .toArray();

  for (const admin of admins) {
    const clean = cleanObject(admin);

    const email =
      clean.email ||
      null;

    if (!email) {
      console.log(
        '⚠️ Admin skipped because email is missing'
      );
      continue;
    }

    const { error } = await supabase
      .from('admins')
      .upsert(
        {
          email,
          password_hash:
            clean.passwordHash ||
            clean.password_hash ||
            null,
          data: clean,
        },
        {
          onConflict: 'email',
        }
      );

    if (error) {
      console.error(
        '❌ Admin migration:',
        error.message
      );
    }
  }

  console.log(
    `✅ Admins migrated: ${admins.length}`
  );

  // ------------------------------------
  // CLOSE
  // ------------------------------------

  await mongoose.disconnect();

  console.log('');
  console.log('======================================');
  console.log(' 🎉 MIGRATION COMPLETED');
  console.log('======================================');
  console.log('');
  console.log('MongoDB has NOT been deleted.');
  console.log('Supabase now contains a copy of the data.');
  console.log('');
}

migrate().catch(async (error) => {
  console.error('');
  console.error('❌ MIGRATION FAILED');
  console.error(error);
  console.error('');

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});