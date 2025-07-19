// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldVault
 * @dev Manages GTT yield distribution and claiming for GuardianChain capsule creators
 */
contract YieldVault is Ownable, ReentrancyGuard {
    IERC20 public immutable gtt;
    
    mapping(address => uint256) public earnedYield;
    mapping(address => uint256) public withdrawnYield;
    mapping(address => uint256) public lastDistribution;
    
    uint256 public totalDistributed;
    uint256 public totalEarned;
    uint256 public distributionCount;
    
    event YieldDeposited(address indexed capsuleOwner, uint256 amount, uint256 timestamp);
    event YieldClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event BulkDistribution(uint256 totalAmount, uint256 recipientCount, uint256 timestamp);

    constructor(address gttToken) Ownable(msg.sender) {
        gtt = IERC20(gttToken);
    }

    /**
     * @dev Deposit yield for a specific capsule owner (admin only)
     */
    function depositYield(address capsuleOwner, uint256 amount) external onlyOwner {
        require(capsuleOwner != address(0), "Invalid capsule owner");
        require(amount > 0, "Amount must be greater than 0");
        require(gtt.transferFrom(msg.sender, address(this), amount), "GTT transfer failed");
        
        earnedYield[capsuleOwner] += amount;
        lastDistribution[capsuleOwner] = block.timestamp;
        totalEarned += amount;
        
        emit YieldDeposited(capsuleOwner, amount, block.timestamp);
    }

    /**
     * @dev Bulk deposit yield for multiple capsule owners
     */
    function bulkDepositYield(
        address[] calldata capsuleOwners, 
        uint256[] calldata amounts
    ) external onlyOwner {
        require(capsuleOwners.length == amounts.length, "Array length mismatch");
        require(capsuleOwners.length > 0, "Empty arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(gtt.transferFrom(msg.sender, address(this), totalAmount), "GTT transfer failed");
        
        for (uint256 i = 0; i < capsuleOwners.length; i++) {
            require(capsuleOwners[i] != address(0), "Invalid capsule owner");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            earnedYield[capsuleOwners[i]] += amounts[i];
            lastDistribution[capsuleOwners[i]] = block.timestamp;
            totalEarned += amounts[i];
            
            emit YieldDeposited(capsuleOwners[i], amounts[i], block.timestamp);
        }
        
        distributionCount++;
        emit BulkDistribution(totalAmount, capsuleOwners.length, block.timestamp);
    }

    /**
     * @dev Claim all available yield for the caller
     */
    function claimYield() external nonReentrant {
        uint256 claimable = getClaimable(msg.sender);
        require(claimable > 0, "Nothing to claim");
        
        withdrawnYield[msg.sender] += claimable;
        totalDistributed += claimable;
        
        require(gtt.transfer(msg.sender, claimable), "Claim transfer failed");
        
        emit YieldClaimed(msg.sender, claimable, block.timestamp);
    }

    /**
     * @dev Get claimable yield for a user
     */
    function getClaimable(address user) public view returns (uint256) {
        return earnedYield[user] - withdrawnYield[user];
    }

    /**
     * @dev Get detailed yield info for a user
     */
    function getUserYieldInfo(address user) external view returns (
        uint256 totalEarned_,
        uint256 totalWithdrawn,
        uint256 claimable,
        uint256 lastDistributionTime
    ) {
        totalEarned_ = earnedYield[user];
        totalWithdrawn = withdrawnYield[user];
        claimable = getClaimable(user);
        lastDistributionTime = lastDistribution[user];
    }

    /**
     * @dev Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 totalEarned_,
        uint256 totalDistributed_,
        uint256 pendingClaims,
        uint256 vaultBalance,
        uint256 distributionCount_
    ) {
        totalEarned_ = totalEarned;
        totalDistributed_ = totalDistributed;
        pendingClaims = totalEarned - totalDistributed;
        vaultBalance = gtt.balanceOf(address(this));
        distributionCount_ = distributionCount;
    }

    /**
     * @dev Emergency withdraw (admin only) - for contract upgrades or emergencies
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= gtt.balanceOf(address(this)), "Insufficient balance");
        require(gtt.transfer(owner(), amount), "Emergency withdraw failed");
    }
}