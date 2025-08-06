// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGTTToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IVeritasRegistry {
    function isVerified(bytes32 hash) external view returns (bool);
}

contract CapsuleFactory is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    IGTTToken public immutable gttToken;
    IVeritasRegistry public veritasRegistry;
    
    uint256 private _nextTokenId = 1;
    uint256 public mintFee = 500 * 10**18; // 500 GTT to mint
    uint256 public maxSupply = 1000000; // 1M capsules max
    
    struct Capsule {
        bytes32 contentHash;
        address creator;
        uint256 timestamp;
        uint256 griefScore;
        bool isVeritas;
    }
    
    mapping(uint256 => Capsule) public capsules;
    mapping(bytes32 => uint256) public hashToTokenId;
    mapping(address => uint256[]) public creatorCapsules;
    
    event CapsuleMinted(
        uint256 indexed tokenId,
        address indexed creator,
        bytes32 contentHash,
        uint256 griefScore,
        bool isVeritas
    );
    
    constructor(
        address _gttToken,
        address _veritasRegistry,
        address initialOwner
    ) ERC721("GuardianChain Capsule", "GCC") Ownable(initialOwner) {
        gttToken = IGTTToken(_gttToken);
        veritasRegistry = IVeritasRegistry(_veritasRegistry);
    }
    
    function mintCapsule(
        address to,
        string memory tokenURI,
        bytes32 contentHash,
        uint256 griefScore
    ) external nonReentrant returns (uint256) {
        require(_nextTokenId <= maxSupply, "Max supply reached");
        require(hashToTokenId[contentHash] == 0, "Content already minted");
        require(gttToken.balanceOf(msg.sender) >= mintFee, "Insufficient GTT balance");
        
        // Charge minting fee
        gttToken.transferFrom(msg.sender, address(this), mintFee);
        
        uint256 tokenId = _nextTokenId++;
        
        // Check if content is Veritas-verified
        bool isVeritas = veritasRegistry.isVerified(contentHash);
        
        // Store capsule metadata
        capsules[tokenId] = Capsule({
            contentHash: contentHash,
            creator: to,
            timestamp: block.timestamp,
            griefScore: griefScore,
            isVeritas: isVeritas
        });
        
        hashToTokenId[contentHash] = tokenId;
        creatorCapsules[to].push(tokenId);
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit CapsuleMinted(tokenId, to, contentHash, griefScore, isVeritas);
        
        return tokenId;
    }
    
    function batchMint(
        address[] calldata recipients,
        string[] calldata tokenURIs,
        bytes32[] calldata contentHashes,
        uint256[] calldata griefScores
    ) external nonReentrant {
        require(recipients.length == tokenURIs.length, "Array length mismatch");
        require(recipients.length == contentHashes.length, "Array length mismatch");
        require(recipients.length == griefScores.length, "Array length mismatch");
        require(recipients.length <= 20, "Too many tokens"); // Gas limit protection
        
        uint256 totalFee = mintFee * recipients.length;
        require(gttToken.balanceOf(msg.sender) >= totalFee, "Insufficient GTT balance");
        
        gttToken.transferFrom(msg.sender, address(this), totalFee);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(_nextTokenId <= maxSupply, "Max supply reached");
            require(hashToTokenId[contentHashes[i]] == 0, "Content already minted");
            
            uint256 tokenId = _nextTokenId++;
            bool isVeritas = veritasRegistry.isVerified(contentHashes[i]);
            
            capsules[tokenId] = Capsule({
                contentHash: contentHashes[i],
                creator: recipients[i],
                timestamp: block.timestamp,
                griefScore: griefScores[i],
                isVeritas: isVeritas
            });
            
            hashToTokenId[contentHashes[i]] = tokenId;
            creatorCapsules[recipients[i]].push(tokenId);
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            
            emit CapsuleMinted(tokenId, recipients[i], contentHashes[i], griefScores[i], isVeritas);
        }
    }
    
    function getCapsule(uint256 tokenId) external view returns (Capsule memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return capsules[tokenId];
    }
    
    function getCreatorCapsules(address creator) external view returns (uint256[] memory) {
        return creatorCapsules[creator];
    }
    
    function setMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }
    
    function setVeritasRegistry(address newRegistry) external onlyOwner {
        veritasRegistry = IVeritasRegistry(newRegistry);
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = gttToken.balanceOf(address(this));
        if (balance > 0) {
            gttToken.transferFrom(address(this), owner(), balance);
        }
    }
    
    // Override required functions
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