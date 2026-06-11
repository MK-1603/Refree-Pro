import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  reloadOnOnline: true,
  disable: false, // Enabled even in dev so you can test full offline on localhost
  maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB to allow pglite.wasm
});

const nextConfig: NextConfig = {
  experimental: {},
  turbopack: {},
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
      },
    ];
  },
};

export default withSerwist(nextConfig);
