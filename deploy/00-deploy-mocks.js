const hre = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const BASE_FEE = hre.ethers.utils.parseEther('0.25') // looking in mocks constructor
const GAS_PRICE_LINK = 1e9

module.exports = async () => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer, player } = await getNamedAccounts();
    const networkName =  network.name
    const args = [BASE_FEE,GAS_PRICE_LINK]

    if(developmentChains.includes(network.name)){
        log('local developement, deploying mocks.....')
        await deploy('VRFCoordinatorV2Mock',{
            from : deployer,
            log : true,
            args
        })

        log('mocks deployed...!!!!')
        log('-----------------------------------------------')
    }
}

module.exports.tags == ['all','mocks']