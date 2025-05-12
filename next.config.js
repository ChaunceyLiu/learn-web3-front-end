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
  }
};

export default config;
