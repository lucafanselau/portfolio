/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config, { isServer, dev }) {
   config.experiments = { asyncWebAssembly: true, syncWebAssembly: true, layers: true, topLevelAwait: true };

    return config;
  },
}

module.exports = nextConfig
