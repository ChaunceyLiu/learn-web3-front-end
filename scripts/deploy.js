import pkg from 'hardhat';
const { ethers } = pkg;

// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer?.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();

  console.log("Token address:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
