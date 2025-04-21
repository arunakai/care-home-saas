/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    config.module.noParse = /\.py$/;
    return config;
  },
}

module.exports = nextConfig;
