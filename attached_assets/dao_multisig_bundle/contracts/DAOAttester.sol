// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DAOAttester {
    address[] public validators;
    mapping(address => bool) public isValidator;
    mapping(bytes32 => bool) public attested;

    event CapsuleAttested(address indexed validator, bytes32 indexed capsuleId, uint256 timestamp);

    constructor(address[] memory initialValidators) {
        for (uint i = 0; i < initialValidators.length; i++) {
            isValidator[initialValidators[i]] = true;
            validators.push(initialValidators[i]);
        }
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender], "Only validators can attest.");
        _;
    }

    function attestCapsule(bytes32 capsuleId) public onlyValidator {
        require(!attested[capsuleId], "Capsule already attested.");
        attested[capsuleId] = true;
        emit CapsuleAttested(msg.sender, capsuleId, block.timestamp);
    }

    function getValidators() public view returns (address[] memory) {
        return validators;
    }
}
