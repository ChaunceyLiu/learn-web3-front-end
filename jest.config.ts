// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Next.js 项目根目录
});

const customJestConfig = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
  ],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // 处理 CSS/图片等静态资源
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};

module.exports = createJestConfig(customJestConfig);
