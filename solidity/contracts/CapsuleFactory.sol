// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CapsuleFactory {
    struct Capsule {
        uint256 id;
        string contentHash;
        address creator;
        bool isSealed;
    }

    uint256 public capsuleCounter;
    mapping(uint256 => Capsule) public capsules;

    event CapsuleCreated(uint256 id, address creator);
    event CapsuleSealed(uint256 id);

    function createCapsule(string calldata contentHash) public returns (uint256) {
        capsuleCounter += 1;
        capsules[capsuleCounter] = Capsule(capsuleCounter, contentHash, msg.sender, false);
        emit CapsuleCreated(capsuleCounter, msg.sender);
        return capsuleCounter;
    }

    function sealCapsule(uint256 id) public {
        require(msg.sender == capsules[id].creator, "Not creator");
        capsules[id].isSealed = true;
        emit CapsuleSealed(id);
    }
}