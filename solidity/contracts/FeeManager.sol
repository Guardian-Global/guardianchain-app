// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGTT {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract FeeManager {
    address public treasury;
    IGTT public gtt;
    address public owner;

    // Fee types in GTT tokens (18 decimals)
    uint256 public mintFee = 50 * 1e18;        // 50 GTT for NFT minting
    uint256 public sealFee = 100 * 1e18;       // 100 GTT for capsule sealing
    uint256 public proposalFee = 500 * 1e18;   // 500 GTT for DAO proposals
    uint256 public verificationFee = 25 * 1e18; // 25 GTT for content verification

    // Total fees collected per action
    mapping(string => uint256) public totalFeesCollected;
    
    // User fee payment history
    mapping(address => mapping(string => uint256)) public userFeePaid;
    mapping(address => uint256) public userTotalFeePaid;

    event FeePaid(address indexed user, string indexed action, uint256 amount);
    event FeeUpdated(string indexed action, uint256 oldAmount, uint256 newAmount);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(address _gtt, address _treasury) {
        owner = msg.sender;
        gtt = IGTT(_gtt);
        treasury = _treasury;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function payFee(string memory action) external {
        uint256 fee = getFee(action);
        require(fee > 0, "Invalid fee type");
        require(gtt.balanceOf(msg.sender) >= fee, "Insufficient GTT balance");
        require(gtt.transferFrom(msg.sender, treasury, fee), "GTT transfer failed");
        
        // Update tracking
        totalFeesCollected[action] += fee;
        userFeePaid[msg.sender][action] += fee;
        userTotalFeePaid[msg.sender] += fee;
        
        emit FeePaid(msg.sender, action, fee);
    }

    function getFee(string memory action) public view returns (uint256) {
        bytes32 actionHash = keccak256(bytes(action));
        
        if (actionHash == keccak256("mint")) {
            return mintFee;
        } else if (actionHash == keccak256("seal")) {
            return sealFee;
        } else if (actionHash == keccak256("proposal")) {
            return proposalFee;
        } else if (actionHash == keccak256("verification")) {
            return verificationFee;
        } else {
            return 0;
        }
    }

    function setFee(string memory action, uint256 amount) external onlyOwner {
        uint256 oldAmount = getFee(action);
        bytes32 actionHash = keccak256(bytes(action));
        
        if (actionHash == keccak256("mint")) {
            mintFee = amount;
        } else if (actionHash == keccak256("seal")) {
            sealFee = amount;
        } else if (actionHash == keccak256("proposal")) {
            proposalFee = amount;
        } else if (actionHash == keccak256("verification")) {
            verificationFee = amount;
        } else {
            revert("Invalid fee type");
        }
        
        emit FeeUpdated(action, oldAmount, amount);
    }

    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner address");
        owner = newOwner;
    }

    // View functions for analytics
    function getTotalFeesCollected(string memory action) external view returns (uint256) {
        return totalFeesCollected[action];
    }

    function getUserFeePaid(address user, string memory action) external view returns (uint256) {
        return userFeePaid[user][action];
    }

    function getUserTotalFeePaid(address user) external view returns (uint256) {
        return userTotalFeePaid[user];
    }

    // Get all fee amounts at once
    function getAllFees() external view returns (uint256, uint256, uint256, uint256) {
        return (mintFee, sealFee, proposalFee, verificationFee);
    }
}