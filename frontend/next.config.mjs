// next.config.mjs
export default {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "student-enrollment-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      // Add additional domains if needed:
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
      },
    ],
    // Optional performance optimizations:
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    // uncomment if you want to disable optimization:
    // unoptimized: true
  },

  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
        }/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
        }/api/:path*`,
      },
    ];
  },

  // Optional: Add logging for debugging
  async headers() {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },

  // Enable if you need to debug the image optimization
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
