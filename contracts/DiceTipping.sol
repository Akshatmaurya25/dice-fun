// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DiceTipping
 * @dev Smart contract for tipping and donations on Dice.fun platform
 * Deployed on Kadena EVM Chain for secure and efficient transactions
 */
contract DiceTipping is ReentrancyGuard, Ownable, Pausable {

    // Events
    event TipSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message,
        uint256 timestamp,
        bytes32 indexed tipId
    );

    event StreamTip(
        address indexed from,
        address indexed streamer,
        string indexed streamId,
        uint256 amount,
        string message,
        uint256 timestamp,
        bytes32 indexed tipId
    );

    event Donation(
        address indexed from,
        address indexed to,
        uint256 amount,
        string purpose,
        string message,
        uint256 timestamp,
        bytes32 indexed donationId
    );

    event PlatformFeeUpdated(uint256 newFee);
    event FeesWithdrawn(address indexed to, uint256 amount);

    // Structs
    struct Tip {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
        bool isStreamTip;
        string streamId;
    }

    struct Donation {
        address from;
        address to;
        uint256 amount;
        string purpose;
        string message;
        uint256 timestamp;
    }

    struct UserStats {
        uint256 totalTipsSent;
        uint256 totalTipsReceived;
        uint256 totalDonationsSent;
        uint256 totalDonationsReceived;
        uint256 tipCount;
        uint256 donationCount;
    }

    // State variables
    mapping(bytes32 => Tip) public tips;
    mapping(bytes32 => Donation) public donations;
    mapping(address => UserStats) public userStats;
    mapping(string => bytes32[]) public streamTips; // streamId => tipIds

    bytes32[] public allTipIds;
    bytes32[] public allDonationIds;

    uint256 public platformFeePercentage = 250; // 2.5% (250 basis points)
    uint256 public constant MAX_FEE_PERCENTAGE = 1000; // 10% max
    uint256 public totalFeesCollected;

    uint256 public minimumTipAmount = 0.001 ether;
    uint256 public minimumDonationAmount = 0.001 ether;

    // Modifiers
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != msg.sender, "Cannot tip yourself");
        _;
    }

    modifier validAmount(uint256 _amount, uint256 _minimum) {
        require(_amount >= _minimum, "Amount below minimum");
        _;
    }

    constructor() {}

    /**
     * @dev Send a tip to another user
     * @param _to Recipient address
     * @param _message Tip message
     */
    function sendTip(
        address _to,
        string calldata _message
    )
        external
        payable
        nonReentrant
        whenNotPaused
        validAddress(_to)
        validAmount(msg.value, minimumTipAmount)
    {
        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        uint256 netAmount = msg.value - fee;

        bytes32 tipId = keccak256(abi.encodePacked(
            msg.sender,
            _to,
            msg.value,
            block.timestamp,
            allTipIds.length
        ));

        tips[tipId] = Tip({
            from: msg.sender,
            to: _to,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp,
            isStreamTip: false,
            streamId: ""
        });

        allTipIds.push(tipId);

        // Update user statistics
        userStats[msg.sender].totalTipsSent += msg.value;
        userStats[msg.sender].tipCount++;
        userStats[_to].totalTipsReceived += msg.value;

        totalFeesCollected += fee;

        // Transfer the net amount to recipient
        (bool success, ) = payable(_to).call{value: netAmount}("");
        require(success, "Transfer failed");

        emit TipSent(msg.sender, _to, msg.value, _message, block.timestamp, tipId);
    }

    /**
     * @dev Send a tip to a specific stream
     * @param _streamer Streamer's address
     * @param _streamId Stream identifier
     * @param _message Tip message
     */
    function sendStreamTip(
        address _streamer,
        string calldata _streamId,
        string calldata _message
    )
        external
        payable
        nonReentrant
        whenNotPaused
        validAddress(_streamer)
        validAmount(msg.value, minimumTipAmount)
    {
        require(bytes(_streamId).length > 0, "Invalid stream ID");

        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        uint256 netAmount = msg.value - fee;

        bytes32 tipId = keccak256(abi.encodePacked(
            msg.sender,
            _streamer,
            _streamId,
            msg.value,
            block.timestamp,
            allTipIds.length
        ));

        tips[tipId] = Tip({
            from: msg.sender,
            to: _streamer,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp,
            isStreamTip: true,
            streamId: _streamId
        });

        allTipIds.push(tipId);
        streamTips[_streamId].push(tipId);

        // Update user statistics
        userStats[msg.sender].totalTipsSent += msg.value;
        userStats[msg.sender].tipCount++;
        userStats[_streamer].totalTipsReceived += msg.value;

        totalFeesCollected += fee;

        // Transfer the net amount to streamer
        (bool success, ) = payable(_streamer).call{value: netAmount}("");
        require(success, "Transfer failed");

        emit StreamTip(msg.sender, _streamer, _streamId, msg.value, _message, block.timestamp, tipId);
    }

    /**
     * @dev Make a donation with a specific purpose
     * @param _to Recipient address
     * @param _purpose Donation purpose
     * @param _message Donation message
     */
    function makeDonation(
        address _to,
        string calldata _purpose,
        string calldata _message
    )
        external
        payable
        nonReentrant
        whenNotPaused
        validAddress(_to)
        validAmount(msg.value, minimumDonationAmount)
    {
        require(bytes(_purpose).length > 0, "Purpose required");

        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        uint256 netAmount = msg.value - fee;

        bytes32 donationId = keccak256(abi.encodePacked(
            msg.sender,
            _to,
            _purpose,
            msg.value,
            block.timestamp,
            allDonationIds.length
        ));

        donations[donationId] = Donation({
            from: msg.sender,
            to: _to,
            amount: msg.value,
            purpose: _purpose,
            message: _message,
            timestamp: block.timestamp
        });

        allDonationIds.push(donationId);

        // Update user statistics
        userStats[msg.sender].totalDonationsSent += msg.value;
        userStats[msg.sender].donationCount++;
        userStats[_to].totalDonationsReceived += msg.value;

        totalFeesCollected += fee;

        // Transfer the net amount to recipient
        (bool success, ) = payable(_to).call{value: netAmount}("");
        require(success, "Transfer failed");

        emit Donation(msg.sender, _to, msg.value, _purpose, _message, block.timestamp, donationId);
    }

    // View functions
    function getUserStats(address _user) external view returns (UserStats memory) {
        return userStats[_user];
    }

    function getStreamTips(string calldata _streamId) external view returns (bytes32[] memory) {
        return streamTips[_streamId];
    }

    function getStreamTipCount(string calldata _streamId) external view returns (uint256) {
        return streamTips[_streamId].length;
    }

    function getTotalTips() external view returns (uint256) {
        return allTipIds.length;
    }

    function getTotalDonations() external view returns (uint256) {
        return allDonationIds.length;
    }

    function getRecentTips(uint256 _limit) external view returns (bytes32[] memory) {
        uint256 length = allTipIds.length;
        uint256 limit = _limit > length ? length : _limit;
        bytes32[] memory recentTips = new bytes32[](limit);

        for (uint256 i = 0; i < limit; i++) {
            recentTips[i] = allTipIds[length - 1 - i];
        }

        return recentTips;
    }

    function getRecentDonations(uint256 _limit) external view returns (bytes32[] memory) {
        uint256 length = allDonationIds.length;
        uint256 limit = _limit > length ? length : _limit;
        bytes32[] memory recentDonations = new bytes32[](limit);

        for (uint256 i = 0; i < limit; i++) {
            recentDonations[i] = allDonationIds[length - 1 - i];
        }

        return recentDonations;
    }

    // Admin functions
    function setPlatformFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= MAX_FEE_PERCENTAGE, "Fee too high");
        platformFeePercentage = _feePercentage;
        emit PlatformFeeUpdated(_feePercentage);
    }

    function setMinimumAmounts(uint256 _tipAmount, uint256 _donationAmount) external onlyOwner {
        minimumTipAmount = _tipAmount;
        minimumDonationAmount = _donationAmount;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = totalFeesCollected;
        require(amount > 0, "No fees to withdraw");

        totalFeesCollected = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FeesWithdrawn(owner(), amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    // Receive function to accept direct transfers
    receive() external payable {
        // Direct transfers are treated as platform donations
        totalFeesCollected += msg.value;
    }
}