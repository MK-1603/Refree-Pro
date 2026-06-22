'use client';
// FetchInterceptor — DISABLED
// All /api/* traffic is now proxied to the Express API backend (localhost:4000)
// via Next.js rewrites in next.config.ts. The local PGLite mock is no longer needed.

export function FetchInterceptor() {
  return null;
}
