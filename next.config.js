const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
});
module.exports = withPWA(
  withBundleAnalyzer({
    pwa: {
      disable: process.env.NODE_ENV === 'development',
      dest: 'public',
      sw: 'service-worker.js',
    },
  })
);
