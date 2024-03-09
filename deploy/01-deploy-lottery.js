const hre = require('hardhat');
const { developmentChains, networkConfig } = require('../helper-hardhat-config');
const { verify } = require('../hardhat.config');

module.exports = async () => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer, player } = await getNamedAccounts();
    const chainId = await hre.getChainId()
    let vrfCoordinatorV2Address;
    const entranceFee = networkConfig[chainId].entranceFee
    const keyHash = networkConfig[chainId].keyHash
    let subId = 0;
    const FUND_AMOUNT = hre.ethers.utils.parseEther("10")
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const intervalTime = networkConfig[chainId].intervalTime


    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await hre.ethers.getContractAt("VRFCoordinatorV2Mock", deployer, await hre.ethers.getSigner())
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        // console.log(transactionReceipt.events)

        subId = transactionReceipt.events?.[0]?.args?.subId  || 1
        await vrfCoordinatorV2Mock.fundSubscription(subId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subId = networkConfig[chainId].subId
    }

    const args = [subId, vrfCoordinatorV2Address, entranceFee, keyHash, callbackGasLimit,intervalTime]

    const lottery = await deploy("Lottery", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 3
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log('verifying.........')
        await verify(lottery.address, args)
        log('--------------------------------------------------')

    }

}

module.exports.tags = ['all','lottery']