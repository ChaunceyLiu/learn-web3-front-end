// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 调试输出
console.log("Alchemy Key:", process.env.PRIVATE_KEY);
console.log("Private Key:", process.env.SEPOLIA_URL);

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
