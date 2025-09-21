
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.ctfassets.net",
      "downloads.ctfassets.net",
      "lh3.googleusercontent.com",
      "static.productionready.io",
    ],
    minimumCacheTTL: 2678400, // 31 days
  },
};

module.exports = nextConfig