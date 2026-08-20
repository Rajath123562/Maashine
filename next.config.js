const fs = require('fs');
const path = require('path');
const obsoleteAdminPath = path.join(__dirname, 'app', 'admin');
if (fs.existsSync(obsoleteAdminPath)) {
  fs.rmSync(obsoleteAdminPath, { recursive: true, force: true });
}
const staleDevPath = path.join(__dirname, '.next', 'dev');
if (fs.existsSync(staleDevPath)) {
  fs.rmSync(staleDevPath, { recursive: true, force: true });
}

/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /admin/, /api\/admin/],
  publicExcludes: ['!noprecache/**/*'],
  runtimeCaching: [
    {
      urlPattern: /^\/admin\//,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^\/staff\//,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^\/api\/admin\//,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^\/my-requests\//,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^\/invoice\//,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
});
