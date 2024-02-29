const { ethers, run, network } = require("hardhat")
// require('dotenv').config

const main = async () => {
  try {
    console.log('deploy ... ')
    const simpleStorage = await ethers.deployContract("SimpleStorage")
    await simpleStorage.waitForDeployment()
    console.log('deploy done')
    const contractAddress = await simpleStorage.getAddress()
    console.log('contract address is', contractAddress)
  } catch (err) {
    console.log(err)
  }
}



main().then(() => {
  process.exit(0)
}).catch(() => {
  process.exit(1)
})