import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";
import path from "path";
import { fileURLToPath } from "url";

const enableWasm = process.env.ENABLE_WASM !== undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,

    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
    },
  },
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!isServer && enableWasm)
      config.plugins.push(
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, "../../packages/rust-404"),
          watchDirectories: [
            path.resolve(__dirname, "../../packages/rust-404/src"),
          ],
        })
      );

    config.optimization.moduleIds = "named";

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
    if (isServer) {
      config.output.webassemblyModuleFilename =
        "./../static/wasm/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }
    return config;
  },
};

export default nextConfig;
