/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    // 2025年最新安全配置
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.coinall.ltd",
        pathname: "/cdn/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3001",
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" }
        ],
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/chain-data/:path*",
        destination: "http://localhost:3000/chain-data/:path*" // 修正API前缀保留
      },
    ];
  },
};

export default config;
