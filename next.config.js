/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

