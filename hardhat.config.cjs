require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      url: process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    sepolia: {
      url: process.env.POLYGON_RPC_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.VITE_ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : (process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : []),
    },
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.VITE_ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./solidity/contracts",
    tests: "./solidity/test",
    cache: "./solidity/cache",
    artifacts: "./solidity/artifacts",
  },
};

module.exports = config;