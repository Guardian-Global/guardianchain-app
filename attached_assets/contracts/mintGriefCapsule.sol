// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GriefCapsuleNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public griefScore;
    mapping(uint256 => string) public chainSource;

    constructor() ERC721("GriefCapsule", "GRIEF") {}

    function mintCapsule(address to, string memory tokenURI, uint256 score, string memory origin) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        griefScore[tokenId] = score;
        chainSource[tokenId] = origin;
    }

    function getCapsuleData(uint256 tokenId) external view returns (uint256, string memory) {
        return (griefScore[tokenId], chainSource[tokenId]);
    }
}
