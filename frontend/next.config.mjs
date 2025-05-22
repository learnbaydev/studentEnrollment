// next.config.mjs
export default {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_API_URL: 'https://app.learnbay.co', // Always use domain in prod
  },
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'https://app.learnbay.co/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://app.learnbay.co/api/:path*',
      },
    ];
  },
};
