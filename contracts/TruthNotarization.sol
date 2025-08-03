// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TruthNotarization
 * @dev Smart contract for immutable truth capsule notarization with IPFS anchoring
 */
contract TruthNotarization is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _notarizationIds;
    
    enum NotarizationStatus { 
        PENDING, 
        NOTARIZED, 
        CERTIFIED, 
        LEGAL_GRADE,
        DISPUTED 
    }
    
    enum EvidenceLevel { 
        BASIC, 
        ENHANCED, 
        FORENSIC, 
        LEGAL 
    }
    
    struct NotarizationRecord {
        uint256 id;
        string capsuleId;
        bytes32 contentHash;
        string ipfsHash;
        address submitter;
        uint256 timestamp;
        NotarizationStatus status;
        EvidenceLevel evidenceLevel;
        uint256 witnessCount;
        string[] jurisdictions;
        bytes32 certificateHash;
        bool isPublic;
        uint256 retentionPeriod;
        mapping(address => bool) authorizedViewers;
        mapping(address => bool) witnesses;
    }
    
    struct Certificate {
        uint256 notarizationId;
        bytes32 certificateHash;
        string certificateUri;
        uint256 issuedAt;
        uint256 expiresAt;
        address issuedBy;
        bool isValid;
    }
    
    // Storage
    mapping(uint256 => NotarizationRecord) public notarizations;
    mapping(bytes32 => uint256) public contentHashToId;
    mapping(string => uint256) public capsuleIdToNotarization;
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => uint256[]) public userNotarizations;
    
    // Events
    event NotarizationCreated(
        uint256 indexed id,
        string indexed capsuleId,
        bytes32 indexed contentHash,
        address submitter,
        EvidenceLevel evidenceLevel
    );
    
    event NotarizationStatusUpdated(
        uint256 indexed id,
        NotarizationStatus oldStatus,
        NotarizationStatus newStatus
    );
    
    event CertificateIssued(
        uint256 indexed notarizationId,
        bytes32 indexed certificateHash,
        string certificateUri
    );
    
    event WitnessAdded(
        uint256 indexed notarizationId,
        address indexed witness
    );
    
    event NotarizationDisputed(
        uint256 indexed notarizationId,
        address indexed disputer,
        string reason
    );
    
    // Modifiers
    modifier onlySubmitterOrOwner(uint256 _notarizationId) {
        require(
            notarizations[_notarizationId].submitter == msg.sender || owner() == msg.sender,
            "Not authorized"
        );
        _;
    }
    
    modifier notarizationExists(uint256 _notarizationId) {
        require(_notarizationId <= _notarizationIds.current(), "Notarization does not exist");
        _;
    }
    
    /**
     * @dev Create a new notarization record
     */
    function createNotarization(
        string memory _capsuleId,
        bytes32 _contentHash,
        string memory _ipfsHash,
        EvidenceLevel _evidenceLevel,
        string[] memory _jurisdictions,
        bool _isPublic,
        uint256 _retentionYears
    ) external nonReentrant returns (uint256) {
        require(contentHashToId[_contentHash] == 0, "Content already notarized");
        require(bytes(_capsuleId).length > 0, "Invalid capsule ID");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        
        _notarizationIds.increment();
        uint256 newId = _notarizationIds.current();
        
        NotarizationRecord storage record = notarizations[newId];
        record.id = newId;
        record.capsuleId = _capsuleId;
        record.contentHash = _contentHash;
        record.ipfsHash = _ipfsHash;
        record.submitter = msg.sender;
        record.timestamp = block.timestamp;
        record.status = NotarizationStatus.PENDING;
        record.evidenceLevel = _evidenceLevel;
        record.witnessCount = 0;
        record.jurisdictions = _jurisdictions;
        record.isPublic = _isPublic;
        record.retentionPeriod = _retentionYears * 365 days;
        
        // Auto-upgrade status based on evidence level
        if (_evidenceLevel == EvidenceLevel.BASIC) {
            record.status = NotarizationStatus.NOTARIZED;
        } else if (_evidenceLevel == EvidenceLevel.ENHANCED) {
            record.status = NotarizationStatus.CERTIFIED;
        }
        
        contentHashToId[_contentHash] = newId;
        capsuleIdToNotarization[_capsuleId] = newId;
        userNotarizations[msg.sender].push(newId);
        
        emit NotarizationCreated(newId, _capsuleId, _contentHash, msg.sender, _evidenceLevel);
        
        return newId;
    }
    
    /**
     * @dev Add a witness to a notarization
     */
    function addWitness(uint256 _notarizationId, address _witness) 
        external 
        notarizationExists(_notarizationId)
        onlyOwner 
    {
        NotarizationRecord storage record = notarizations[_notarizationId];
        require(!record.witnesses[_witness], "Already a witness");
        
        record.witnesses[_witness] = true;
        record.witnessCount++;
        
        // Auto-upgrade status based on witness count
        if (record.witnessCount >= 3 && record.status == NotarizationStatus.NOTARIZED) {
            record.status = NotarizationStatus.CERTIFIED;
            emit NotarizationStatusUpdated(_notarizationId, NotarizationStatus.NOTARIZED, NotarizationStatus.CERTIFIED);
        } else if (record.witnessCount >= 7 && record.evidenceLevel == EvidenceLevel.LEGAL) {
            record.status = NotarizationStatus.LEGAL_GRADE;
            emit NotarizationStatusUpdated(_notarizationId, record.status, NotarizationStatus.LEGAL_GRADE);
        }
        
        emit WitnessAdded(_notarizationId, _witness);
    }
    
    /**
     * @dev Issue a certificate for a notarization
     */
    function issueCertificate(
        uint256 _notarizationId,
        string memory _certificateUri,
        uint256 _validityPeriod
    ) external onlyOwner notarizationExists(_notarizationId) {
        NotarizationRecord storage record = notarizations[_notarizationId];
        require(record.status >= NotarizationStatus.NOTARIZED, "Not eligible for certificate");
        
        bytes32 certificateHash = keccak256(
            abi.encodePacked(_notarizationId, _certificateUri, block.timestamp)
        );
        
        Certificate storage cert = certificates[certificateHash];
        cert.notarizationId = _notarizationId;
        cert.certificateHash = certificateHash;
        cert.certificateUri = _certificateUri;
        cert.issuedAt = block.timestamp;
        cert.expiresAt = block.timestamp + _validityPeriod;
        cert.issuedBy = msg.sender;
        cert.isValid = true;
        
        record.certificateHash = certificateHash;
        
        emit CertificateIssued(_notarizationId, certificateHash, _certificateUri);
    }
    
    /**
     * @dev Dispute a notarization
     */
    function disputeNotarization(uint256 _notarizationId, string memory _reason) 
        external 
        notarizationExists(_notarizationId) 
    {
        NotarizationRecord storage record = notarizations[_notarizationId];
        NotarizationStatus oldStatus = record.status;
        record.status = NotarizationStatus.DISPUTED;
        
        emit NotarizationStatusUpdated(_notarizationId, oldStatus, NotarizationStatus.DISPUTED);
        emit NotarizationDisputed(_notarizationId, msg.sender, _reason);
    }
    
    /**
     * @dev Add authorized viewer for private notarizations
     */
    function addAuthorizedViewer(uint256 _notarizationId, address _viewer) 
        external 
        notarizationExists(_notarizationId)
        onlySubmitterOrOwner(_notarizationId) 
    {
        notarizations[_notarizationId].authorizedViewers[_viewer] = true;
    }
    
    /**
     * @dev Verify a certificate's authenticity
     */
    function verifyCertificate(bytes32 _certificateHash) 
        external 
        view 
        returns (bool isValid, uint256 notarizationId, uint256 expiresAt) 
    {
        Certificate memory cert = certificates[_certificateHash];
        return (
            cert.isValid && cert.expiresAt > block.timestamp,
            cert.notarizationId,
            cert.expiresAt
        );
    }
    
    /**
     * @dev Get notarization details (public or authorized access only)
     */
    function getNotarization(uint256 _notarizationId) 
        external 
        view 
        notarizationExists(_notarizationId)
        returns (
            string memory capsuleId,
            bytes32 contentHash,
            string memory ipfsHash,
            address submitter,
            uint256 timestamp,
            NotarizationStatus status,
            EvidenceLevel evidenceLevel,
            uint256 witnessCount,
            bool isPublic
        ) 
    {
        NotarizationRecord storage record = notarizations[_notarizationId];
        
        require(
            record.isPublic || 
            record.submitter == msg.sender || 
            record.authorizedViewers[msg.sender] || 
            owner() == msg.sender,
            "Not authorized to view"
        );
        
        return (
            record.capsuleId,
            record.contentHash,
            record.ipfsHash,
            record.submitter,
            record.timestamp,
            record.status,
            record.evidenceLevel,
            record.witnessCount,
            record.isPublic
        );
    }
    
    /**
     * @dev Get all notarizations for the caller
     */
    function getMyNotarizations() external view returns (uint256[] memory) {
        return userNotarizations[msg.sender];
    }
    
    /**
     * @dev Get public notarizations (for explorer)
     */
    function getPublicNotarizations(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (uint256[] memory ids, uint256 total) 
    {
        uint256 totalCount = _notarizationIds.current();
        uint256[] memory publicIds = new uint256[](_limit);
        uint256 count = 0;
        uint256 processed = 0;
        
        for (uint256 i = 1; i <= totalCount && count < _limit; i++) {
            if (notarizations[i].isPublic) {
                if (processed >= _offset) {
                    publicIds[count] = i;
                    count++;
                }
                processed++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = publicIds[i];
        }
        
        return (result, processed);
    }
    
    /**
     * @dev Emergency functions for owner
     */
    function invalidateCertificate(bytes32 _certificateHash) external onlyOwner {
        certificates[_certificateHash].isValid = false;
    }
    
    function updateNotarizationStatus(uint256 _notarizationId, NotarizationStatus _newStatus) 
        external 
        onlyOwner 
        notarizationExists(_notarizationId) 
    {
        NotarizationStatus oldStatus = notarizations[_notarizationId].status;
        notarizations[_notarizationId].status = _newStatus;
        emit NotarizationStatusUpdated(_notarizationId, oldStatus, _newStatus);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 totalNotarizations,
        uint256 totalCertificates,
        uint256 pendingNotarizations,
        uint256 disputedNotarizations
    ) {
        totalNotarizations = _notarizationIds.current();
        
        // Count certificates, pending, and disputed
        uint256 certCount = 0;
        uint256 pendingCount = 0;
        uint256 disputedCount = 0;
        
        for (uint256 i = 1; i <= totalNotarizations; i++) {
            if (notarizations[i].certificateHash != bytes32(0)) {
                certCount++;
            }
            if (notarizations[i].status == NotarizationStatus.PENDING) {
                pendingCount++;
            }
            if (notarizations[i].status == NotarizationStatus.DISPUTED) {
                disputedCount++;
            }
        }
        
        return (totalNotarizations, certCount, pendingCount, disputedCount);
    }
}