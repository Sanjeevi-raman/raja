const app = require('../server/server.js');

module.exports = (req, res) => {
  // Normalize URL for Vercel Serverless Function invocation
  try {
    const rawUrl = req.url || '';
    const queryParam0 = rawUrl.match(/[?&]0=([^&]+)/);
    const captured = queryParam0 ? decodeURIComponent(queryParam0[1]) : (req.query && req.query['0']);
    const forwardedUri = req.headers['x-forwarded-uri'] || req.headers['x-original-url'];

    if (forwardedUri && forwardedUri.startsWith('/api')) {
      req.url = forwardedUri;
    } else if (captured) {
      const clean = captured.startsWith('/') ? captured : `/${captured}`;
      req.url = clean.startsWith('/api') ? clean : `/api${clean}`;
    } else if (req.url.startsWith('/api/index.js')) {
      req.url = req.url.replace('/api/index.js', '/api') || '/api';
    } else if (req.url.startsWith('/index.js')) {
      req.url = req.url.replace('/index.js', '/api') || '/api';
    } else if (!req.url.startsWith('/api')) {
      const cleanUrl = req.url.split('?')[0];
      req.url = `/api${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    }
  } catch (err) {
    console.error('URL normalization error in api/index.js:', err);
  }

  return app(req, res);
};

