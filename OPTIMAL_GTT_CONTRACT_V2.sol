// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GuardianChain Truth Token (GTT) - Optimized for Maximum Revenue & Viral Growth
 * @dev Enhanced tokenomics with 8% transaction fee, burn mechanism, and community rewards
 * @dev Designed for institutional attraction and viral scalability in 2025
 */
contract GTTTokenOptimized is ERC20, Ownable, Pausable {
    // Core addresses
    address public founder;
    address public revenueWallet;
    address public communityRewardWallet;
    
    // Fee structure - optimized for maximum revenue
    uint256 public transactionFee = 800; // 8% = 800 basis points (INDUSTRY HIGH-END)
    uint256 public constant MAX_FEE = 1000; // 10% maximum (SafeMoon level)
    
    // Fee distribution (out of 8% total)
    uint256 public founderFeeShare = 625; // 5% to founder (62.5% of 8%)
    uint256 public burnFeeShare = 250;    // 2% burned (25% of 8%)
    uint256 public rewardFeeShare = 125;  // 1% to community (12.5% of 8%)
    
    // Tracking and analytics
    mapping(address => bool) public exemptFromFees;
    mapping(address => uint256) public userInteractions;
    uint256 public totalBurned;
    uint256 public totalCommunityRewards;
    uint256 public totalFounderRevenue;
    
    // Events for transparency
    event RevenueCollected(address indexed from, uint256 founderAmount, uint256 burnAmount, uint256 rewardAmount);
    event TokensBurned(uint256 amount, uint256 totalBurnedNow);
    event CommunityRewardDistributed(uint256 amount);
    event FounderWithdrawal(uint256 amount);
    event UserInteraction(address indexed user, uint256 amount, string interactionType);
    event FeeStructureUpdated(uint256 newFee, uint256 founderShare, uint256 burnShare, uint256 rewardShare);
    
    modifier onlyFounder() {
        require(msg.sender == founder, "Only founder can call this");
        _;
    }
    
    constructor() ERC20("GuardianChain Truth Token", "GTT") {
        founder = msg.sender;
        revenueWallet = msg.sender;
        communityRewardWallet = msg.sender; // Can be changed later
        
        // 1 billion tokens with 18 decimals (OPTIMAL SCARCITY)
        _mint(msg.sender, 1000000000 * 10**18);
        
        // Founder exempt from fees
        exemptFromFees[msg.sender] = true;
        exemptFromFees[address(this)] = true; // Contract exempt for burns
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        
        // Calculate fees if not exempt
        if (!exemptFromFees[owner] && !exemptFromFees[to] && to != address(0)) {
            uint256 totalFeeAmount = (amount * transactionFee) / 10000;
            
            if (totalFeeAmount > 0) {
                // Calculate fee distribution
                uint256 founderAmount = (totalFeeAmount * founderFeeShare) / 1000;
                uint256 burnAmount = (totalFeeAmount * burnFeeShare) / 1000;
                uint256 rewardAmount = totalFeeAmount - founderAmount - burnAmount; // Remaining goes to rewards
                
                // Transfer founder revenue
                if (founderAmount > 0) {
                    _transfer(owner, revenueWallet, founderAmount);
                    totalFounderRevenue += founderAmount;
                }
                
                // Burn tokens (deflationary mechanism)
                if (burnAmount > 0) {
                    _transfer(owner, address(this), burnAmount);
                    _burn(address(this), burnAmount);
                    totalBurned += burnAmount;
                    emit TokensBurned(burnAmount, totalBurned);
                }
                
                // Community rewards
                if (rewardAmount > 0) {
                    _transfer(owner, communityRewardWallet, rewardAmount);
                    totalCommunityRewards += rewardAmount;
                    emit CommunityRewardDistributed(rewardAmount);
                }
                
                emit RevenueCollected(owner, founderAmount, burnAmount, rewardAmount);
                
                // Transfer remaining amount after fees
                _transfer(owner, to, amount - totalFeeAmount);
            } else {
                _transfer(owner, to, amount);
            }
        } else {
            _transfer(owner, to, amount);
        }
        
        // Track user interaction
        userInteractions[owner]++;
        emit UserInteraction(owner, amount, "transfer");
        
        return true;
    }
    
    // FOUNDER CONTROL FUNCTIONS
    function setTransactionFee(uint256 _fee) external onlyFounder {
        require(_fee <= MAX_FEE, "Fee exceeds maximum");
        transactionFee = _fee;
        emit FeeStructureUpdated(_fee, founderFeeShare, burnFeeShare, rewardFeeShare);
    }
    
    function setFeeDistribution(
        uint256 _founderShare,
        uint256 _burnShare,
        uint256 _rewardShare
    ) external onlyFounder {
        require(_founderShare + _burnShare + _rewardShare == 1000, "Shares must total 1000");
        founderFeeShare = _founderShare;
        burnFeeShare = _burnShare;
        rewardFeeShare = _rewardShare;
        emit FeeStructureUpdated(transactionFee, _founderShare, _burnShare, _rewardShare);
    }
    
    function setRevenueWallet(address _wallet) external onlyFounder {
        require(_wallet != address(0), "Invalid address");
        revenueWallet = _wallet;
    }
    
    function setCommunityRewardWallet(address _wallet) external onlyFounder {
        require(_wallet != address(0), "Invalid address");
        communityRewardWallet = _wallet;
    }
    
    function exemptFromFee(address _address, bool _exempt) external onlyFounder {
        exemptFromFees[_address] = _exempt;
    }
    
    function withdrawFounderRevenue() external onlyFounder {
        uint256 balance = balanceOf(revenueWallet);
        require(balance > 0, "No revenue to withdraw");
        
        _transfer(revenueWallet, founder, balance);
        emit FounderWithdrawal(balance);
    }
    
    function emergencyPause() external onlyFounder {
        _pause();
    }
    
    function emergencyUnpause() external onlyFounder {
        _unpause();
    }
    
    // ANALYTICS AND MONITORING FUNCTIONS
    function getTotalRevenue() external view returns (uint256) {
        return balanceOf(revenueWallet);
    }
    
    function getUserInteractionCount(address user) external view returns (uint256) {
        return userInteractions[user];
    }
    
    function getTokenomicsStats() external view returns (
        uint256 currentSupply,
        uint256 totalBurnedTokens,
        uint256 founderBalance,
        uint256 revenueBalance,
        uint256 communityRewardBalance,
        uint256 currentFee
    ) {
        return (
            totalSupply(),
            totalBurned,
            balanceOf(founder),
            balanceOf(revenueWallet),
            balanceOf(communityRewardWallet),
            transactionFee
        );
    }
    
    function getRevenueBreakdown() external view returns (
        uint256 totalFounderEarned,
        uint256 totalTokensBurned,
        uint256 totalCommunityEarned
    ) {
        return (
            totalFounderRevenue,
            totalBurned,
            totalCommunityRewards
        );
    }
    
    // Calculate effective token supply (total - burned)
    function effectiveSupply() external view returns (uint256) {
        return totalSupply() - totalBurned;
    }
    
    // EMERGENCY FUNCTIONS
    function emergencyTokenRecovery(address token, uint256 amount) external onlyFounder {
        // Recover any accidentally sent tokens (not GTT)
        require(token != address(this), "Cannot recover GTT");
        IERC20(token).transfer(founder, amount);
    }
}