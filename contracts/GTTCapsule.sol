// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GTTCapsule
 * @dev NFT contract for minting GuardianChain Truth Capsules with GTT token burning mechanism
 * Integrates with DAO certification system and lineage tracking
 */
contract GTTCapsule is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    
    // GTT Token contract interface
    IERC20 public immutable gttToken;
    
    // Minting fee structure based on user tiers
    mapping(string => uint256) public tierMintPrices;
    
    // Capsule metadata and certification tracking
    struct CapsuleData {
        string ipfsCID;
        address creator;
        uint256 mintedAt;
        bool verified;
        bool daoCertified;
        string tier;
        uint256 gttBurned;
        bytes32 lineageHash;
    }
    
    mapping(uint256 => CapsuleData) public capsules;
    mapping(bytes32 => uint256) public cidToTokenId;
    
    // DAO certification tracking
    mapping(uint256 => bool) public daoCertifiedCapsules;
    mapping(address => bool) public certificationAuthorities;
    
    // Events
    event CapsuleMinted(
        address indexed user, 
        uint256 indexed tokenId, 
        string ipfsCID, 
        uint256 gttBurned,
        string tier
    );
    
    event CapsuleCertified(
        uint256 indexed tokenId, 
        address indexed certifier, 
        bool verified
    );
    
    event DAOCertificationGranted(
        uint256 indexed tokenId, 
        address indexed authority
    );
    
    event LineageEstablished(
        uint256 indexed parentTokenId,
        uint256 indexed childTokenId,
        bytes32 lineageHash
    );

    constructor(
        address _gttTokenAddress,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        gttToken = IERC20(_gttTokenAddress);
        
        // Initialize tier-based pricing (in GTT tokens with 18 decimals)
        tierMintPrices["explorer"] = 10 * 10**18;  // 10 GTT
        tierMintPrices["seeker"] = 7 * 10**18;     // 7 GTT (30% discount)
        tierMintPrices["creator"] = 5 * 10**18;    // 5 GTT (50% discount)
        tierMintPrices["sovereign"] = 0;           // Free for sovereign tier
    }

    /**
     * @dev Mint a new Truth Capsule NFT by burning GTT tokens
     * @param user Address of the capsule creator
     * @param ipfsCID IPFS content identifier for the capsule data
     * @param tier User's tier level for pricing calculation
     * @param lineageHash Optional hash for establishing capsule lineage
     */
    function mintCapsule(
        address user, 
        string memory ipfsCID, 
        string memory tier,
        bytes32 lineageHash
    ) public nonReentrant returns (uint256) {
        require(bytes(ipfsCID).length > 0, "GTTCapsule: Invalid IPFS CID");
        require(cidToTokenId[keccak256(bytes(ipfsCID))] == 0, "GTTCapsule: Capsule already exists");
        
        uint256 mintPrice = tierMintPrices[tier];
        require(mintPrice > 0 || keccak256(bytes(tier)) == keccak256(bytes("sovereign")), "GTTCapsule: Invalid tier");
        
        // Burn GTT tokens for non-sovereign tiers
        if (mintPrice > 0) {
            require(gttToken.balanceOf(user) >= mintPrice, "GTTCapsule: Insufficient GTT balance");
            require(gttToken.transferFrom(user, address(this), mintPrice), "GTTCapsule: GTT transfer failed");
            
            // Burn the GTT tokens by sending to dead address
            require(gttToken.transfer(address(0xdead), mintPrice), "GTTCapsule: GTT burn failed");
        }
        
        // Mint the NFT
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(user, newTokenId);
        _setTokenURI(newTokenId, string(abi.encodePacked("ipfs://", ipfsCID)));
        
        // Store capsule metadata
        capsules[newTokenId] = CapsuleData({
            ipfsCID: ipfsCID,
            creator: user,
            mintedAt: block.timestamp,
            verified: false,
            daoCertified: false,
            tier: tier,
            gttBurned: mintPrice,
            lineageHash: lineageHash
        });
        
        // Map CID to token ID for uniqueness checks
        cidToTokenId[keccak256(bytes(ipfsCID))] = newTokenId;
        
        emit CapsuleMinted(user, newTokenId, ipfsCID, mintPrice, tier);
        
        return newTokenId;
    }

    /**
     * @dev Certify a capsule as verified (community verification)
     * @param tokenId Token ID of the capsule to certify
     * @param verified Verification status
     */
    function certifyCapsule(uint256 tokenId, bool verified) public {
        require(_exists(tokenId), "GTTCapsule: Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender || certificationAuthorities[msg.sender],
            "GTTCapsule: Not authorized to certify"
        );
        
        capsules[tokenId].verified = verified;
        emit CapsuleCertified(tokenId, msg.sender, verified);
    }

    /**
     * @dev Grant DAO certification to a capsule (requires certification authority)
     * @param tokenId Token ID of the capsule to DAO certify
     */
    function grantDAOCertification(uint256 tokenId) public {
        require(_exists(tokenId), "GTTCapsule: Token does not exist");
        require(certificationAuthorities[msg.sender], "GTTCapsule: Not a certification authority");
        
        capsules[tokenId].daoCertified = true;
        daoCertifiedCapsules[tokenId] = true;
        
        emit DAOCertificationGranted(tokenId, msg.sender);
    }

    /**
     * @dev Establish lineage between parent and child capsules
     * @param parentTokenId Token ID of the parent capsule
     * @param childTokenId Token ID of the child capsule
     * @param lineageHash Hash representing the lineage relationship
     */
    function establishLineage(
        uint256 parentTokenId,
        uint256 childTokenId,
        bytes32 lineageHash
    ) public {
        require(_exists(parentTokenId), "GTTCapsule: Parent token does not exist");
        require(_exists(childTokenId), "GTTCapsule: Child token does not exist");
        require(
            ownerOf(childTokenId) == msg.sender || certificationAuthorities[msg.sender],
            "GTTCapsule: Not authorized to establish lineage"
        );
        
        capsules[childTokenId].lineageHash = lineageHash;
        
        emit LineageEstablished(parentTokenId, childTokenId, lineageHash);
    }

    /**
     * @dev Add or remove certification authority
     * @param authority Address to grant/revoke certification rights
     * @param authorized Whether to grant or revoke authorization
     */
    function setCertificationAuthority(address authority, bool authorized) public onlyOwner {
        certificationAuthorities[authority] = authorized;
    }

    /**
     * @dev Update tier pricing (only owner)
     * @param tier Tier name
     * @param price New price in GTT tokens (with 18 decimals)
     */
    function updateTierPrice(string memory tier, uint256 price) public onlyOwner {
        tierMintPrices[tier] = price;
    }

    /**
     * @dev Get capsule data for a given token ID
     * @param tokenId Token ID to query
     * @return CapsuleData struct containing all capsule information
     */
    function getCapsuleData(uint256 tokenId) public view returns (CapsuleData memory) {
        require(_exists(tokenId), "GTTCapsule: Token does not exist");
        return capsules[tokenId];
    }

    /**
     * @dev Check if a capsule exists for a given IPFS CID
     * @param ipfsCID IPFS content identifier to check
     * @return tokenId Token ID if exists, 0 if not
     */
    function getCapsuleByIPFS(string memory ipfsCID) public view returns (uint256) {
        return cidToTokenId[keccak256(bytes(ipfsCID))];
    }

    /**
     * @dev Get total number of minted capsules
     * @return Total supply of capsules
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Emergency withdrawal of accidentally sent tokens (only owner)
     * @param token Token contract address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) public onlyOwner {
        require(token != address(gttToken), "GTTCapsule: Cannot withdraw GTT");
        IERC20(token).transfer(owner(), amount);
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        
        // Clean up mappings
        string memory ipfsCID = capsules[tokenId].ipfsCID;
        delete cidToTokenId[keccak256(bytes(ipfsCID))];
        delete capsules[tokenId];
        delete daoCertifiedCapsules[tokenId];
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}