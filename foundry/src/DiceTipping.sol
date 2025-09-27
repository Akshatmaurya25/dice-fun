// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/security/Pausable.sol";

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
        bytes32 tipId
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

    struct DonationRecord {
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
    mapping(bytes32 => DonationRecord) public donations;
    mapping(address => UserStats) public userStats;
    mapping(string => bytes32[]) public streamTips; // streamId => tipIds

    bytes32[] public allTipIds;
    bytes32[] public allDonationIds;

    uint256 public platformFeePercentage = 250; // 2.5% (250 basis points)
    uint256 public constant MAX_FEE_PERCENTAGE = 1000; // 10% max
    uint256 public totalFeesCollected;

    uint256 public minimumTipAmount = 0.001 ether;
    uint256 public minimumDonationAmount = 0.001 ether;

    // Add maximum limits to prevent DOS attacks
    uint256 public constant MAX_MESSAGE_LENGTH = 500;
    uint256 public constant MAX_PURPOSE_LENGTH = 200;
    uint256 public constant MAX_STREAM_ID_LENGTH = 100;

    // Add nonce to prevent replay attacks and improve uniqueness
    uint256 private nonce;

    // Modifiers
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != msg.sender, "Cannot tip yourself");
        _;
    }

    modifier validAmount(uint256 _amount, uint256 _minimum) {
        require(_amount >= _minimum, "Amount below minimum");
        require(_amount <= type(uint256).max / 10000, "Amount too large"); // Prevent overflow in fee calculation
        _;
    }

    modifier validString(string calldata _str, uint256 _maxLength) {
        require(bytes(_str).length <= _maxLength, "String too long");
        _;
    }

    constructor() Ownable() {
    _transferOwnership(msg.sender);
}

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
        validString(_message, MAX_MESSAGE_LENGTH)
    {
        bytes32 tipId = _processTip(_to, _message);
        _finalizeTip(_to, tipId);
    }

    /**
     * @dev Internal function to process tip creation
     */
    function _processTip(
        address _to,
        string calldata _message
    ) internal returns (bytes32) {
        bytes32 tipId = keccak256(abi.encodePacked(
            msg.sender,
            _to,
            msg.value,
            block.timestamp,
            block.number,
            nonce++
        ));

        require(tips[tipId].from == address(0), "Tip ID collision");

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
        return tipId;
    }

    /**
     * @dev Internal function to finalize tip
     */
    function _finalizeTip(address _to, bytes32 tipId) internal {
        _updateTipStats(msg.sender, _to, msg.value);

        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        totalFeesCollected += fee;

        (bool success, ) = payable(_to).call{value: msg.value - fee}("");
        require(success, "Transfer failed");

        Tip storage tip = tips[tipId];
        emit TipSent(msg.sender, _to, msg.value, tip.message, block.timestamp, tipId);
    }

    /**
     * @dev Internal function to update tip statistics
     * @param _sender Sender address
     * @param _recipient Recipient address
     * @param _amount Tip amount
     */
    function _updateTipStats(address _sender, address _recipient, uint256 _amount) internal {
        userStats[_sender].totalTipsSent += _amount;
        userStats[_sender].tipCount += 1;
        userStats[_recipient].totalTipsReceived += _amount;
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
        validString(_streamId, MAX_STREAM_ID_LENGTH)
        validString(_message, MAX_MESSAGE_LENGTH)
    {
        require(bytes(_streamId).length > 0, "Invalid stream ID");

        bytes32 tipId = _processStreamTip(_streamer, _streamId, _message);
        _finalizeStreamTip(_streamer, tipId);
    }

    /**
     * @dev Internal function to process stream tip creation
     */
    function _processStreamTip(
        address _streamer,
        string calldata _streamId,
        string calldata _message
    ) internal returns (bytes32) {
        bytes32 tipId = keccak256(abi.encodePacked(
            msg.sender,
            _streamer,
            _streamId,
            msg.value,
            block.timestamp,
            block.number,
            nonce++
        ));

        require(tips[tipId].from == address(0), "Tip ID collision");

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
        return tipId;
    }

    /**
     * @dev Internal function to finalize stream tip
     */
    function _finalizeStreamTip(address _streamer, bytes32 tipId) internal {
        _updateTipStats(msg.sender, _streamer, msg.value);

        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        totalFeesCollected += fee;

        (bool success, ) = payable(_streamer).call{value: msg.value - fee}("");
        require(success, "Transfer failed");

        Tip storage tip = tips[tipId];
        emit StreamTip(msg.sender, _streamer, tip.streamId, msg.value, tip.message, block.timestamp, tipId);
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
        validString(_purpose, MAX_PURPOSE_LENGTH)
        validString(_message, MAX_MESSAGE_LENGTH)
    {
        require(bytes(_purpose).length > 0, "Purpose required");

        bytes32 donationId = _processDonation(_to, _purpose, _message);
        _finalizeDonation(_to, donationId);
    }

    /**
     * @dev Internal function to process donation creation
     */
    function _processDonation(
        address _to,
        string calldata _purpose,
        string calldata _message
    ) internal returns (bytes32) {
        bytes32 donationId = keccak256(abi.encodePacked(
            msg.sender,
            _to,
            _purpose,
            msg.value,
            block.timestamp,
            block.number,
            nonce++
        ));

        require(donations[donationId].from == address(0), "Donation ID collision");

        donations[donationId] = DonationRecord({
            from: msg.sender,
            to: _to,
            amount: msg.value,
            purpose: _purpose,
            message: _message,
            timestamp: block.timestamp
        });

        allDonationIds.push(donationId);
        return donationId;
    }

    /**
     * @dev Internal function to finalize donation
     */
    function _finalizeDonation(address _to, bytes32 donationId) internal {
        _updateDonationStats(msg.sender, _to, msg.value);

        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        totalFeesCollected += fee;

        (bool success, ) = payable(_to).call{value: msg.value - fee}("");
        require(success, "Transfer failed");

        DonationRecord storage donation = donations[donationId];
        emit Donation(msg.sender, _to, msg.value, donation.purpose, donation.message, block.timestamp, donationId);
    }

    /**
     * @dev Internal function to update donation statistics
     * @param _sender Sender address
     * @param _recipient Recipient address
     * @param _amount Donation amount
     */
    function _updateDonationStats(address _sender, address _recipient, uint256 _amount) internal {
        userStats[_sender].totalDonationsSent += _amount;
        userStats[_sender].donationCount += 1;
        userStats[_recipient].totalDonationsReceived += _amount;
    }

    // View functions
    function getUserStats(address _user) external view returns (UserStats memory) {
        return userStats[_user];
    }

    function getStreamTips(string calldata _streamId) external view returns (bytes32[] memory) {
        require(bytes(_streamId).length <= MAX_STREAM_ID_LENGTH, "Stream ID too long");
        return streamTips[_streamId];
    }

    function getStreamTipCount(string calldata _streamId) external view returns (uint256) {
        require(bytes(_streamId).length <= MAX_STREAM_ID_LENGTH, "Stream ID too long");
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
        if (length == 0) return new bytes32[](0);

        uint256 limit = _limit > length ? length : _limit;
        // Add reasonable limit to prevent gas issues
        if (limit > 100) limit = 100;

        bytes32[] memory recentTips = new bytes32[](limit);

        for (uint256 i = 0; i < limit; i++) {
            recentTips[i] = allTipIds[length - 1 - i];
        }

        return recentTips;
    }

    function getRecentDonations(uint256 _limit) external view returns (bytes32[] memory) {
        uint256 length = allDonationIds.length;
        if (length == 0) return new bytes32[](0);

        uint256 limit = _limit > length ? length : _limit;
        // Add reasonable limit to prevent gas issues
        if (limit > 100) limit = 100;

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
        require(_tipAmount > 0, "Tip amount must be positive");
        require(_donationAmount > 0, "Donation amount must be positive");
        minimumTipAmount = _tipAmount;
        minimumDonationAmount = _donationAmount;
    }

    function withdrawFees() external onlyOwner nonReentrant {
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

    // Emergency functions - Modified to be more secure
    function emergencyWithdraw() external onlyOwner nonReentrant {
        require(paused(), "Contract must be paused for emergency withdrawal");

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