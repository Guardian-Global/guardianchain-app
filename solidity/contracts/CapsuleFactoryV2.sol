// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CapsuleFactoryV2 - Core Capsule Creation Engine for GuardianChain
/// @author GUARDIANCHAIN Team
/// @notice Creates, seals, and links yield + authorship for capsule NFTs

contract CapsuleFactoryV2 {
    address public veritusNode;
    uint256 public capsuleCount;

    enum CapsuleStatus { Unsealed, Sealed, Yielded }

    struct Capsule {
        address creator;
        string contentHash; // IPFS, Arweave, etc.
        string storyTitle;
        string storySummary;
        uint256 createdAt;
        uint256 emotionalYield;
        CapsuleStatus status;
    }

    mapping(uint256 => Capsule) public capsules;

    event CapsuleCreated(
        uint256 indexed capsuleId,
        address indexed creator,
        string storyTitle,
        uint256 yield
    );

    event CapsuleSealed(uint256 indexed capsuleId, address sealedBy);
    event YieldAssigned(uint256 indexed capsuleId, uint256 yieldValue);

    modifier onlyVeritus() {
        require(msg.sender == veritusNode, "Only Veritus node");
        _;
    }

    constructor(address _veritusNode) {
        veritusNode = _veritusNode;
    }

    function createCapsule(
        string memory contentHash,
        string memory storyTitle,
        string memory storySummary,
        uint256 yieldEstimate
    ) external {
        capsuleCount++;

        capsules[capsuleCount] = Capsule({
            creator: msg.sender,
            contentHash: contentHash,
            storyTitle: storyTitle,
            storySummary: storySummary,
            createdAt: block.timestamp,
            emotionalYield: yieldEstimate,
            status: CapsuleStatus.Unsealed
        });

        emit CapsuleCreated(capsuleCount, msg.sender, storyTitle, yieldEstimate);
    }

    function sealCapsule(uint256 capsuleId) external onlyVeritus {
        require(capsuleId <= capsuleCount, "Invalid capsule");
        capsules[capsuleId].status = CapsuleStatus.Sealed;
        emit CapsuleSealed(capsuleId, msg.sender);
    }

    function assignYield(uint256 capsuleId, uint256 finalYield) external onlyVeritus {
        require(capsuleId <= capsuleCount, "Invalid capsule");
        capsules[capsuleId].emotionalYield = finalYield;
        capsules[capsuleId].status = CapsuleStatus.Yielded;
        emit YieldAssigned(capsuleId, finalYield);
    }

    function updateVeritus(address newVeritusNode) external onlyVeritus {
        veritusNode = newVeritusNode;
    }

    function getCapsule(uint256 capsuleId) external view returns (Capsule memory) {
        require(capsuleId <= capsuleCount, "Invalid capsule");
        return capsules[capsuleId];
    }
}