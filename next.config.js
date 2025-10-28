/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.stamp.fyi",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ipfs.dweb.link",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "jbm.infura-ipfs.io",
      },
      {
        protocol: "https",
        hostname: "*.infura-ipfs.io",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare-ipfs.com",
      },
    ],
    // Disable image optimization to avoid Vercel issues with IPFS
    unoptimized: true,
  },
};

module.exports = nextConfig;
