require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const ACCOUNT_1 = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY =  process.env.ETHERSCAN_API_KEY

module.exports = {
  solidity: "0.8.24",
  networks : {
    sepolia : {
      url : SEPOLIA_RPC_URL,
      accounts : [ACCOUNT_1]
    }
  },
  etherscan : {
    apiKey : ETHERSCAN_API_KEY
  }
};
