const app = require('../server/server.js');

module.exports = (req, res) => {
  const original = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-original-url'];
  if (original && original.startsWith('/api') && !original.includes('index.js')) {
    req.url = original;
  }
  return app(req, res);
};

