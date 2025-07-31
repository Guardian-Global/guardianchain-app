// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GTT Token - Plan B Optimized Configuration
 * @dev GUARDIANCHAIN Token with optimized tokenomics for maximum founder revenue and institutional appeal
 * 
 * PLAN B FEATURES:
 * - 1B total supply (optimal for institutional adoption)
 * - 8% transaction fee structure for maximum revenue generation
 * - Strategic burn mechanism for value appreciation
 * - Community rewards distribution
 * - Enterprise-grade security and governance
 */
contract GTTTokenPlanB is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    // PLAN B CONFIGURATION
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B GTT
    uint256 public constant TRANSACTION_FEE_RATE = 800; // 8% (8000 basis points / 10000)
    uint256 public constant BURN_RATE = 250; // 2.5% of fees burned
    uint256 public constant FOUNDER_ALLOCATION = 200_000_000 * 10**18; // 20% founder
    uint256 public constant COMMUNITY_REWARDS = 400_000_000 * 10**18; // 40% community
    uint256 public constant PROTOCOL_DEVELOPMENT = 250_000_000 * 10**18; // 25% development
    uint256 public constant ENTERPRISE_PARTNERSHIPS = 150_000_000 * 10**18; // 15% partnerships

    // State variables
    address public founderWallet;
    address public communityRewardsPool;
    address public protocolTreasury;
    uint256 public totalFeesBurned;
    uint256 public totalFeesCollected;
    
    // Mappings
    mapping(address => bool) public exemptFromFees;
    mapping(address => uint256) public reputationScores;
    mapping(address => bool) public verifiedCreators;
    
    // Events
    event FeesCollected(uint256 amount, address indexed from, address indexed to);
    event TokensBurned(uint256 amount);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event CreatorVerified(address indexed creator);
    
    /**
     * @dev Constructor implementing Plan B tokenomics
     * @param _founderWallet Address to receive founder allocation
     * @param _communityPool Address for community rewards pool
     * @param _protocolTreasury Address for protocol development funds
     */
    constructor(
        address _founderWallet,
        address _communityPool,
        address _protocolTreasury
    ) ERC20("GUARDIANCHAIN Token", "GTT") Ownable(_founderWallet) {
        require(_founderWallet != address(0), "Invalid founder wallet");
        require(_communityPool != address(0), "Invalid community pool");
        require(_protocolTreasury != address(0), "Invalid protocol treasury");
        
        founderWallet = _founderWallet;
        communityRewardsPool = _communityPool;
        protocolTreasury = _protocolTreasury;
        
        // Initial distribution according to Plan B
        _mint(_founderWallet, FOUNDER_ALLOCATION);
        _mint(_communityPool, COMMUNITY_REWARDS);
        _mint(_protocolTreasury, PROTOCOL_DEVELOPMENT);
        _mint(address(this), ENTERPRISE_PARTNERSHIPS); // Held for partnerships
        
        // Exempt key addresses from fees
        exemptFromFees[_founderWallet] = true;
        exemptFromFees[_communityPool] = true;
        exemptFromFees[_protocolTreasury] = true;
        exemptFromFees[address(this)] = true;
    }
    
    /**
     * @dev Transfer function with Plan B fee structure
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transferWithFees(owner, to, amount);
        return true;
    }
    
    /**
     * @dev TransferFrom function with Plan B fee structure
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transferWithFees(from, to, amount);
        return true;
    }
    
    /**
     * @dev Internal transfer function implementing 8% fee structure
     */
    function _transferWithFees(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 transferAmount = amount;
        
        // Apply fees if neither address is exempt
        if (!exemptFromFees[from] && !exemptFromFees[to]) {
            uint256 feeAmount = (amount * TRANSACTION_FEE_RATE) / 10000; // 8% fee
            uint256 burnAmount = (feeAmount * BURN_RATE) / 10000; // 2.5% of fee burned
            uint256 founderFee = feeAmount - burnAmount;
            
            transferAmount = amount - feeAmount;
            
            // Transfer fees to founder
            if (founderFee > 0) {
                _transfer(from, founderWallet, founderFee);
                totalFeesCollected += founderFee;
                emit FeesCollected(founderFee, from, founderWallet);
            }
            
            // Burn tokens for deflationary mechanism
            if (burnAmount > 0) {
                _transfer(from, address(this), burnAmount);
                _burn(address(this), burnAmount);
                totalFeesBurned += burnAmount;
                emit TokensBurned(burnAmount);
            }
        }
        
        // Execute the main transfer
        _transfer(from, to, transferAmount);
    }
    
    /**
     * @dev Set fee exemption status for an address
     */
    function setFeeExemption(address account, bool exempt) external onlyOwner {
        exemptFromFees[account] = exempt;
    }
    
    /**
     * @dev Update reputation score for truth verification
     */
    function updateReputation(address user, uint256 score) external onlyOwner {
        reputationScores[user] = score;
        emit ReputationUpdated(user, score);
    }
    
    /**
     * @dev Verify creator for truth capsule creation
     */
    function verifyCreator(address creator) external onlyOwner {
        verifiedCreators[creator] = true;
        emit CreatorVerified(creator);
    }
    
    /**
     * @dev Get staking rewards for user (placeholder for future implementation)
     */
    function stakingRewards(address user) external view returns (uint256) {
        // Calculate based on balance and reputation
        uint256 balance = balanceOf(user);
        uint256 reputation = reputationScores[user];
        return (balance * reputation) / 10000; // Simplified calculation
    }
    
    /**
     * @dev Get verification rewards for user (placeholder for future implementation)
     */
    function verificationRewards(address user) external view returns (uint256) {
        if (verifiedCreators[user]) {
            return balanceOf(user) / 100; // 1% of balance as verification reward
        }
        return 0;
    }
    
    /**
     * @dev Release partnership tokens to verified partners
     */
    function releasePartnershipTokens(address partner, uint256 amount) external onlyOwner {
        require(partner != address(0), "Invalid partner address");
        require(balanceOf(address(this)) >= amount, "Insufficient partnership tokens");
        _transfer(address(this), partner, amount);
    }
    
    /**
     * @dev Emergency function to update key addresses
     */
    function updateAddresses(
        address newFounder,
        address newCommunityPool,
        address newTreasury
    ) external onlyOwner {
        if (newFounder != address(0)) founderWallet = newFounder;
        if (newCommunityPool != address(0)) communityRewardsPool = newCommunityPool;
        if (newTreasury != address(0)) protocolTreasury = newTreasury;
    }
    
    /**
     * @dev Get Plan B tokenomics summary
     */
    function getPlanBSummary() external view returns (
        uint256 supply,
        uint256 feeRate,
        uint256 burnRate,
        uint256 feesCollected,
        uint256 feesBurned
    ) {
        return (
            totalSupply(),
            TRANSACTION_FEE_RATE,
            BURN_RATE,
            totalFeesCollected,
            totalFeesBurned
        );
    }
}