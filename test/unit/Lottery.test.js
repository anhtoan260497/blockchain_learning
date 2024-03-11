const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", () => {
        let lottery, vrfCoordinatorV2Mock, lotteryEntranceFee, deployer, intervalTime
        const chainId = network.config.chainId

        beforeEach(async () => {
            await deployments.fixture(['all'])
            deployer = (await getNamedAccounts()).deployer
            lottery = await ethers.getContractAt('Lottery', (await deployments.get("Lottery")).address)
            vrfCoordinatorV2Mock = await hre.ethers.getContractAt("VRFCoordinatorV2Mock", deployments.get("VRFCoordinatorV2Mock")).address
            lotteryEntranceFee = await lottery.getEntranceFee()
            intervalTime = await lottery.getIntervalTime()
        })

        describe("constructor", () => {
            it('initial lottery', async () => {
                const lotteryState = await lottery.getLotteryState()
                const intervalTime = await lottery.getIntervalTime()
                assert.equal(lotteryState, "0")
                assert.equal(intervalTime, networkConfig[chainId].intervalTime)
            })
        })

        describe('enterLottery', () => {
            it('revert when dont pay enough', async () => {
                await expect(lottery.enterLottery()).to.be.revertedWith('Lottery__InsufficentAmount')
            })

            it('records player when they enter', async () => {
                await lottery.enterLottery({ value: lotteryEntranceFee })
                const lotteryPlayer = await lottery.getPlayer(0)
                assert.equal(lotteryPlayer, deployer)
            })

            it('emit event on enter', async () => {
                await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.emit(lottery, 'LotteryEnter')
            })

            // it('Doesnt allow enter to Lottery', async () => {
            //     await lottery.enterLottery({ value: lotteryEntranceFee })
            //     // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
            //     await network.provider.send("evm_increaseTime", [intervalTime.toNumber() + 1])
            //     await network.provider.request({ method: "evm_mine", params: [] })
            //     // we pretend to be a keeper for a second
            //     await lottery.performUpkeep([]) // changes the state to calculating for our comparison below
            //     // await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.be.revertedWith( // is reverted as raffle is calculating
            //     //     "Lottery__NotOpened"
            //     // )
            // })

            describe('checkUpkeep', () => {
                it('returns false if people didnt send ETH', async () => {
                    await network.provider.send('evm_increaseTime', [intervalTime.toNumber() + 1])
                    await network.provider.send('evm_mine')
                    const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                    assert(!upkeepNeeded)
                })

                // it('it turns false if lottery not open', async () => {
                //     await lottery.enterLottery({ value: lotteryEntranceFee })
                //     await network.provider.send('evm_increaseTime', [intervalTime.toNumber() + 1])
                //     await network.provider.send('evm_mine')
                //     await lottery.performUpkeep('0x')
                //     const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                //     const lotteryState = await lottery.getLotteryState()
                //     assert.equal(lotteryState, '1')
                //     assert(!upkeepNeeded)
                // })
            })


            describe('performUpKeep', () => {
                it('it can be run if checkUpkeep is true', async () => {
                    await lottery.enterLottery({value : lotteryEntranceFee})
                    await network.provider.send('evm_increaseTime', [intervalTime.toNumber() + 1])
                    console.log(intervalTime.toNumber() + 1)
                    await network.provider.send('evm_mine')
                    console.log(lottery.performUpkeep)
                    const tx = await lottery.performUpkeep([])
                    assert(tx)
                })
            })
        })
    })
