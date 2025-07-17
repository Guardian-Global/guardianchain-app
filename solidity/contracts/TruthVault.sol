// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./GTTToken.sol";

/**
 * @title TruthVault
 * @dev DAO-controlled vault for distributing GTT yield rewards
 * Manages truth capsule verification and yield claims
 */
contract TruthVault is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    
    GTTToken public immutable gttToken;
    
    struct CapsuleVerification {
        address creator;
        bool isVerified;
        bool isSealed;
        uint256 truthYield;
        uint256 totalClaimed;
        uint256 lastClaimTime;
        string ipfsHash;
        string veritasSealUrl;
    }
    
    mapping(uint256 => CapsuleVerification) public capsules;
    mapping(address => uint256) public totalUserClaims;
    mapping(uint256 => mapping(address => uint256)) public capsuleUserClaims;
    
    // Yield calculation parameters (can be updated by governance)
    uint256 public yieldToGTTRatio = 100; // 1 yield point = 0.01 GTT (10^18 wei)
    uint256 public premiumMultiplier = 150; // 1.5x for premium tier
    uint256 public eliteMultiplier = 200; // 2.0x for elite tier
    uint256 public legendaryMultiplier = 300; // 3.0x for legendary tier
    
    uint256 public constant PREMIUM_THRESHOLD = 100 * 10**18; // 100 yield points
    uint256 public constant ELITE_THRESHOLD = 250 * 10**18; // 250 yield points
    uint256 public constant LEGENDARY_THRESHOLD = 500 * 10**18; // 500 yield points
    
    uint256 public constant MIN_CLAIM_AMOUNT = 1 * 10**18; // 1 GTT minimum
    uint256 public constant CLAIM_COOLDOWN = 7 days;
    
    event CapsuleRegistered(
        uint256 indexed capsuleId,
        address indexed creator,
        string ipfsHash
    );
    
    event CapsuleVerified(
        uint256 indexed capsuleId,
        bool isVerified,
        bool isSealed
    );
    
    event YieldClaimed(
        address indexed user,
        uint256 indexed capsuleId,
        uint256 yieldAmount,
        uint256 gttAmount,
        string reason
    );
    
    event YieldUpdated(
        uint256 indexed capsuleId,
        uint256 oldYield,
        uint256 newYield
    );
    
    event ParametersUpdated(
        uint256 yieldToGTTRatio,
        uint256 premiumMultiplier,
        uint256 eliteMultiplier,
        uint256 legendaryMultiplier
    );
    
    modifier onlyVerifiedCapsule(uint256 capsuleId) {
        require(capsules[capsuleId].isVerified || capsules[capsuleId].isSealed, 
                "TruthVault: Capsule not verified");
        _;
    }
    
    modifier onlyCapsuleCreator(uint256 capsuleId) {
        require(capsules[capsuleId].creator == msg.sender, 
                "TruthVault: Not capsule creator");
        _;
    }
    
    constructor(address _gttToken, address _admin) {
        require(_gttToken != address(0), "TruthVault: GTT token cannot be zero");
        require(_admin != address(0), "TruthVault: Admin cannot be zero");
        
        gttToken = GTTToken(_gttToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(GOVERNOR_ROLE, _admin);
        _grantRole(ORACLE_ROLE, _admin);
    }
    
    /**
     * @dev Register a new truth capsule
     * @param capsuleId Unique identifier for the capsule
     * @param creator Address of the capsule creator
     * @param ipfsHash IPFS hash of the capsule content
     */
    function registerCapsule(
        uint256 capsuleId,
        address creator,
        string calldata ipfsHash
    ) external onlyRole(ORACLE_ROLE) {
        require(creator != address(0), "TruthVault: Creator cannot be zero");
        require(bytes(ipfsHash).length > 0, "TruthVault: IPFS hash required");
        require(capsules[capsuleId].creator == address(0), "TruthVault: Capsule already exists");
        
        capsules[capsuleId] = CapsuleVerification({
            creator: creator,
            isVerified: false,
            isSealed: false,
            truthYield: 0,
            totalClaimed: 0,
            lastClaimTime: 0,
            ipfsHash: ipfsHash,
            veritasSealUrl: ""
        });
        
        emit CapsuleRegistered(capsuleId, creator, ipfsHash);
    }
    
    /**
     * @dev Verify a capsule (community verification or Veritas sealing)
     * @param capsuleId Capsule to verify
     * @param isVerified True if community verified
     * @param isSealed True if Veritas sealed
     * @param veritasSealUrl URL of the Veritas seal (if applicable)
     */
    function verifyCapsule(
        uint256 capsuleId,
        bool isVerified,
        bool isSealed,
        string calldata veritasSealUrl
    ) external onlyRole(ORACLE_ROLE) {
        require(capsules[capsuleId].creator != address(0), "TruthVault: Capsule not registered");
        
        capsules[capsuleId].isVerified = isVerified;
        capsules[capsuleId].isSealed = isSealed;
        
        if (isSealed && bytes(veritasSealUrl).length > 0) {
            capsules[capsuleId].veritasSealUrl = veritasSealUrl;
        }
        
        emit CapsuleVerified(capsuleId, isVerified, isSealed);
    }
    
    /**
     * @dev Update capsule yield (called by oracle based on engagement)
     * @param capsuleId Capsule to update
     * @param newYield New yield amount in wei (18 decimals)
     */
    function updateYield(
        uint256 capsuleId,
        uint256 newYield
    ) external onlyRole(ORACLE_ROLE) {
        require(capsules[capsuleId].creator != address(0), "TruthVault: Capsule not registered");
        
        uint256 oldYield = capsules[capsuleId].truthYield;
        capsules[capsuleId].truthYield = newYield;
        
        emit YieldUpdated(capsuleId, oldYield, newYield);
    }
    
    /**
     * @dev Claim yield rewards for a verified capsule
     * @param capsuleId Capsule to claim yield for
     */
    function claimYield(uint256 capsuleId) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyVerifiedCapsule(capsuleId)
        onlyCapsuleCreator(capsuleId)
    {
        CapsuleVerification storage capsule = capsules[capsuleId];
        
        // Check cooldown period
        require(
            block.timestamp >= capsule.lastClaimTime + CLAIM_COOLDOWN,
            "TruthVault: Claim cooldown active"
        );
        
        // Calculate claimable amount
        uint256 totalEarned = calculateGTTReward(capsule.truthYield);
        uint256 claimable = totalEarned - capsule.totalClaimed;
        
        require(claimable >= MIN_CLAIM_AMOUNT, "TruthVault: Insufficient yield to claim");
        
        // Update claim records
        capsule.totalClaimed += claimable;
        capsule.lastClaimTime = block.timestamp;
        totalUserClaims[msg.sender] += claimable;
        capsuleUserClaims[capsuleId][msg.sender] += claimable;
        
        // Mint GTT tokens
        string memory reason = string(abi.encodePacked("Yield claim for capsule #", _toString(capsuleId)));
        gttToken.mintYieldReward(msg.sender, claimable, reason);
        
        emit YieldClaimed(msg.sender, capsuleId, capsule.truthYield, claimable, reason);
    }
    
    /**
     * @dev Calculate GTT reward amount based on yield and tier multipliers
     * @param yieldAmount Truth yield amount in wei
     * @return GTT amount to be minted
     */
    function calculateGTTReward(uint256 yieldAmount) public view returns (uint256) {
        if (yieldAmount == 0) return 0;
        
        uint256 baseReward = (yieldAmount * yieldToGTTRatio) / 10000; // Convert to GTT
        
        // Apply tier multipliers
        uint256 multiplier = 100; // 1.0x base multiplier
        
        if (yieldAmount >= LEGENDARY_THRESHOLD) {
            multiplier = legendaryMultiplier;
        } else if (yieldAmount >= ELITE_THRESHOLD) {
            multiplier = eliteMultiplier;
        } else if (yieldAmount >= PREMIUM_THRESHOLD) {
            multiplier = premiumMultiplier;
        }
        
        return (baseReward * multiplier) / 100;
    }
    
    /**
     * @dev Get capsule claim information
     * @param capsuleId Capsule ID
     * @return creator Capsule creator address
     * @return totalEarned Total GTT earned
     * @return totalClaimed Total GTT claimed
     * @return claimable Current claimable amount
     * @return nextClaimTime When next claim is available
     */
    function getCapsuleClaimInfo(uint256 capsuleId) 
        external 
        view 
        returns (
            address creator,
            uint256 totalEarned,
            uint256 totalClaimed,
            uint256 claimable,
            uint256 nextClaimTime
        ) 
    {
        CapsuleVerification memory capsule = capsules[capsuleId];
        creator = capsule.creator;
        totalEarned = calculateGTTReward(capsule.truthYield);
        totalClaimed = capsule.totalClaimed;
        claimable = totalEarned > totalClaimed ? totalEarned - totalClaimed : 0;
        nextClaimTime = capsule.lastClaimTime + CLAIM_COOLDOWN;
    }
    
    /**
     * @dev Update yield calculation parameters (governance only)
     */
    function updateParameters(
        uint256 _yieldToGTTRatio,
        uint256 _premiumMultiplier,
        uint256 _eliteMultiplier,
        uint256 _legendaryMultiplier
    ) external onlyRole(GOVERNOR_ROLE) {
        require(_yieldToGTTRatio > 0, "TruthVault: Invalid ratio");
        require(_premiumMultiplier >= 100, "TruthVault: Invalid premium multiplier");
        require(_eliteMultiplier >= _premiumMultiplier, "TruthVault: Invalid elite multiplier");
        require(_legendaryMultiplier >= _eliteMultiplier, "TruthVault: Invalid legendary multiplier");
        
        yieldToGTTRatio = _yieldToGTTRatio;
        premiumMultiplier = _premiumMultiplier;
        eliteMultiplier = _eliteMultiplier;
        legendaryMultiplier = _legendaryMultiplier;
        
        emit ParametersUpdated(_yieldToGTTRatio, _premiumMultiplier, _eliteMultiplier, _legendaryMultiplier);
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyRole(GOVERNOR_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(GOVERNOR_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Convert uint256 to string (internal utility)
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}