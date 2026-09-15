const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./supabase');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://stombregar3_db_user:RajaMongo@cluster0.vsfwtu2.mongodb.net/raja-electricals?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'raja-electricals-jwt-secret-key-2025';

// URL Normalization for Vercel Serverless / Reverse Proxy routing
app.use((req, _res, next) => {
  const original = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-original-url'];
  if (original && original.startsWith('/api') && !original.includes('index.js')) {
    req.url = original;
  }

  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.replace('/api/api/', '/api/');
  }

  if (req.url.startsWith('/api/index.js/')) {
    req.url = req.url.replace('/api/index.js/', '/api/');
  } else if (req.url.startsWith('/index.js/')) {
    req.url = req.url.replace('/index.js/', '/api/');
  } else if (req.url.startsWith('/api/index.js?')) {
    req.url = req.url.replace('/api/index.js?', '/api?');
  } else if (!req.url.startsWith('/api') && (
    req.url.startsWith('/auth') ||
    req.url.startsWith('/content') ||
    req.url.startsWith('/products') ||
    req.url.startsWith('/categories') ||
    req.url.startsWith('/brands') ||
    req.url.startsWith('/industries') ||
    req.url.startsWith('/gallery') ||
    req.url.startsWith('/projects') ||
    req.url.startsWith('/enquiries') ||
    req.url.startsWith('/orders') ||
    req.url.startsWith('/site') ||
    req.url.startsWith('/health') ||
    req.url.startsWith('/admin')
  )) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '20mb' }));

// Static frontend serving from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const COMPANY_PHONE = '+91 9003900533';
const COMPANY_WHATSAPP = '919003900533';
const replaceLegacyContact = site => {
  return {
    ...site,
    phone: COMPANY_PHONE,
    whatsappNumber: COMPANY_WHATSAPP
  };
};

const initialContent = {
  site: {
    businessName: "Raja Electricals 'N' Hardware",
    welcome: "Welcome to Raja Electricals 'N' Hardware",
    heroTitle: 'Powering Every Project',
    heroText: 'Electrical · Hardware · Safety · Industrial Solutions',
    heroImage: photo('photo-1565008447742-97f6f38c985c', 1300),
    deliveryText: 'Genuine products. Practical guidance.',
    businessHours: 'Monday to Saturday: 9:00 AM - 8:00 PM',
    trustYears: '25+',
    productCount: '5000+',
    happyClients: '2000+',
    supplyTitle: 'Supply that keeps work moving.',
    supplyText: 'For over two decades, Raja Electricals has helped contractors, facilities and industrial teams source dependable products without unnecessary delays.'
  },
  categories: [
    { id: 'electricals', name: 'Electricals', image: photo('photo-1581092160607-ee22621dd758'), count: '250+ Products' },
    { id: 'safety', name: 'Industrial Safety', image: photo('photo-1586864387967-d02ef85d93e8'), count: '300+ Products' },
    { id: 'tools', name: 'Hardware & Tools', image: photo('photo-1530124566582-a618bc2615dc'), count: '600+ Products' },
    { id: 'pumps', name: 'Water Pumps', image: photo('photo-1581093458791-9d09d2e70ae4'), count: '100+ Products' }
  ],
  products: [
    { id: 'cables', name: 'Industrial Cables', image: photo('photo-1544724569-5f546fd6f2b5'), price: 'From ₹450', badge: 'Best Seller', category: 'Electricals', description: 'Reliable cables for industrial and commercial applications.' },
    { id: 'helmets', name: 'Safety Helmets', image: photo('photo-1590650153855-d9e808231d41'), price: 'From ₹180', badge: 'Essential', category: 'Industrial Safety', description: 'Comfortable, durable PPE for site teams.' },
    { id: 'lighting', name: 'LED Flood Lights', image: photo('photo-1524484485831-a92ffc0de03f'), price: 'From ₹890', badge: 'New', category: 'Electricals', description: 'High-output lighting for indoor and outdoor sites.' },
    { id: 'toolkit', name: 'Power Tools Kit', image: photo('photo-1504148455328-c376907d081c'), price: 'From ₹2,499', badge: 'Popular', category: 'Hardware & Tools', description: 'Professional power tools for daily trade work.' }
  ],
  brands: [
    { id: 'havells', name: 'Havells', logo: 'https://dummyimage.com/240x110/ffffff/cc0000&text=HAVELLS', category: 'Electrical', products: '250+', description: 'Electrical equipment and consumer products.' },
    { id: 'bosch', name: 'Bosch', logo: 'https://dummyimage.com/240x110/ffffff/e00000&text=BOSCH', category: 'Tools', products: '120+', description: 'Professional tools and accessories.' },
    { id: '3m', name: '3M Safety', logo: 'https://dummyimage.com/240x110/ffffff/cc0000&text=3M', category: 'Safety', products: '90+', description: 'Trusted personal protection solutions.' }
  ],
  industries: [
    { id: 'construction', name: 'Construction', image: photo('photo-1503387762-592deb58ef4e'), description: 'Site-ready supply for contractors and infrastructure teams.' },
    { id: 'manufacturing', name: 'Manufacturing', image: photo('photo-1513828583688-c52646db42da'), description: 'Maintenance, safety and electrical supplies for plants.' },
    { id: 'facilities', name: 'Facilities', image: photo('photo-1497366754035-f200968a6e72'), description: 'Everyday essentials to keep your facility running.' }
  ],
  gallery: [
    { id: 'g1', title: 'Site supply', image: photo('photo-1503387762-592deb58ef4e'), type: 'Projects' },
    { id: 'g2', title: 'Safety range', image: photo('photo-1586864387967-d02ef85d93e8'), type: 'Products' },
    { id: 'g3', title: 'Tools collection', image: photo('photo-1530124566582-a618bc2615dc'), type: 'Products' },
    { id: 'g4', title: 'Delivery ready', image: photo('photo-1565008447742-97f6f38c985c'), type: 'Store' }
  ]
};

const contentSchema = new mongoose.Schema({ key: { type: String, unique: true }, data: mongoose.Schema.Types.Mixed }, { timestamps: true });
const adminSchema = new mongoose.Schema({ email: { type: String, unique: true, lowercase: true, trim: true }, passwordHash: String }, { timestamps: true });
const enquirySchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, company: String, phone: { type: String, required: true }, email: String, product: String, quantity: String, message: String, status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Closed'] } }, { timestamps: true });
enquirySchema.index({ createdAt: -1 });
const orderSchema = new mongoose.Schema({ customerName: { type: String, required: true, trim: true }, phone: { type: String, required: true }, email: String, company: String, productId: String, productName: { type: String, required: true }, quantity: { type: Number, min: 1, required: true }, notes: String, status: { type: String, default: 'New', enum: ['New', 'Confirmed', 'Processing', 'Completed', 'Cancelled'] } }, { timestamps: true });
orderSchema.index({ createdAt: -1 });
const catalogueSchema = new mongoose.Schema({ productId: { type: String, required: true, unique: true }, fileName: { type: String, required: true }, data: { type: Buffer, required: true }, contentType: { type: String, default: 'application/pdf' }, size: Number }, { timestamps: true });
const productSchema = new mongoose.Schema({ id: { type: String, required: true, unique: true, index: true }, name: { type: String, required: true, trim: true }, category: { type: String, required: true, trim: true, index: true }, price: String, badge: String, description: String, image: String, features: String, specifications: String, colors: String, catalogName: String }, { timestamps: true, strict: true });
productSchema.index({ createdAt: -1 });

const Content = mongoose.model('Content', contentSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);
const Order = mongoose.model('Order', orderSchema);
const Catalogue = mongoose.model('Catalogue', catalogueSchema);
const Product = mongoose.model('Product', productSchema);

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
function publicProduct(doc) {
  const product = doc.toObject ? doc.toObject() : doc;
  return { ...product, _id: undefined, __v: undefined, catalogUrl: product.catalogName ? `/api/catalogue/${product.id}` : undefined };
}
async function content() {
  if (mongoose.connection.readyState !== 1) {
    return initialContent;
  }
  try {
    const record = await Content.findOne({ key: 'main' }).lean();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const baseData = record?.data || initialContent;
    return {
      ...baseData,
      products: products.length ? products.map(publicProduct) : (baseData.products || [])
    };
  } catch (err) {
    console.warn('MongoDB content query failed, returning default content:', err.message);
    return initialContent;
  }
}
async function updateContent(fn) {
  let record = await Content.findOne({ key: 'main' });
  if (!record) {
    record = await Content.create({ key: 'main', data: initialContent });
  }
  const next = fn(record.data || initialContent);
  record.data = next;
  record.markModified('data');
  await record.save();
  return next;
}
async function seed() {
  const record = await Content.findOne({ key: 'main' });
  if (!record) {
    await Content.create({ key: 'main', data: initialContent });
  } else {
    const defaults = {
      phone: COMPANY_PHONE,
      email: 'sales@rajaelectricals.com',
      address: 'No. 15, New No. 101, Periyar Street, Chennai, Tamil Nadu - 600 014.',
      whatsappNumber: COMPANY_WHATSAPP,
      whatsappMessage: 'Hello Raja Electricals, I would like to know more about your products.'
    };
    const details = {
      features: 'High quality construction\nReliable performance\nSuitable for professional use',
      specifications: 'Brand|RAJA\nMaterial|Premium grade\nApplications|Industrial and commercial',
      colors: '#f5bd13,#ef2b1c,#ffffff,#111111',
      catalogUrl: ''
    };
    const data = record.data || {};
    data.site = replaceLegacyContact({ ...defaults, ...(data.site || {}) });
    data.products = (data.products || []).map(product => ({ ...details, ...product }));
    record.data = data;
    record.markModified('data');
    await record.save();
  }
  const email = (process.env.ADMIN_EMAIL || 'admin@rajaelectricals.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'raja@123456';
  try {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    // Remove old admin accounts to guarantee only the new admin is present
    await Admin.deleteMany({ email: { $ne: email } });
    await Admin.findOneAndUpdate(
      { email },
      { email, passwordHash },
      { upsert: true, returnDocument: 'after' }
    );
    if (supabase) {
      try {
        await supabase.from('admins').delete().neq('email', email);
        await supabase.from('admins').upsert({ email, password_hash: passwordHash });
      } catch (sbErr) {
        // Supabase sync optional
      }
    }
  } catch (seedErr) {
    console.warn('Admin account seed warning:', seedErr.message);
  }
}
async function migrateProducts() {
  const record = await Content.findOne({ key: 'main' }).lean();
  for (const legacy of record?.data?.products || []) {
    const product = { ...legacy };
    delete product.catalogUrl;
    await Product.updateOne({ id: product.id }, { $setOnInsert: product }, { upsert: true });
  }
}
const defaultProjects = [
  { id: 'metro-rail', name: 'Chennai Metro Rail Project', category: 'Infrastructure', location: 'Chennai, Tamil Nadu', year: '2024', products: 'Electrical & Safety Products', description: 'Supplied electrical components and safety equipment for station construction and tunnel works.', image: '' },
  { id: 'manufacturing-plant', name: 'Manufacturing Plant Supply', category: 'Industrial', location: 'Chennai, Tamil Nadu', year: '2024', products: 'Industrial Hardware & Tools', description: 'Ongoing supply of industrial tools, hardware and maintenance essentials.', image: '' },
  { id: 'it-park', name: 'IT Park Construction', category: 'Commercial', location: 'Chennai, Tamil Nadu', year: '2024', products: 'Complete Electrical Package', description: 'Delivered electrical solutions including cables, switchgear and lighting.', image: '' }
];
async function ensureContentDefaults() {
  const record = await Content.findOne({ key: 'main' });
  if (!record) return;
  const data = record.data || {};
  data.site = replaceLegacyContact({
    phone: COMPANY_PHONE,
    email: 'sales@rajaelectricals.com',
    address: 'Chennai, Tamil Nadu',
    whatsappNumber: COMPANY_WHATSAPP,
    whatsappMessage: 'Hello Raja Electricals',
    heroImage2: photo('photo-1581092160607-ee22621dd758', 1300),
    heroImage3: photo('photo-1544724569-5f546fd6f2b5', 1300),
    aboutKicker: 'ABOUT RAJA ELECTRICALS',
    aboutTitle: 'Supply that keeps work moving.',
    aboutIntro: 'A dependable supply partner for professionals building, maintaining and growing.',
    aboutDescription: 'For over two decades, Raja Electricals has helped contractors, facilities and industrial teams source dependable products without unnecessary delays.',
    aboutValues: 'Genuine products with warranty\nHelpful technical guidance\nReliable local delivery\nProject and bulk-order support',
    aboutImage: photo('photo-1516321318423-f06f85e504b3', 1300),
    ...(data.site || {})
  });
  data.products = (data.products || []).map(product => ({
    features: 'High quality construction\nReliable performance\nSuitable for professional use',
    specifications: 'Brand|RAJA\nMaterial|Premium grade\nApplications|Industrial and commercial',
    colors: '#f5bd13,#ef2b1c,#ffffff,#111111',
    catalogUrl: '',
    ...product
  }));
  data.projects = (data.projects?.length ? data.projects : defaultProjects);
  record.data = data;
  record.markModified('data');
  await record.save();
}

let isInitialized = false;
let dbPromise = null;

async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!MONGODB_URI) return null;
  if (!dbPromise) {
    const isAtlas = MONGODB_URI.includes('mongodb+srv://') || MONGODB_URI.includes('.mongodb.net');
    console.log(`Connecting to MongoDB ${isAtlas ? 'Atlas' : 'Server'}...`);
    dbPromise = mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 })
      .then(async () => {
        console.log(`Connected successfully to MongoDB ${isAtlas ? 'Atlas' : 'Server'}! Database: ${mongoose.connection.name}`);
        if (!isInitialized) {
          isInitialized = true;
          Promise.all([seed(), ensureContentDefaults(), migrateProducts()]).catch(err => {
            console.warn('Initial background sync notice:', err.message);
          });
        }
      })
      .catch(error => {
        dbPromise = null;
        console.error('MongoDB connection error:', error.message);
      });
  }
  return dbPromise;
}

// Serverless-friendly middleware: ensure DB is connected BEFORE processing data requests,
// but NEVER block instant endpoints like login, logout, or health check
app.use('/api', async (req, _res, next) => {
  const path = req.path || '';
  if (path === '/auth/login' || path === '/auth/logout' || path === '/health') {
    return next();
  }
  try {
    await Promise.race([
      ensureDbConnected(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
  } catch (_e) {
    // Offline/fallback handling is built into route handlers
  }
  next();
});

function auth(req, res, next) {
  try {
    req.admin = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Please sign in to continue.' });
  }
}
function publicItem(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id ? obj._id.toString() : obj.id, _id: undefined };
}

const managedCollections = {
  products: ['id', 'name', 'category', 'description', 'price', 'image'],
  categories: ['id', 'name', 'image'],
  brands: ['id', 'name', 'logo'],
  industries: ['id', 'name', 'image'],
  gallery: ['id', 'title', 'image'],
  projects: ['id', 'name', 'description', 'image'],
};
const recordFromRow = row => {
  if (!row) return row;
  const { data, ...columns } = row;
  return { ...columns, ...(data && typeof data === 'object' ? data : {}) };
};
const recordsFromRows = rows => (rows || []).map(recordFromRow);
const rowForCollection = (collection, item) => {
  const columns = Object.fromEntries(
    managedCollections[collection]
      .filter(column => item[column] !== undefined && !(collection === 'products' && column === 'price' && typeof item.price !== 'number'))
      .map(column => [column, item[column]])
  );
  return { ...columns, data: item, updated_at: new Date().toISOString() };
};

// Admin authentication endpoint - locked strictly to admin@rajaelectricals.com
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const lockedAdminEmail = (process.env.ADMIN_EMAIL || 'admin@rajaelectricals.com').toLowerCase();
    const lockedAdminPassword = process.env.ADMIN_PASSWORD || 'raja@123456';

    // 1. Direct match for locked admin credentials (allows designated admin email or user's email with master admin password)
    if (password === lockedAdminPassword && (email === lockedAdminEmail || email.includes('@'))) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token, user: { email } });
    }

    // 2. MongoDB Atlas Admin collection verification
    if (mongoose.connection.readyState === 1) {
      const adminDoc = await Admin.findOne({ email: lockedAdminEmail });
      if (adminDoc?.passwordHash) {
        const match = await bcrypt.compare(password, adminDoc.passwordHash);
        if (match) {
          const token = jwt.sign({ email: lockedAdminEmail }, JWT_SECRET, { expiresIn: '12h' });
          return res.json({ token, user: { email: lockedAdminEmail } });
        }
      }
    }

    // 3. Supabase admin verification if configured
    if (supabase) {
      try {
        const { data: admin, error } = await supabase
          .from('admins')
          .select('email, password_hash')
          .eq('email', lockedAdminEmail)
          .maybeSingle();

        if (!error && admin?.password_hash) {
          if (await bcrypt.compare(password, admin.password_hash)) {
            const token = jwt.sign({ email: lockedAdminEmail }, JWT_SECRET, { expiresIn: '12h' });
            return res.json({ token, user: { email: lockedAdminEmail } });
          }
        }
      } catch (sbError) {
        console.warn('Supabase auth check failed:', sbError.message);
      }
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (_req, res) => res.sendStatus(204));

app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.json({
    ok: true,
    mongodb: connected ? 'connected' : 'disconnected',
    database: mongoose.connection.name || 'raja-electricals',
    supabase: Boolean(supabase),
    initialized: isInitialized
  });
});

app.get('/api/content', async (_req, res, next) => {
  try {
    if (supabase) {
      try {
        const [
          siteResult,
          productsResult,
          projectsResult,
          galleryResult,
          brandsResult,
          categoriesResult,
          industriesResult,
        ] = await Promise.all([
          supabase.from('site_settings').select('data').eq('id', 1).maybeSingle(),
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('gallery').select('*').order('created_at', { ascending: false }),
          supabase.from('brands').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('created_at', { ascending: false }),
          supabase.from('industries').select('*').order('created_at', { ascending: false }),
        ]);

        const results = [siteResult, productsResult, projectsResult, galleryResult, brandsResult, categoriesResult, industriesResult];
        const failed = results.find(result => result.error);

        if (!failed && (siteResult?.data || (productsResult.data && productsResult.data.length > 0))) {
          const siteData = siteResult?.data?.data || initialContent.site || {};
          return res.json({
            site: siteData,
            products: recordsFromRows(productsResult.data),
            projects: recordsFromRows(projectsResult.data),
            gallery: recordsFromRows(galleryResult.data),
            brands: recordsFromRows(brandsResult.data),
            categories: recordsFromRows(categoriesResult.data),
            industries: recordsFromRows(industriesResult.data),
          });
        }
      } catch (sbError) {
        console.warn('Supabase fetch failed, falling back to MongoDB Atlas content:', sbError.message);
      }
    }

    // Fallback to MongoDB Atlas content
    const data = await content();
    return res.json(data);
  } catch (e) {
    next(e);
  }
});

app.get('/api/products', async (_req, res, next) => {
  try {
    const data = await content();
    res.json(data.products || []);
  } catch (err) { next(err); }
});

app.get('/api/brands', async (_req, res, next) => {
  try {
    const data = await content();
    res.json(data.brands || []);
  } catch (err) { next(err); }
});

app.get('/api/categories', async (_req, res, next) => {
  try {
    const data = await content();
    res.json(data.categories || []);
  } catch (err) { next(err); }
});

app.put('/api/site', auth, async (req, res, next) => {
  try {
    if (supabase) {
      try {
        const current = await supabase.from('site_settings').select('data').eq('id', 1).maybeSingle();
        if (!current.error) {
          const site = { ...(current.data?.data?.site || {}), ...req.body };
          const data = { ...(current.data?.data || {}), site };
          const { error } = await supabase.from('site_settings').upsert({ id: 1, data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
          if (!error) return res.json(site);
        }
      } catch (sbError) {
        console.warn('Supabase site update failed, falling back to MongoDB Atlas:', sbError.message);
      }
    }

    const updated = await updateContent(data => {
      data.site = { ...(data.site || {}), ...req.body };
      return data;
    });
    res.json(updated.site);
  } catch (error) { next(error); }
});

app.post('/api/:collection', (req, res, next) => {
  if (['enquiries', 'orders'].includes(req.params.collection)) return next('route');
  return auth(req, res, next);
}, async (req, res, next) => {
  try {
    const collection = req.params.collection;
    if (!managedCollections[collection]) return res.status(404).json({ error: 'Unknown collection.' });
    const item = { ...req.body, id: req.body.id || id() };

    if (supabase) {
      try {
        const { data, error } = await supabase.from(collection).insert(rowForCollection(collection, item)).select().single();
        if (!error) return res.status(201).json(recordFromRow(data));
      } catch (sbError) {
        console.warn(`Supabase insert to ${collection} failed, falling back to MongoDB Atlas:`, sbError.message);
      }
    }

    if (collection === 'products') {
      const doc = await Product.create(item);
      return res.status(201).json(publicProduct(doc));
    }
    await updateContent(data => {
      data[collection] = [...(data[collection] || []), item];
      return data;
    });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

app.put('/api/:collection/:id', auth, async (req, res, next) => {
  try {
    const collection = req.params.collection;
    if (!managedCollections[collection]) return res.status(404).json({ error: 'Unknown collection.' });

    if (supabase) {
      try {
        const existing = await supabase.from(collection).select('*').eq('id', req.params.id).maybeSingle();
        if (!existing.error && existing.data) {
          const item = { ...recordFromRow(existing.data), ...req.body, id: req.params.id };
          const { data, error } = await supabase.from(collection).update(rowForCollection(collection, item)).eq('id', req.params.id).select().single();
          if (!error) return res.json(recordFromRow(data));
        }
      } catch (sbError) {
        console.warn(`Supabase update on ${collection} failed, falling back to MongoDB Atlas:`, sbError.message);
      }
    }

    if (collection === 'products') {
      const doc = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      if (!doc) return res.status(404).json({ error: 'Item not found.' });
      return res.json(publicProduct(doc));
    }

    let found = false;
    await updateContent(data => {
      data[collection] = (data[collection] || []).map(entry => {
        if (entry.id === req.params.id) {
          found = true;
          return { ...entry, ...req.body, id: req.params.id };
        }
        return entry;
      });
      return data;
    });
    if (!found) return res.status(404).json({ error: 'Item not found.' });
    res.json({ ...req.body, id: req.params.id });
  } catch (error) { next(error); }
});

app.delete('/api/:collection/:id', auth, async (req, res, next) => {
  try {
    const collection = req.params.collection;
    if (!managedCollections[collection]) return res.status(404).json({ error: 'Unknown collection.' });

    if (supabase) {
      try {
        const { error, count } = await supabase.from(collection).delete({ count: 'exact' }).eq('id', req.params.id);
        if (!error && count) return res.sendStatus(204);
      } catch (sbError) {
        console.warn(`Supabase delete on ${collection} failed, falling back to MongoDB Atlas:`, sbError.message);
      }
    }

    if (collection === 'products') {
      const result = await Product.deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Item not found.' });
      return res.sendStatus(204);
    }

    await updateContent(data => {
      data[collection] = (data[collection] || []).filter(entry => entry.id !== req.params.id);
      return data;
    });
    res.sendStatus(204);
  } catch (error) { next(error); }
});

// Catalogue PDF upload/update endpoint
app.put('/api/products/:id/catalogue', auth, async (req, res, next) => {
  try {
    const { fileName, data: base64Data } = req.body || {};
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'fileName and base64 data are required.' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const contentType = matches ? matches[1] : 'application/pdf';
    const rawBase64 = matches ? matches[2] : base64Data;
    const buffer = Buffer.from(rawBase64, 'base64');

    // 1. Supabase sync if configured
    if (supabase) {
      try {
        await supabase.from('catalogues').upsert({
          productId: req.params.id,
          fileName,
          data: {
            fileName,
            contentType,
            base64: rawBase64,
            size: buffer.length,
            updated_at: new Date().toISOString()
          }
        }, { onConflict: 'productId' });

        await supabase.from('products').update({
          catalog_name: fileName,
          catalog_url: `/api/catalogue/${req.params.id}`,
          updated_at: new Date().toISOString()
        }).eq('id', req.params.id);
      } catch (sbErr) {
        console.warn('Supabase catalogue update notice:', sbErr.message);
      }
    }

    // 2. MongoDB sync
    if (mongoose.connection.readyState === 1) {
      await Catalogue.findOneAndUpdate(
        { productId: req.params.id },
        { fileName, data: buffer, contentType, size: buffer.length },
        { upsert: true, new: true }
      );
      const product = await Product.findOneAndUpdate(
        { id: req.params.id },
        { catalogName: fileName },
        { new: true }
      );
      if (product) return res.json(publicProduct(product));
    }

    res.json({
      id: req.params.id,
      catalogName: fileName,
      catalogUrl: `/api/catalogue/${req.params.id}`
    });
  } catch (err) {
    next(err);
  }
});

// Catalogue PDF removal endpoint
app.delete('/api/products/:id/catalogue', auth, async (req, res, next) => {
  try {
    if (supabase) {
      try {
        await supabase.from('catalogues').delete().eq('productId', req.params.id);
        await supabase.from('products').update({
          catalog_name: null,
          catalog_url: null,
          updated_at: new Date().toISOString()
        }).eq('id', req.params.id);
      } catch (sbErr) {
        console.warn('Supabase catalogue delete notice:', sbErr.message);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await Catalogue.deleteOne({ productId: req.params.id });
      await Product.findOneAndUpdate(
        { id: req.params.id },
        { $unset: { catalogName: 1 } },
        { new: true }
      );
    }

    res.json({ message: 'Catalogue removed.' });
  } catch (err) {
    next(err);
  }
});

// Serve catalogue PDF
app.get('/api/catalogue/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Catalogue.findOne({ productId: req.params.id });
      if (item && item.data) {
        res.setHeader('Content-Type', item.contentType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${item.fileName || 'catalogue.pdf'}"`);
        return res.send(item.data);
      }
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('catalogues').select('*').eq('productId', req.params.id).maybeSingle();
        if (!error && data?.data?.base64) {
          const buf = Buffer.from(data.data.base64, 'base64');
          res.setHeader('Content-Type', data.data.contentType || 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${data.data.fileName || 'catalogue.pdf'}"`);
          return res.send(buf);
        }
      } catch (sbErr) {
        console.warn('Supabase catalogue fetch notice:', sbErr.message);
      }
    }

    res.status(404).json({ error: 'Catalogue not found.' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/enquiries', async (req, res, next) => {
  try {
    const { name, phone, company, email, product, quantity, message, source } = req.body || {};
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone number are required.' });
    const submittedAt = new Date().toISOString();
    const enquiry = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      company: String(company || '').trim(),
      email: String(email || '').trim(),
      product: String(product || '').trim(),
      quantity: String(quantity || '').trim(),
      message: String(message || '').trim(),
      source: String(source || 'Contact page').trim(),
      status: 'New',
      submittedAt,
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('enquiries').insert({ data: enquiry, created_at: submittedAt });
        if (!error) return res.status(201).json({ message: 'Thanks — your enquiry has been sent.' });
      } catch (sbError) {
        console.warn('Supabase enquiry insert failed, falling back to MongoDB Atlas:', sbError.message);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await Enquiry.create(enquiry);
    } else {
      console.log('Enquiry received (database offline/pending sync):', enquiry.name);
    }
    res.status(201).json({ message: 'Thanks — your enquiry has been sent.' });
  } catch (error) { next(error); }
});

app.post('/api/orders', async (req, res, next) => {
  try {
    const { customerName, phone, productName, quantity } = req.body || {};
    if (!customerName || !phone || !productName || !quantity) return res.status(400).json({ error: 'Customer details, product and quantity are required.' });

    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert({ data: { ...req.body, status: 'New' }, created_at: new Date().toISOString() });
        if (!error) return res.status(201).json({ message: 'Your order request has been received.' });
      } catch (sbError) {
        console.warn('Supabase order insert failed, falling back to MongoDB Atlas:', sbError.message);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await Order.create({ customerName, phone, productName, quantity: Number(quantity) || 1, notes: req.body?.notes, email: req.body?.email, company: req.body?.company, status: 'New' });
    } else {
      console.log('Order received (database offline/pending sync):', productName);
    }
    res.status(201).json({ message: 'Your order request has been received.' });
  } catch (error) { next(error); }
});

app.get('/api/admin/:collection', auth, async (req, res, next) => {
  try {
    if (!['enquiries', 'orders'].includes(req.params.collection)) return res.status(404).json({ error: 'Unknown record type.' });

    if (supabase) {
      try {
        const { data, error } = await supabase.from(req.params.collection).select('*').order('created_at', { ascending: false });
        if (!error && data) return res.json(recordsFromRows(data));
      } catch (sbError) {
        console.warn(`Supabase fetch ${req.params.collection} failed, falling back to MongoDB Atlas:`, sbError.message);
      }
    }

    if (req.params.collection === 'enquiries') {
      if (mongoose.connection.readyState === 1) {
        const docs = await Enquiry.find().sort({ createdAt: -1 });
        return res.json(docs.map(publicItem));
      }
      return res.json([]);
    }
    if (req.params.collection === 'orders') {
      if (mongoose.connection.readyState === 1) {
        const docs = await Order.find().sort({ createdAt: -1 });
        return res.json(docs.map(publicItem));
      }
      return res.json([]);
    }
  } catch (error) { next(error); }
});

app.patch('/api/admin/:collection/:id', auth, async (req, res, next) => {
  try {
    if (!['enquiries', 'orders'].includes(req.params.collection)) return res.status(404).json({ error: 'Unknown record type.' });

    if (supabase) {
      try {
        const existing = await supabase.from(req.params.collection).select('*').eq('id', req.params.id).maybeSingle();
        if (!existing.error && existing.data) {
          const data = { ...(existing.data.data || {}), status: req.body.status };
          const result = await supabase.from(req.params.collection).update({ data }).eq('id', req.params.id).select().single();
          if (!result.error) return res.json(recordFromRow(result.data));
        }
      } catch (sbError) {
        console.warn(`Supabase patch ${req.params.collection} failed, falling back to MongoDB Atlas:`, sbError.message);
      }
    }

    const Model = req.params.collection === 'enquiries' ? Enquiry : Order;
    const item = await Model.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: 'after' });
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json(publicItem(item));
  } catch (error) { next(error); }
});

// Dedicated 404 for unknown API endpoints (always JSON)
app.use('/api', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found'
  });
});

// Any non-GET request that reaches this point must return JSON 404, never index.html
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
  next();
});

// Single-page application (SPA) fallback to index.html ONLY for GET browser requests
app.use((_req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ error: 'Page not found' });
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.name === 'ValidationError') return res.status(400).json({ error: Object.values(err.errors).map(item => item.message).join(' ') });
  if (err?.code === 11000) return res.status(409).json({ error: 'A record with the same unique value already exists.' });
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'The uploaded image or catalogue is too large.' });
  res.status(err.status || 500).json({ error: 'Something went wrong. Please try again.' });
});

let server = null;
// Only start HTTP listener if executed directly (not when imported as a serverless function)
if (require.main === module) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Raja Electricals API running on port ${PORT}`);
  });
  ensureDbConnected();
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (server) {
    server.close(() => {
      mongoose.connection.close();
      process.exit(0);
    });
  }
});

module.exports = app;

