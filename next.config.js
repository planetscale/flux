const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withSvgr = require('next-svgr');

module.exports = withPlugins([
  withSvgr,
  [
    withBundleAnalyzer,
    {
      publicRuntimeConfig: {
        readOnly: process.env.READ_ONLY === 'true',
      },
    },
  ],
]);
