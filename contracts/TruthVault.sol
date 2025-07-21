// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./SimpleGTTToken.sol";

/**
 * @title TruthVault
 * @dev Yield distribution and capsule verification system for GUARDIANCHAIN
 */
contract TruthVault is Ownable, ReentrancyGuard, Pausable {
    SimpleGTTToken public immutable gttToken;
    
    // Capsule verification tracking
    mapping(bytes32 => uint256) public capsuleYield; // capsuleId => yield amount
    mapping(bytes32 => bool) public capsuleVerified; // capsuleId => verified status
    mapping(bytes32 => address) public capsuleCreator; // capsuleId => creator address
    mapping(address => uint256) public userTotalYield; // user => total yield earned
    mapping(address => bytes32[]) public userCapsules; // user => capsule IDs
    
    // Yield configuration
    uint256 public baseYieldAmount = 100 * 10**18; // 100 GTT base yield
    uint256 public verificationBonus = 50 * 10**18; // 50 GTT bonus for verification
    uint256 public shareBonus = 25 * 10**18; // 25 GTT bonus per share milestone
    
    // System stats
    uint256 public totalCapsulesCreated;
    uint256 public totalCapsulesVerified;
    uint256 public totalYieldDistributed;
    
    // Events
    event CapsuleCreated(bytes32 indexed capsuleId, address indexed creator, uint256 timestamp);
    event CapsuleVerified(bytes32 indexed capsuleId, address indexed verifier, uint256 yieldAmount);
    event YieldClaimed(address indexed user, bytes32 indexed capsuleId, uint256 amount);
    event YieldConfigUpdated(uint256 baseAmount, uint256 verificationBonus, uint256 shareBonus);
    
    constructor(address _gttToken) {
        require(_gttToken != address(0), "Invalid GTT token address");
        gttToken = SimpleGTTToken(_gttToken);
    }
    
    /**
     * @dev Create a new truth capsule
     * @param capsuleId Unique identifier for the capsule
     * @param creator Address of the capsule creator
     */
    function createCapsule(bytes32 capsuleId, address creator) external onlyOwner {
        require(creator != address(0), "Invalid creator address");
        require(capsuleCreator[capsuleId] == address(0), "Capsule already exists");
        
        capsuleCreator[capsuleId] = creator;
        userCapsules[creator].push(capsuleId);
        totalCapsulesCreated++;
        
        emit CapsuleCreated(capsuleId, creator, block.timestamp);
    }
    
    /**
     * @dev Verify a capsule and calculate yield
     * @param capsuleId Capsule to verify
     * @param views Number of views the capsule received
     * @param shares Number of shares the capsule received
     * @param verifications Number of community verifications
     */
    function verifyCapsule(
        bytes32 capsuleId,
        uint256 views,
        uint256 shares,
        uint256 verifications
    ) external onlyOwner {
        require(capsuleCreator[capsuleId] != address(0), "Capsule does not exist");
        require(!capsuleVerified[capsuleId], "Capsule already verified");
        
        // Calculate yield based on engagement
        uint256 totalYield = baseYieldAmount;
        
        // Add verification bonus
        if (verifications > 0) {
            totalYield += verificationBonus;
        }
        
        // Add share bonuses (25 GTT per 10 shares)
        uint256 shareMilestones = shares / 10;
        totalYield += shareMilestones * shareBonus;
        
        // Add view bonuses (1 GTT per 100 views)
        uint256 viewBonus = (views / 100) * 10**18;
        totalYield += viewBonus;
        
        capsuleYield[capsuleId] = totalYield;
        capsuleVerified[capsuleId] = true;
        userTotalYield[capsuleCreator[capsuleId]] += totalYield;
        totalCapsulesVerified++;
        totalYieldDistributed += totalYield;
        
        emit CapsuleVerified(capsuleId, msg.sender, totalYield);
    }
    
    /**
     * @dev Claim yield for a verified capsule
     * @param capsuleId Capsule to claim yield for
     */
    function claimYield(bytes32 capsuleId) external nonReentrant whenNotPaused {
        require(capsuleCreator[capsuleId] == msg.sender, "Not capsule creator");
        require(capsuleVerified[capsuleId], "Capsule not verified");
        require(capsuleYield[capsuleId] > 0, "No yield to claim");
        
        uint256 yieldAmount = capsuleYield[capsuleId];
        capsuleYield[capsuleId] = 0; // Prevent double claiming
        
        // Transfer GTT tokens from vault to user
        gttToken.distributeYield(msg.sender, yieldAmount);
        
        emit YieldClaimed(msg.sender, capsuleId, yieldAmount);
    }
    
    /**
     * @dev Batch claim yield for multiple capsules
     * @param capsuleIds Array of capsule IDs to claim yield for
     */
    function batchClaimYield(bytes32[] calldata capsuleIds) external nonReentrant whenNotPaused {
        uint256 totalYield = 0;
        
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            bytes32 capsuleId = capsuleIds[i];
            
            if (capsuleCreator[capsuleId] == msg.sender && 
                capsuleVerified[capsuleId] && 
                capsuleYield[capsuleId] > 0) {
                
                totalYield += capsuleYield[capsuleId];
                emit YieldClaimed(msg.sender, capsuleId, capsuleYield[capsuleId]);
                capsuleYield[capsuleId] = 0;
            }
        }
        
        require(totalYield > 0, "No yield to claim");
        gttToken.distributeYield(msg.sender, totalYield);
    }
    
    /**
     * @dev Update yield configuration (only owner)
     */
    function updateYieldConfig(
        uint256 _baseYieldAmount,
        uint256 _verificationBonus,
        uint256 _shareBonus
    ) external onlyOwner {
        baseYieldAmount = _baseYieldAmount;
        verificationBonus = _verificationBonus;
        shareBonus = _shareBonus;
        
        emit YieldConfigUpdated(_baseYieldAmount, _verificationBonus, _shareBonus);
    }
    
    /**
     * @dev Get capsule information
     * @param capsuleId Capsule to query
     */
    function getCapsuleInfo(bytes32 capsuleId) external view returns (
        address creator,
        bool verified,
        uint256 yieldAmount
    ) {
        return (
            capsuleCreator[capsuleId],
            capsuleVerified[capsuleId],
            capsuleYield[capsuleId]
        );
    }
    
    /**
     * @dev Get user's capsules
     * @param user Address to query
     */
    function getUserCapsules(address user) external view returns (bytes32[] memory) {
        return userCapsules[user];
    }
    
    /**
     * @dev Get claimable yield for user
     * @param user Address to query
     */
    function getClaimableYield(address user) external view returns (uint256 totalClaimable) {
        bytes32[] memory capsules = userCapsules[user];
        
        for (uint256 i = 0; i < capsules.length; i++) {
            if (capsuleVerified[capsules[i]]) {
                totalClaimable += capsuleYield[capsules[i]];
            }
        }
        
        return totalClaimable;
    }
    
    /**
     * @dev Get system statistics
     */
    function getSystemStats() external view returns (
        uint256 totalCapsules,
        uint256 verifiedCapsules,
        uint256 totalYield,
        uint256 baseYield,
        uint256 verificationBonus_,
        uint256 shareBonus_
    ) {
        return (
            totalCapsulesCreated,
            totalCapsulesVerified,
            totalYieldDistributed,
            baseYieldAmount,
            verificationBonus,
            shareBonus
        );
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}