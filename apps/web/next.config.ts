import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development', // Disabled in dev to prevent Next.js path URL TypeError crash
  maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB to allow pglite.wasm
});

const nextConfig: NextConfig = {
  transpilePackages: ['@referee-pro/database', '@referee-pro/shared-types'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        module: false,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    // Force all three.js imports to resolve to a single instance
    // This eliminates the "Multiple instances of Three.js" warning from R3F/Drei
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve('three'),
    };
    return config;
  },
  experimental: {},
  turbopack: {},
  async rewrites() {
    // Proxy all /api/* frontend calls → Express backend at localhost:4000/api/v1/*
    // This means zero changes needed in any page/component fetch calls.
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/api/v1/:path*`,
      },
    ];
  },
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
