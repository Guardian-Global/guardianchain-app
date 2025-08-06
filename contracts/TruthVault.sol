// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TruthVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable gttToken;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lastRewardClaim;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewardDebt;
    
    uint256 public totalStaked;
    uint256 public rewardRate = 100; // 1% per day (10000 = 100%)
    uint256 public minimumStakingPeriod = 1 days;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    
    constructor(address _gttToken, address initialOwner) Ownable(initialOwner) {
        gttToken = IERC20(_gttToken);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        gttToken.safeTransferFrom(msg.sender, address(this), amount);
        
        Stake storage userStake = stakes[msg.sender];
        
        // Claim existing rewards if any
        if (userStake.amount > 0) {
            _claimRewards(msg.sender);
        }
        
        userStake.amount += amount;
        userStake.timestamp = block.timestamp;
        userStake.lastRewardClaim = block.timestamp;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(
            block.timestamp >= userStake.timestamp + minimumStakingPeriod,
            "Minimum staking period not met"
        );
        
        _claimRewards(msg.sender);
        
        userStake.amount -= amount;
        totalStaked -= amount;
        
        gttToken.safeTransfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }
    
    function _claimRewards(address user) internal {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return;
        
        uint256 timeSinceLastClaim = block.timestamp - userStake.lastRewardClaim;
        uint256 rewards = (userStake.amount * rewardRate * timeSinceLastClaim) / (10000 * 1 days);
        
        if (rewards > 0) {
            userStake.lastRewardClaim = block.timestamp;
            
            // Check if vault has enough balance
            uint256 vaultBalance = gttToken.balanceOf(address(this)) - totalStaked;
            if (rewards > vaultBalance) {
                rewards = vaultBalance;
            }
            
            if (rewards > 0) {
                gttToken.safeTransfer(user, rewards);
                emit RewardsClaimed(user, rewards);
            }
        }
    }
    
    function pendingRewards(address user) external view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 timeSinceLastClaim = block.timestamp - userStake.lastRewardClaim;
        return (userStake.amount * rewardRate * timeSinceLastClaim) / (10000 * 1 days);
    }
    
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Rate too high"); // Max 10% per day
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }
    
    function setMinimumStakingPeriod(uint256 newPeriod) external onlyOwner {
        minimumStakingPeriod = newPeriod;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = gttToken.balanceOf(address(this));
        gttToken.safeTransfer(owner(), balance);
    }
}