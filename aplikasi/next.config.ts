import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {'/*': ['./.data/**/*', './.env*', './.wrangler/**/*', './.sites-runtime/**/*']},
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'same-origin' },
      { key: 'Cache-Control', value: 'no-store' },
    ] }];
  },
};

export default nextConfig;
