// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GuardianPass
 * @dev NFT-gated features and prestige badges for GUARDIANCHAIN ecosystem
 */
contract GuardianPass is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MAX_SUPPLY = 1000;
    
    // Rarity tiers
    enum RarityTier { Common, Uncommon, Rare, Epic, Legendary }
    
    struct PassMetadata {
        RarityTier rarity;
        uint256 boostedAPY; // Additional APY in basis points
        bool earlyDAOAccess;
        uint256 stakingMultiplier; // Multiplier in basis points (10000 = 1x)
        string tierName;
        uint256 mintTime;
    }
    
    mapping(uint256 => PassMetadata) public passMetadata;
    mapping(RarityTier => uint256) public raritySupply;
    mapping(RarityTier => uint256) public rarityMinted;
    
    // Rarity distribution (out of 1000 total)
    mapping(RarityTier => uint256) public rarityLimits;
    
    string private _baseTokenURI;
    uint256 private _nextTokenId = 1;
    
    // Events
    event PassMinted(address indexed to, uint256 indexed tokenId, RarityTier rarity);
    event MetadataUpdated(uint256 indexed tokenId, RarityTier rarity);
    
    constructor(string memory baseURI) ERC721("GUARDIANCHAIN Guardian Pass", "GGP") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        
        // Set rarity distribution
        rarityLimits[RarityTier.Common] = 500;      // 50%
        rarityLimits[RarityTier.Uncommon] = 300;    // 30%
        rarityLimits[RarityTier.Rare] = 150;        // 15%
        rarityLimits[RarityTier.Epic] = 40;         // 4%
        rarityLimits[RarityTier.Legendary] = 10;    // 1%
    }
    
    /**
     * @dev Mint a Guardian Pass to specified address
     * @param to Address to mint the pass to
     * @param rarity Rarity tier of the pass
     */
    function mintPass(address to, RarityTier rarity) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(_nextTokenId <= MAX_SUPPLY, "Max supply reached");
        require(rarityMinted[rarity] < rarityLimits[rarity], "Rarity tier supply exhausted");
        
        uint256 tokenId = _nextTokenId++;
        
        // Set pass metadata based on rarity
        PassMetadata memory metadata = _generateMetadata(rarity);
        passMetadata[tokenId] = metadata;
        
        // Update rarity counts
        rarityMinted[rarity]++;
        
        _safeMint(to, tokenId);
        
        emit PassMinted(to, tokenId, rarity);
    }
    
    /**
     * @dev Batch mint passes to multiple addresses
     * @param recipients Array of recipient addresses
     * @param rarities Array of rarity tiers
     */
    function batchMintPasses(address[] calldata recipients, RarityTier[] calldata rarities) external onlyOwner {
        require(recipients.length == rarities.length, "Arrays length mismatch");
        require(recipients.length <= 50, "Batch size too large");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(_nextTokenId <= MAX_SUPPLY, "Max supply reached");
            require(rarityMinted[rarities[i]] < rarityLimits[rarities[i]], "Rarity tier supply exhausted");
            
            uint256 tokenId = _nextTokenId++;
            
            // Set pass metadata based on rarity
            PassMetadata memory metadata = _generateMetadata(rarities[i]);
            passMetadata[tokenId] = metadata;
            
            // Update rarity counts
            rarityMinted[rarities[i]]++;
            
            _safeMint(recipients[i], tokenId);
            
            emit PassMinted(recipients[i], tokenId, rarities[i]);
        }
    }
    
    /**
     * @dev Mint pass for early verifiers (special function)
     * @param to Address of early verifier
     */
    function mintEarlyVerifierPass(address to) external onlyOwner {
        // Early verifiers get Rare or better
        RarityTier rarity;
        if (rarityMinted[RarityTier.Epic] < rarityLimits[RarityTier.Epic] && _random() % 10 == 0) {
            rarity = RarityTier.Epic;
        } else if (rarityMinted[RarityTier.Rare] < rarityLimits[RarityTier.Rare]) {
            rarity = RarityTier.Rare;
        } else {
            rarity = RarityTier.Uncommon;
        }
        
        require(to != address(0), "Invalid recipient address");
        require(_nextTokenId <= MAX_SUPPLY, "Max supply reached");
        require(rarityMinted[rarity] < rarityLimits[rarity], "Rarity tier supply exhausted");
        
        uint256 tokenId = _nextTokenId++;
        
        // Set pass metadata based on rarity
        PassMetadata memory metadata = _generateMetadata(rarity);
        passMetadata[tokenId] = metadata;
        
        // Update rarity counts
        rarityMinted[rarity]++;
        
        _safeMint(to, tokenId);
        
        emit PassMinted(to, tokenId, rarity);
    }
    
    /**
     * @dev Get pass benefits for a token
     * @param tokenId Token ID to check
     */
    function getPassBenefits(uint256 tokenId) external view returns (
        RarityTier rarity,
        uint256 boostedAPY,
        bool earlyDAOAccess,
        uint256 stakingMultiplier,
        string memory tierName
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        PassMetadata memory metadata = passMetadata[tokenId];
        return (
            metadata.rarity,
            metadata.boostedAPY,
            metadata.earlyDAOAccess,
            metadata.stakingMultiplier,
            metadata.tierName
        );
    }
    
    /**
     * @dev Check if user owns any Guardian Pass
     * @param user Address to check
     */
    function hasGuardianPass(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
    
    /**
     * @dev Get user's highest rarity pass
     * @param user Address to check
     */
    function getHighestRarityPass(address user) external view returns (RarityTier, uint256) {
        uint256 balance = balanceOf(user);
        if (balance == 0) return (RarityTier.Common, 0);
        
        RarityTier highestRarity = RarityTier.Common;
        uint256 bestTokenId = 0;
        
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            RarityTier rarity = passMetadata[tokenId].rarity;
            
            if (rarity >= highestRarity) {
                highestRarity = rarity;
                bestTokenId = tokenId;
            }
        }
        
        return (highestRarity, bestTokenId);
    }
    
    /**
     * @dev Get total supply of each rarity
     */
    function getRaritySupplies() external view returns (uint256[5] memory supplies) {
        supplies[0] = rarityMinted[RarityTier.Common];
        supplies[1] = rarityMinted[RarityTier.Uncommon];
        supplies[2] = rarityMinted[RarityTier.Rare];
        supplies[3] = rarityMinted[RarityTier.Epic];
        supplies[4] = rarityMinted[RarityTier.Legendary];
    }
    
    /**
     * @dev Generate metadata based on rarity tier
     */
    function _generateMetadata(RarityTier rarity) private view returns (PassMetadata memory) {
        if (rarity == RarityTier.Legendary) {
            return PassMetadata({
                rarity: rarity,
                boostedAPY: 2000,        // +20% APY
                earlyDAOAccess: true,
                stakingMultiplier: 20000, // 2x staking rewards
                tierName: "Legendary Guardian",
                mintTime: block.timestamp
            });
        } else if (rarity == RarityTier.Epic) {
            return PassMetadata({
                rarity: rarity,
                boostedAPY: 1000,        // +10% APY
                earlyDAOAccess: true,
                stakingMultiplier: 15000, // 1.5x staking rewards
                tierName: "Epic Guardian",
                mintTime: block.timestamp
            });
        } else if (rarity == RarityTier.Rare) {
            return PassMetadata({
                rarity: rarity,
                boostedAPY: 500,         // +5% APY
                earlyDAOAccess: true,
                stakingMultiplier: 12000, // 1.2x staking rewards
                tierName: "Rare Guardian",
                mintTime: block.timestamp
            });
        } else if (rarity == RarityTier.Uncommon) {
            return PassMetadata({
                rarity: rarity,
                boostedAPY: 250,         // +2.5% APY
                earlyDAOAccess: false,
                stakingMultiplier: 11000, // 1.1x staking rewards
                tierName: "Uncommon Guardian",
                mintTime: block.timestamp
            });
        } else {
            return PassMetadata({
                rarity: rarity,
                boostedAPY: 100,         // +1% APY
                earlyDAOAccess: false,
                stakingMultiplier: 10500, // 1.05x staking rewards
                tierName: "Common Guardian",
                mintTime: block.timestamp
            });
        }
    }
    
    /**
     * @dev Simple pseudo-random number generator
     */
    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _nextTokenId)));
    }
    
    /**
     * @dev Set base URI for token metadata
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Get base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    // Required overrides
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}