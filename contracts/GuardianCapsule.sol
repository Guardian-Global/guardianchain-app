// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GuardianCapsule
 * @dev ERC-721 NFT contract for GUARDIANCHAIN truth capsules
 * @notice Implements immutable memory preservation with yield mechanics
 */
contract GuardianCapsule is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Capsule metadata structure
    struct Capsule {
        string veritasId;           // Unique Veritas identifier
        uint256 griefScore;         // Emotional weight (0-1000, representing 0.0-10.0)
        uint256 yieldAmount;        // Claimable yield in wei
        address creator;            // Original author
        uint256 creationTime;       // Timestamp of creation
        bool yieldClaimed;          // Yield claim status
        uint8 verificationLevel;    // 0=unverified, 1=community, 2=professional, 3=sovereign
        string category;            // Content category
        bytes32 contentHash;        // Hash of off-chain content for integrity
    }
    
    // Storage mappings
    mapping(uint256 => Capsule) public capsules;
    mapping(address => uint256[]) public creatorCapsules;
    mapping(string => uint256) public veritasIdToTokenId;
    mapping(address => bool) public authorizedValidators;
    
    // Contract state
    uint256 public totalYieldPool;
    uint256 public minimumGriefScore = 100; // Minimum 1.0 grief score
    uint256 public maxYieldPerCapsule = 1 ether;
    
    // Events
    event CapsuleCreated(uint256 indexed tokenId, address indexed creator, string veritasId, uint256 griefScore);
    event YieldClaimed(uint256 indexed tokenId, address indexed claimer, uint256 amount);
    event CapsuleVerified(uint256 indexed tokenId, uint8 verificationLevel, address indexed validator);
    event YieldPoolFunded(uint256 amount, address indexed funder);
    
    constructor() ERC721("GuardianCapsule", "GCAP") {}
    
    /**
     * @dev Creates a new truth capsule NFT
     * @param to Address to mint the capsule to
     * @param tokenURI IPFS URI containing capsule metadata
     * @param veritasId Unique Veritas identifier
     * @param griefScore Emotional weight (0-1000)
     * @param category Content category
     * @param contentHash Hash of the capsule content
     */
    function mintCapsule(
        address to,
        string memory tokenURI,
        string memory veritasId,
        uint256 griefScore,
        string memory category,
        bytes32 contentHash
    ) external whenNotPaused returns (uint256) {
        require(griefScore >= minimumGriefScore, "Grief score too low");
        require(griefScore <= 1000, "Grief score too high");
        require(bytes(veritasId).length > 0, "Veritas ID required");
        require(veritasIdToTokenId[veritasId] == 0, "Veritas ID already exists");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Calculate yield based on grief score and available pool
        uint256 yieldAmount = calculateYieldAmount(griefScore);
        
        // Create capsule metadata
        capsules[newTokenId] = Capsule({
            veritasId: veritasId,
            griefScore: griefScore,
            yieldAmount: yieldAmount,
            creator: to,
            creationTime: block.timestamp,
            yieldClaimed: false,
            verificationLevel: 0,
            category: category,
            contentHash: contentHash
        });
        
        // Update mappings
        creatorCapsules[to].push(newTokenId);
        veritasIdToTokenId[veritasId] = newTokenId;
        
        // Mint the NFT
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit CapsuleCreated(newTokenId, to, veritasId, griefScore);
        return newTokenId;
    }
    
    /**
     * @dev Claims yield for a capsule (one-time only)
     * @param tokenId The capsule token ID
     */
    function claimYield(uint256 tokenId) external nonReentrant whenNotPaused {
        require(_exists(tokenId), "Capsule does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not capsule owner");
        
        Capsule storage capsule = capsules[tokenId];
        require(!capsule.yieldClaimed, "Yield already claimed");
        require(capsule.yieldAmount > 0, "No yield available");
        require(address(this).balance >= capsule.yieldAmount, "Insufficient contract balance");
        
        capsule.yieldClaimed = true;
        
        (bool success, ) = payable(msg.sender).call{value: capsule.yieldAmount}("");
        require(success, "Yield transfer failed");
        
        emit YieldClaimed(tokenId, msg.sender, capsule.yieldAmount);
    }
    
    /**
     * @dev Verifies a capsule (authorized validators only)
     * @param tokenId The capsule token ID
     * @param verificationLevel The verification level (1-3)
     */
    function verifyCapsule(uint256 tokenId, uint8 verificationLevel) external {
        require(authorizedValidators[msg.sender] || msg.sender == owner(), "Not authorized validator");
        require(_exists(tokenId), "Capsule does not exist");
        require(verificationLevel > 0 && verificationLevel <= 3, "Invalid verification level");
        
        Capsule storage capsule = capsules[tokenId];
        require(capsule.verificationLevel < verificationLevel, "Cannot downgrade verification");
        
        capsule.verificationLevel = verificationLevel;
        emit CapsuleVerified(tokenId, verificationLevel, msg.sender);
    }
    
    /**
     * @dev Calculates yield amount based on grief score
     * @param griefScore The grief score (0-1000)
     */
    function calculateYieldAmount(uint256 griefScore) internal view returns (uint256) {
        if (totalYieldPool == 0) return 0;
        
        // Yield scales with grief score: higher grief = higher yield
        // Base yield + bonus for high grief scores
        uint256 baseYield = (griefScore * 1e15) / 1000; // 0.001 ETH per grief point
        uint256 bonusMultiplier = griefScore > 800 ? 2 : griefScore > 600 ? 1 : 0;
        uint256 totalYield = baseYield * (1 + bonusMultiplier);
        
        return totalYield > maxYieldPerCapsule ? maxYieldPerCapsule : totalYield;
    }
    
    /**
     * @dev Funds the yield pool
     */
    function fundYieldPool() external payable {
        require(msg.value > 0, "Must send ETH");
        totalYieldPool += msg.value;
        emit YieldPoolFunded(msg.value, msg.sender);
    }
    
    /**
     * @dev Adds or removes authorized validators
     * @param validator Address of the validator
     * @param authorized Authorization status
     */
    function setAuthorizedValidator(address validator, bool authorized) external onlyOwner {
        authorizedValidators[validator] = authorized;
    }
    
    /**
     * @dev Updates yield parameters
     */
    function setYieldParameters(uint256 _minimumGriefScore, uint256 _maxYieldPerCapsule) external onlyOwner {
        minimumGriefScore = _minimumGriefScore;
        maxYieldPerCapsule = _maxYieldPerCapsule;
    }
    
    /**
     * @dev Gets capsules created by an address
     * @param creator The creator address
     */
    function getCapsulesByCreator(address creator) external view returns (uint256[] memory) {
        return creatorCapsules[creator];
    }
    
    /**
     * @dev Gets detailed capsule information
     * @param tokenId The capsule token ID
     */
    function getCapsuleDetails(uint256 tokenId) external view returns (Capsule memory) {
        require(_exists(tokenId), "Capsule does not exist");
        return capsules[tokenId];
    }
    
    /**
     * @dev Emergency pause functionality
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Required overrides for multiple inheritance
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Accept ETH for yield pool funding
    receive() external payable {
        totalYieldPool += msg.value;
        emit YieldPoolFunded(msg.value, msg.sender);
    }
}