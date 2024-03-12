/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()




const ACCOUNT_1 = process.env.ACCOUNT1_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
console.log(ETHERSCAN_API_KEY)

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
      },
      {
        version: "0.8.20",
        settings: {},
      },
    ]
  },
  networks: {
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: 'https://sepolia.infura.io/v3/86c5de2992214764b10bff6517dad3e4',
      accounts: [ACCOUNT_1],
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,

    },

  },
};
