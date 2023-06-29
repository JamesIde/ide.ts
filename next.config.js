const { withContentlayer } = require("next-contentlayer"); // eslint-disable-line

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
  },
};

module.exports = withContentlayer(nextConfig);
