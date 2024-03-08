import { ethers } from './ethers-5.1.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectBtn = document.getElementById("connect")
const fundBtn = document.getElementById("fund")
const inputField = document.getElementById('fundAmount')
const getBalance = document.getElementById('getBalance')
const widthdrawBtn = document.getElementById('widthdraw')


const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        connectBtn.innerHTML = "Connected!!!"
    } else {
        connectBtn.innerHTML = "install Metamask"
    }
}

const getBalanceFunction = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

const fund = async () => {
    console.log(`Funding with ${inputField.value} eth`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionRespones = await contract.fund({
                value: ethers.utils.parseEther(inputField.value)
            })
            await listenFortransaction(transactionRespones, provider)
            console.log('Done')
        } catch (err) {
            console.log(err)
        }
    } else {
        connectBtn.innerHTML = "install Metamask"
    }
}

const listenFortransaction = (transactionResponse, provider) => {
    console.log('mining ....', transactionResponse.hash)
    return new Promise((resolve) => {
        provider.once(transactionResponse.hash, async (transactionReceipt) => {
            console.log(`Transaction Receipt is ${transactionReceipt.confirmations}`)
            resolve()
        })
    })
}

const widthdraw = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionRespones = await contract.widthdraw()
            await listenFortransaction(transactionRespones, provider)
        } catch (err) {
            console.log(err)
        }
    }
}




connectBtn.addEventListener("click", connect)
fundBtn.addEventListener("click", fund)
getBalance.addEventListener("click", getBalanceFunction)
widthdrawBtn.addEventListener("click", widthdraw)



