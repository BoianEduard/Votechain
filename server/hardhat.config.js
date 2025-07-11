module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
    development: {
      url: process.env.BLOCKCHAIN_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY
    }
  }
};