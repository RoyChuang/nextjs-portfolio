import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: 'https://fellow-letter.pockethost.io',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fellow-letter.pockethost.io/api/:path*',
      },
    ];
  },
};

export default nextConfig;
