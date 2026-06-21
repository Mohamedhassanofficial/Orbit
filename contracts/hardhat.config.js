require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, BSCSCAN_API_KEY } = process.env;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    // BNB Smart Chain mainnet (chainId 56)
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts,
    },
    // BNB Smart Chain testnet (chainId 97)
    bscTestnet: {
      url:
        process.env.BSC_TESTNET_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts,
    },
  },
  etherscan: {
    // BscScan verification
    apiKey: { bsc: BSCSCAN_API_KEY || "", bscTestnet: BSCSCAN_API_KEY || "" },
  },
};
