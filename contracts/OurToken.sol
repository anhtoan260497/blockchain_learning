// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract OurToken is ERC20 {
    constructor(uint256 _initialSupply) ERC20("BabyMusk", "BabyMusk") {
        _mint(msg.sender, _initialSupply); 
    }
}
