// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TruthVault {
    struct Seal {
        address sealedBy;
        uint256 timestamp;
        string metadataHash;
    }

    mapping(uint256 => Seal) public sealedCapsules;
    event CapsuleSealed(uint256 capsuleId, address indexed sealedBy, string metadataHash);

    function sealCapsule(uint256 capsuleId, string calldata metadataHash) public {
        sealedCapsules[capsuleId] = Seal(msg.sender, block.timestamp, metadataHash);
        emit CapsuleSealed(capsuleId, msg.sender, metadataHash);
    }

    function getSeal(uint256 capsuleId) public view returns (Seal memory) {
        return sealedCapsules[capsuleId];
    }
}