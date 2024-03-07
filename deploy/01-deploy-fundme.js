const { network } = require("hardhat")
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const networkName = network.name

    let ethToUsdPriceFeed = ''
    if (developmentChains.includes(networkName)) {
        let ethUsdtAggregator = await get('MockV3Aggregator')
        ethToUsdPriceFeed = ethUsdtAggregator.address

    } else {
        ethToUsdPriceFeed = networkConfig[networkName]['ethToUsdPriceFeed']
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            ethToUsdPriceFeed
        ],
        log: true,
    })

    if(!developmentChains.includes(networkName) && process.env.ETHERSCAN_API_KEY){
        await verify(await fundMe.address, [ethToUsdPriceFeed])
    } 


    log('--------------------------------------')
}

module.exports.tags = ['all', 'fundme']