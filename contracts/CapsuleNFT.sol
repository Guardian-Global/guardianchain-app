// CapsuleNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CapsuleNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Capsule metadata structure
    struct CapsuleMetadata {
        string title;
        string content;
        uint256 griefTier;
        uint256 timestamp;
        address author;
        bool isSealed;
        string ipfsHash;
    }

    // Mapping from token ID to capsule metadata
    mapping(uint256 => CapsuleMetadata) public capsules;
    
    // Events
    event CapsuleMinted(uint256 indexed tokenId, address indexed author, string title, uint256 griefTier);
    event CapsuleSealed(uint256 indexed tokenId, string ipfsHash);

    constructor() ERC721("GuardianCapsule", "GCSL") Ownable(msg.sender) {}

    function mint(
        string memory title,
        string memory content,
        uint256 griefTier,
        string memory tokenURI
    ) public returns (uint256) {
        require(griefTier >= 1 && griefTier <= 5, "Invalid grief tier");
        require(bytes(title).length > 0, "Title required");
        require(bytes(content).length > 0, "Content required");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store capsule metadata
        capsules[tokenId] = CapsuleMetadata({
            title: title,
            content: content,
            griefTier: griefTier,
            timestamp: block.timestamp,
            author: msg.sender,
            isSealed: false,
            ipfsHash: ""
        });
        
        emit CapsuleMinted(tokenId, msg.sender, title, griefTier);
        return tokenId;
    }

    function sealCapsule(uint256 tokenId, string memory ipfsHash) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "Not authorized");
        require(!capsules[tokenId].isSealed, "Capsule already sealed");
        
        capsules[tokenId].isSealed = true;
        capsules[tokenId].ipfsHash = ipfsHash;
        
        emit CapsuleSealed(tokenId, ipfsHash);
    }

    function getCapsuleMetadata(uint256 tokenId) public view returns (CapsuleMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return capsules[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}