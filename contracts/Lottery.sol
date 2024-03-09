// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

error Lottery__InsufficentAmount();
error Lottery__TransferFailed();
error Lottery__NotOpened();
error Lottery__UpkeepNoNeeded(uint256 balance, uint256 players, uint256 lotteryState);

contract Lottery is VRFConsumerBaseV2, AutomationCompatible{

    modifier insufficentFund() {
        if(msg.value < i_entranceFee) revert Lottery__InsufficentAmount();
        _;
    }       

    modifier lotteryState() {
        if(s_lotteryState != LotteryState.OPEN){
            _;
            revert Lottery__NotOpened();
            _;
        }
    }

    enum LotteryState {
        OPEN, CALCULATING
    }

    address payable[] private s_player;
    LotteryState private s_lotteryState;
    uint256 private s_lastTimestamp;

    uint256 private immutable i_entranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoondinator;
    uint64 private immutable s_subcriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    uint256 private immutable i_intervalTime;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;


    address private s_recentWinner;

    event LotteryEnter(address indexed player);
    event LotteryPickWinner(uint256 indexed requestId);
    event WinnerHistory(address indexed winner);

    constructor(uint64 subcriptionId, address vrfCoordinatorV2,uint256 entranceFee, 
    bytes32 keyHash, uint32 callbackGasLimit, uint256 intervalTime) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoondinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        s_subcriptionId = subcriptionId;
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimestamp = block.timestamp;
        i_intervalTime = intervalTime;
    } 

    function enterLottery() public payable insufficentFund lotteryState(){
        s_player.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

/** 
 * @dev Chainlink Keeper
 */

    function checkUpkeep(bytes memory /*checkData*/) public view override returns(bool upkeepNeeded, bytes memory /*performData*/){
            bool isOpen = (LotteryState.OPEN == s_lotteryState);
            bool isPassed  = block.timestamp - s_lastTimestamp  > i_intervalTime;
            bool hasPlayers = s_player.length >= 1;
            bool hasBalance = address(this).balance > 0;
            upkeepNeeded = isOpen && isPassed && hasPlayers && hasBalance;
            return (upkeepNeeded, '');
    }


    function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded,) = checkUpkeep('');
        if(!upkeepNeeded) revert Lottery__UpkeepNoNeeded(address(this).balance, s_player.length, uint256(s_lotteryState));
        s_lotteryState = LotteryState.CALCULATING;
        uint256 requestId = i_vrfCoondinator.requestRandomWords(
            i_keyHash,
            s_subcriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS);
            emit LotteryPickWinner(requestId);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_player.length; // modulo 
        address payable recentWinner = s_player[indexOfWinner];
        s_recentWinner = recentWinner;
        s_lotteryState = LotteryState.OPEN;
        s_player = new address payable[](0);
        s_lastTimestamp = block.timestamp;
        (bool success,) = recentWinner.call{value : address(this).balance}("");
        if(!success) revert Lottery__TransferFailed();
        emit WinnerHistory(recentWinner);
    }

    function getEntranceFee () public view returns(uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_player[index];
    }

    function getRecentWinner() public view returns(address) {
        return s_recentWinner;
    }

    function getNumWords() public pure returns(uint256){
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns(uint256) {
        return s_player.length;
    }

    function getLastestTimestamp() public view returns(uint256) {
        return s_lastTimestamp;
    }

    function getRequestConfirmations() public pure returns(uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getIntervalTime() public view returns(uint256) {
        return i_intervalTime;
    }

    function getLotteryState() public view returns(LotteryState) {
        return s_lotteryState;
    }
}
