/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,

    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
    },
  },
  webpack(config, { isServer, dev }) {
   config.experiments = { asyncWebAssembly: true, syncWebAssembly: true, layers: true, topLevelAwait: true };

   
    config.optimization.moduleIds = 'named';

    config.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/async',
    });

    // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
    if (isServer) {
        config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm';
    } else {
        config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }
    return config;
  },
}

module.exports = nextConfig
