const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", async () => {
        let lottery, vrfCoordinatorV2Mock

        beforeEach(async () => {
            const { deployer } = await getNamedAccounts()
            await deployments.fixture(['all'])
            const lotteryFactory = new ethers.Contract("Lottery","")
            const lottery = await lotteryFactory.deploy()
            console.log(lottery)
            vrfCoordinatorV2Mock = await hre.ethers.getContractAt("VRFCoordinatorV2Mock", deployer, await hre.ethers.getSigner())
        })

        describe("constructor", async () => {
            it('initial lottery', async () => {
                // console.log(await lottery)
                // const lotteryState = await lottery.getLotteryState()
                // const intervalTime = await lottery.getIntervalTime()
                // assert.equal(lotteryState.toString(), "0")
            })
        })
    })