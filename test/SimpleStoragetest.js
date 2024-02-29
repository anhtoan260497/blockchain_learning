const { assert } = require("chai");
const { ethers } = require("hardhat");

describe('SimpleStorage', () => {
  let simpleStorage;

  beforeEach(async () => {
    simpleStorage = await ethers.deployContract('SimpleStorage')
    await simpleStorage.waitForDeployment()
  })

  it('Should start with value 0', async () => {
    console.log(simpleStorage)
    const value = await simpleStorage.retrieve()
    assert.equal(value, 0)
  })

  it('Should updated with value 7', async () => {
    const transactionRespone = await simpleStorage.store(7)
    await transactionRespone.wait(1)
    const value = await simpleStorage.retrieve()
   assert.equal(value, 7)
  })

})