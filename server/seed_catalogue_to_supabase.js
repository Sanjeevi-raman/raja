const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = require('./supabase');

const productPagePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'ProductsPage.jsx');
const productPageSource = fs.readFileSync(productPagePath, 'utf8');
const fallbackImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

function sectionAfter(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Could not find ${marker}`);
  const open = source.indexOf('[', start);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '[') depth += 1;
    if (source[index] === ']') depth -= 1;
    if (depth === 0) return source.slice(open, index + 1);
  }

  throw new Error(`Could not read ${marker}`);
}

function makeSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function imageDataUrl(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return fallbackImage;
  const extension = path.extname(filePath).slice(1).toLowerCase();
  const mime = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function extractAssetPaths() {
  return Object.fromEntries([...productPageSource.matchAll(/import\s+(\w+)\s+from\s+'([^']+)';/g)]
    .map(([, variable, relativePath]) => [variable, path.resolve(path.dirname(productPagePath), relativePath)]));
}

function extractProductImages(assetPaths) {
  const start = productPageSource.indexOf('const PRODUCT_IMAGES = {');
  const end = productPageSource.indexOf('\n};', start);
  const source = productPageSource.slice(start, end);
  const images = {};

  for (const [, name, variable] of source.matchAll(/'([^']+)':\s*(\w+)/g)) {
    images[name] = imageDataUrl(assetPaths[variable]);
  }

  return images;
}

function buildCatalogue() {
  const categories = Function(`return ${sectionAfter(productPageSource, 'const CATEGORY_DATA =')};`)();
  const productImages = extractProductImages(extractAssetPaths());
  const products = [];

  categories.forEach(([category, entries], categoryIndex) => {
    entries.forEach((entry, entryIndex) => {
      const isSeries = Array.isArray(entry);
      const subcategory = isSeries ? entry[0] : '';
      const names = isSeries ? entry[1] : [entry];

      names.forEach((name, productIndex) => {
        products.push({
          id: `catalogue-${categoryIndex}-${entryIndex}-${productIndex}`,
          name,
          category,
          subcategory,
          image: productImages[name] || fallbackImage,
          price: 'Price on request',
          badge: 'Available',
          description: `${name} from our ${subcategory ? `${subcategory} - ` : ''}${category} range. Contact us for specifications and a quotation.`,
          features: 'High quality construction\nReliable performance\nSuitable for professional use',
          specifications: 'Brand|RAJA\nMaterial|Premium grade\nApplications|Industrial and commercial',
          colors: '#f5bd13,#ef2b1c,#ffffff,#111111',
        });
      });
    });
  });

  return { categories: categories.map(([name]) => ({ id: makeSlug(name), name })), products };
}

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function seed() {
  const { categories, products } = buildCatalogue();
  const now = new Date().toISOString();

  await upsert('categories', categories.map(category => ({
    ...category,
    image: products.find(product => product.category === category.name)?.image || fallbackImage,
    data: { ...category, count: `${products.filter(product => product.category === category.name).length} Products` },
    updated_at: now,
  })));

  // Chunking keeps the request below Supabase's payload limit despite image data URLs.
  for (let index = 0; index < products.length; index += 10) {
    const chunk = products.slice(index, index + 10).map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      data: product,
      updated_at: now,
    }));
    await upsert('products', chunk);
    console.log(`Seeded ${Math.min(index + chunk.length, products.length)}/${products.length} products`);
  }

  console.log(`Done: ${products.length} products and ${categories.length} categories are now in Supabase.`);
}

seed().catch(error => { console.error(error.message); process.exitCode = 1; });
