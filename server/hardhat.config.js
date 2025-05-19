require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/0ifhhxzg_dK5qwkez0TRRRq8XAM28H06",
      accounts: ["5759b05efcb6fa5c8b28601d432808a50f3ce321ab2495746a42598e691a45c3"],  // Your private key
    }
  }
};