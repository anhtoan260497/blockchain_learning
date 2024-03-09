require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
// require('solidity-coverage')
// require('hardhat-gas-reporter')
// require('hardhat-contract-sizer')
require('dotenv').config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const ACCOUNT_1 = process.env.ACCOUNT_1_PRIVATE_KEY
const ACCOUNT_2 = process.env.ACCOUNT_2_PRIVATE_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork : 'hardhat',
  networks : {
    hardhat : {
      blockConfirmations : 1,
    },
    sepolia : {
      url : SEPOLIA_RPC_URL,
      accounts : [ACCOUNT_1, ACCOUNT_2],
      blockConfirmations : 6,
    }
  }, 
  namedAccounts : {
    deployer : {
      default : 0
    },
    player : {
      default : 1
    }
  }
};
