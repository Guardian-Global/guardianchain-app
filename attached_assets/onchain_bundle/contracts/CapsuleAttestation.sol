// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CapsuleAttestation {
    struct Attestation {
        address validator;
        string capsuleId;
        uint256 griefScore;
        string ipfsHash;
        uint256 timestamp;
    }

    Attestation[] public attestations;

    event CapsuleAttested(address indexed validator, string capsuleId, string ipfsHash, uint256 griefScore);

    function attestCapsule(string memory capsuleId, string memory ipfsHash, uint256 griefScore) public {
        attestations.push(Attestation(msg.sender, capsuleId, griefScore, ipfsHash, block.timestamp));
        emit CapsuleAttested(msg.sender, capsuleId, ipfsHash, griefScore);
    }

    function getAttestationCount() public view returns (uint256) {
        return attestations.length;
    }

    function getAttestation(uint256 index) public view returns (Attestation memory) {
        return attestations[index];
    }
}
