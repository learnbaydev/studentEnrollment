export default {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://app.learnbay.co/api/:path*', 
      },
    ];
  },
};
