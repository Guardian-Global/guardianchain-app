// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGTTToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract VeritasRegistryDAO is Ownable, ReentrancyGuard {
    IGTTToken public immutable gttToken;
    
    uint256 public minGTTToAttest = 1000 * 10**18; // 1000 GTT minimum
    uint256 public attestationFee = 100 * 10**18; // 100 GTT fee per attestation
    
    mapping(bytes32 => bool) public verifiedHashes;
    mapping(bytes32 => address) public attesters;
    mapping(bytes32 => uint256) public attestationTimestamp;
    mapping(address => uint256) public totalAttestations;
    
    event VeritasAttested(bytes32 indexed hash, address indexed attester, uint256 timestamp);
    event AttestationRevoked(bytes32 indexed hash, address indexed revoker);
    event MinGTTUpdated(uint256 newMinimum);
    event AttestationFeeUpdated(uint256 newFee);
    
    constructor(address _gttToken, address initialOwner) Ownable(initialOwner) {
        gttToken = IGTTToken(_gttToken);
    }
    
    function attestHash(bytes32 hash) external nonReentrant {
        require(!verifiedHashes[hash], "Hash already attested");
        require(gttToken.balanceOf(msg.sender) >= minGTTToAttest, "Insufficient GTT balance");
        
        // Charge attestation fee
        if (attestationFee > 0) {
            gttToken.transferFrom(msg.sender, address(this), attestationFee);
        }
        
        verifiedHashes[hash] = true;
        attesters[hash] = msg.sender;
        attestationTimestamp[hash] = block.timestamp;
        totalAttestations[msg.sender]++;
        
        emit VeritasAttested(hash, msg.sender, block.timestamp);
    }
    
    function batchAttest(bytes32[] calldata hashes) external nonReentrant {
        require(hashes.length > 0, "Empty hash array");
        require(hashes.length <= 50, "Too many hashes"); // Prevent gas issues
        require(gttToken.balanceOf(msg.sender) >= minGTTToAttest, "Insufficient GTT balance");
        
        uint256 totalFee = attestationFee * hashes.length;
        if (totalFee > 0) {
            gttToken.transferFrom(msg.sender, address(this), totalFee);
        }
        
        for (uint256 i = 0; i < hashes.length; i++) {
            bytes32 hash = hashes[i];
            if (!verifiedHashes[hash]) {
                verifiedHashes[hash] = true;
                attesters[hash] = msg.sender;
                attestationTimestamp[hash] = block.timestamp;
                totalAttestations[msg.sender]++;
                
                emit VeritasAttested(hash, msg.sender, block.timestamp);
            }
        }
    }
    
    function revokeAttestation(bytes32 hash) external {
        require(verifiedHashes[hash], "Hash not attested");
        require(
            attesters[hash] == msg.sender || msg.sender == owner(),
            "Not authorized to revoke"
        );
        
        verifiedHashes[hash] = false;
        delete attesters[hash];
        delete attestationTimestamp[hash];
        
        if (totalAttestations[attesters[hash]] > 0) {
            totalAttestations[attesters[hash]]--;
        }
        
        emit AttestationRevoked(hash, msg.sender);
    }
    
    function isVerified(bytes32 hash) external view returns (bool) {
        return verifiedHashes[hash];
    }
    
    function getAttestationInfo(bytes32 hash) external view returns (
        bool verified,
        address attester,
        uint256 timestamp
    ) {
        return (
            verifiedHashes[hash],
            attesters[hash],
            attestationTimestamp[hash]
        );
    }
    
    function setMinGTTToAttest(uint256 newMinimum) external onlyOwner {
        minGTTToAttest = newMinimum;
        emit MinGTTUpdated(newMinimum);
    }
    
    function setAttestationFee(uint256 newFee) external onlyOwner {
        attestationFee = newFee;
        emit AttestationFeeUpdated(newFee);
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = gttToken.balanceOf(address(this));
        if (balance > 0) {
            gttToken.transferFrom(address(this), owner(), balance);
        }
    }
}