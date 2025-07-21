// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AutoCompoundVault
 * @dev Dynamic yield farming vault with auto-compounding for GTT tokens
 */
contract AutoCompoundVault is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable gttToken;
    
    // Vault metrics
    uint256 public totalValueLocked;
    uint256 public currentAPY = 2500; // 25% base APY (in basis points)
    uint256 public compoundFrequency = 86400; // 24 hours
    uint256 public lastCompoundTime;
    uint256 public performanceFee = 200; // 2% performance fee
    
    // User data
    struct UserInfo {
        uint256 stakedAmount;
        uint256 shares;
        uint256 lastDepositTime;
        uint256 totalRewardsEarned;
        uint256 autoCompoundedAmount;
    }
    
    mapping(address => UserInfo) public userInfo;
    
    uint256 public totalShares;
    uint256 private _sharePrice = 1e18; // Initial share price
    
    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event Compounded(uint256 totalRewards, uint256 newShares);
    event APYUpdated(uint256 oldAPY, uint256 newAPY);
    event PerformanceFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor(address _gttToken) Ownable(msg.sender) {
        require(_gttToken != address(0), "Invalid GTT token address");
        gttToken = IERC20(_gttToken);
        lastCompoundTime = block.timestamp;
    }
    
    /**
     * @dev Deposit GTT tokens into the vault
     * @param amount Amount of GTT tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than zero");
        require(gttToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Calculate shares to mint
        uint256 shares = (totalShares == 0) ? amount : (amount * totalShares) / totalValueLocked;
        
        // Update user info
        UserInfo storage user = userInfo[msg.sender];
        user.stakedAmount += amount;
        user.shares += shares;
        user.lastDepositTime = block.timestamp;
        
        // Update vault totals
        totalValueLocked += amount;
        totalShares += shares;
        
        emit Deposited(msg.sender, amount, shares);
    }
    
    /**
     * @dev Withdraw GTT tokens from the vault
     * @param shares Number of shares to redeem
     */
    function withdraw(uint256 shares) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(shares > 0 && shares <= user.shares, "Invalid share amount");
        
        // Calculate withdrawal amount
        uint256 amount = (shares * totalValueLocked) / totalShares;
        
        // Update user info
        user.stakedAmount -= amount;
        user.shares -= shares;
        
        // Update vault totals
        totalValueLocked -= amount;
        totalShares -= shares;
        
        require(gttToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount, shares);
    }
    
    /**
     * @dev Auto-compound rewards for all users
     */
    function compound() external {
        require(block.timestamp >= lastCompoundTime + compoundFrequency, "Too early to compound");
        
        // Calculate time-based rewards
        uint256 timeElapsed = block.timestamp - lastCompoundTime;
        uint256 annualRewards = (totalValueLocked * currentAPY) / 10000;
        uint256 periodRewards = (annualRewards * timeElapsed) / 365 days;
        
        if (periodRewards > 0) {
            // Apply performance fee
            uint256 fee = (periodRewards * performanceFee) / 10000;
            uint256 netRewards = periodRewards - fee;
            
            // Compound rewards back into vault
            totalValueLocked += netRewards;
            
            // Transfer performance fee to owner
            if (fee > 0 && gttToken.balanceOf(address(this)) >= totalValueLocked + fee) {
                gttToken.transfer(owner(), fee);
            }
            
            emit Compounded(netRewards, 0);
        }
        
        lastCompoundTime = block.timestamp;
    }
    
    /**
     * @dev Get user's pending rewards
     * @param user Address to check
     */
    function getPendingRewards(address user) external view returns (uint256) {
        UserInfo memory userDetails = userInfo[user];
        if (userDetails.shares == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - lastCompoundTime;
        uint256 annualRewards = (totalValueLocked * currentAPY) / 10000;
        uint256 periodRewards = (annualRewards * timeElapsed) / 365 days;
        
        return (periodRewards * userDetails.shares) / totalShares;
    }
    
    /**
     * @dev Get current share price
     */
    function getSharePrice() external view returns (uint256) {
        if (totalShares == 0) return 1e18;
        return (totalValueLocked * 1e18) / totalShares;
    }
    
    /**
     * @dev Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 tvl,
        uint256 apy,
        uint256 totalUsers,
        uint256 sharePrice,
        uint256 nextCompoundTime
    ) {
        return (
            totalValueLocked,
            currentAPY,
            0, // We'd need to track this separately
            (totalShares == 0) ? 1e18 : (totalValueLocked * 1e18) / totalShares,
            lastCompoundTime + compoundFrequency
        );
    }
    
    /**
     * @dev Update APY (only owner)
     * @param newAPY New APY in basis points
     */
    function setAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 10000, "APY cannot exceed 100%");
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        emit APYUpdated(oldAPY, newAPY);
    }
    
    /**
     * @dev Update performance fee (only owner)
     * @param newFee New performance fee in basis points
     */
    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Performance fee cannot exceed 10%");
        uint256 oldFee = performanceFee;
        performanceFee = newFee;
        emit PerformanceFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Pause the vault (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the vault
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}