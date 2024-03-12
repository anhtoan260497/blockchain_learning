const hre = require('hardhat')
const { verify } = require('../utils/verify')

module.exports = async () => {
    const { deployments, getNamedAccounts, getChainId } = hre
    const { log, deploy } = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = await getChainId()
    console.log(deployer)

    const ourToken = await deploy("OurToken", {
        from : deployer,
        args : [50e12],
        log : true,
        waitConfirmations : 6
    })

    if(chainId !== 3133 && process.env.ETHERSCAN_API_KEY) {
       await verify(ourToken.address,[50e12])
    }
}