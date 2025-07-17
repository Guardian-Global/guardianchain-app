// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VeritasCapsuleNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    mapping(uint256 => bool) public isSoulbound;
    mapping(uint256 => uint256) public griefScore;
    mapping(uint256 => string) public vaultScoreLabel;
    mapping(uint256 => string) public verifierSignature;
    mapping(uint256 => uint256) public capsuleId;

    event VeritasSealed(
        address indexed minter,
        uint256 indexed tokenId,
        uint256 indexed capsuleId,
        bool soulbound,
        uint256 grief,
        string vault,
        string sig
    );

    constructor() ERC721("VeritasCapsuleNFT", "VCNFT") Ownable(msg.sender) {}

    function mintVeritasCapsule(
        address to,
        string memory tokenUri,
        uint256 _capsuleId,
        bool soulbound,
        uint256 grief,
        string memory vault,
        string memory sig
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
        
        isSoulbound[tokenId] = soulbound;
        griefScore[tokenId] = grief;
        vaultScoreLabel[tokenId] = vault;
        verifierSignature[tokenId] = sig;
        capsuleId[tokenId] = _capsuleId;

        emit VeritasSealed(to, tokenId, _capsuleId, soulbound, grief, vault, sig);
        return tokenId;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(!isSoulbound[tokenId] || from == address(0), "Soulbound: cannot transfer");
        return super._update(to, tokenId, auth);
    }

    function getTotalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    function getTokenMetadata(uint256 tokenId) public view returns (
        bool _isSoulbound,
        uint256 _griefScore,
        string memory _vaultLabel,
        string memory _signature,
        uint256 _capsuleId
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            isSoulbound[tokenId],
            griefScore[tokenId],
            vaultScoreLabel[tokenId],
            verifierSignature[tokenId],
            capsuleId[tokenId]
        );
    }
}