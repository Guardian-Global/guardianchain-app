require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    // Ethereum networks
    ethereum: {
      url: "https://boldest-long-flower.quiknode.pro/f95e9c78a34f9c076e8ff012c98e17332758f862",
      accounts: [
        "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde",
      ],
      chainId: 1,
      gasPrice: 15000000000, // 15 gwei
      timeout: 120000,
    },
    mainnet: {
      url: "https://matic-mainnet.chainstacklabs.com",
      accounts: process.env.PRIVATE_KEY_USER
        ? [process.env.PRIVATE_KEY_USER]
        : [],
      chainId: 137,
      gasPrice: 30000000000, // 30 gwei
      timeout: 120000,
    },
    sepolia: {
      url:
        process.env.ETHEREUM_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_INFURA_ID",
      accounts: process.env.PRIVATE_KEY_DEPLOYER
        ? [process.env.PRIVATE_KEY_DEPLOYER]
        : [],
      chainId: 11155111,
      gasPrice: 20000000000,
    },
    goerli: {
      url:
        process.env.ETHEREUM_RPC_URL ||
        "https://goerli.infura.io/v3/YOUR_INFURA_ID",
      accounts: process.env.PRIVATE_KEY_DEPLOYER
        ? [process.env.PRIVATE_KEY_DEPLOYER]
        : [],
      chainId: 5,
      gasPrice: 20000000000,
    },
    // Polygon networks
    polygon: {
      url: "https://chaotic-cosmopolitan-tab.matic.quiknode.pro/a62225077279679a5957c8304e1c7042baec8c11",
      accounts: [
        "0xde6354f59a5448fc6df8abc332707767bd3f1f35b74f1accc053d5276e749bde",
      ],
      chainId: 137,
      gasPrice: 25000000000, // 25 gwei
      timeout: 120000,
      confirmations: 1,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/demo",
      accounts: process.env.PRIVATE_KEY_USER
        ? [process.env.PRIVATE_KEY_USER]
        : [],
      chainId: 80001,
      gasPrice: 20000000000, // 20 gwei (reduced for lower cost)
    },
    // BSC networks
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
      accounts: process.env.PRIVATE_KEY_DEPLOYER
        ? [process.env.PRIVATE_KEY_DEPLOYER]
        : [],
      chainId: 56,
      gasPrice: 5000000000, // 5 gwei
    },
    bscTestnet: {
      url:
        process.env.BSC_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: process.env.PRIVATE_KEY_DEPLOYER
        ? [process.env.PRIVATE_KEY_DEPLOYER]
        : [],
      chainId: 97,
      gasPrice: 10000000000, // 10 gwei
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
