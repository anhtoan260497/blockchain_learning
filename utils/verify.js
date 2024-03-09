const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    try {
        await run("verify:verify", {
            address : contractAddress,
            constructorArguments : args
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports =  {verify}