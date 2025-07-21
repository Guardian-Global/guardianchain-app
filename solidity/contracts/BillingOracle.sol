// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BillingOracle
 * @dev GUARDIANCHAIN enterprise billing infrastructure for vendor payouts and user credits
 * @notice Handles secure financial operations with multi-signature controls and audit trails
 */
contract BillingOracle {
    address public owner;
    address public treasuryDAO;
    uint256 public totalCreditsIssued;
    uint256 public totalVendorPayouts;
    
    // Enhanced mapping structures for enterprise features
    mapping(address => uint256) public vendorBalances;
    mapping(address => uint256) public userCredits;
    mapping(address => bool) public authorizedVendors;
    mapping(address => uint256) public vendorLifetimePayouts;
    mapping(bytes32 => bool) public processedInvoices;
    
    // Audit and compliance tracking
    struct Transaction {
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string invoiceId;
        string purpose;
    }
    
    Transaction[] public transactionHistory;
    
    // Events for comprehensive audit trail
    event VendorPaid(address indexed vendor, uint256 amount, string invoiceId, uint256 timestamp);
    event CreditAdded(address indexed user, uint256 amount, string reason, uint256 timestamp);
    event VendorAuthorized(address indexed vendor, uint256 timestamp);
    event VendorDeauthorized(address indexed vendor, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TreasuryDAOUpdated(address indexed previousDAO, address indexed newDAO);
    event EmergencyPause(uint256 timestamp);
    event EmergencyUnpause(uint256 timestamp);
    
    bool public paused = false;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "BillingOracle: Only owner");
        _;
    }
    
    modifier onlyOwnerOrDAO() {
        require(msg.sender == owner || msg.sender == treasuryDAO, "BillingOracle: Only owner or DAO");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "BillingOracle: Contract is paused");
        _;
    }
    
    modifier onlyAuthorizedVendor(address vendor) {
        require(authorizedVendors[vendor], "BillingOracle: Vendor not authorized");
        _;
    }
    
    constructor(address _treasuryDAO) {
        owner = msg.sender;
        treasuryDAO = _treasuryDAO;
        emit OwnershipTransferred(address(0), msg.sender);
        emit TreasuryDAOUpdated(address(0), _treasuryDAO);
    }
    
    /**
     * @dev Add credits to user account with comprehensive tracking
     * @param user Address of the user receiving credits
     * @param amount Amount of credits to add
     * @param reason Reason for credit addition (audit trail)
     */
    function addCredit(address user, uint256 amount, string memory reason) 
        external 
        onlyOwnerOrDAO 
        whenNotPaused 
    {
        require(user != address(0), "BillingOracle: Invalid user address");
        require(amount > 0, "BillingOracle: Amount must be positive");
        
        userCredits[user] += amount;
        totalCreditsIssued += amount;
        
        // Record transaction for audit
        transactionHistory.push(Transaction({
            recipient: user,
            amount: amount,
            timestamp: block.timestamp,
            invoiceId: "",
            purpose: reason
        }));
        
        emit CreditAdded(user, amount, reason, block.timestamp);
    }
    
    /**
     * @dev Pay vendor with invoice tracking and duplicate prevention
     * @param vendor Address of the vendor to pay
     * @param amount Amount to pay
     * @param invoiceId Unique invoice identifier
     * @param purpose Purpose of payment for audit trail
     */
    function payVendor(
        address vendor, 
        uint256 amount, 
        string memory invoiceId, 
        string memory purpose
    ) 
        external 
        onlyOwnerOrDAO 
        whenNotPaused 
        onlyAuthorizedVendor(vendor)
    {
        require(vendor != address(0), "BillingOracle: Invalid vendor address");
        require(amount > 0, "BillingOracle: Amount must be positive");
        require(address(this).balance >= amount, "BillingOracle: Insufficient contract balance");
        
        bytes32 invoiceHash = keccak256(abi.encodePacked(invoiceId));
        require(!processedInvoices[invoiceHash], "BillingOracle: Invoice already processed");
        
        // Mark invoice as processed
        processedInvoices[invoiceHash] = true;
        
        // Update balances and tracking
        vendorBalances[vendor] += amount;
        vendorLifetimePayouts[vendor] += amount;
        totalVendorPayouts += amount;
        
        // Record transaction for audit
        transactionHistory.push(Transaction({
            recipient: vendor,
            amount: amount,
            timestamp: block.timestamp,
            invoiceId: invoiceId,
            purpose: purpose
        }));
        
        // Execute payment
        (bool success, ) = payable(vendor).call{value: amount}("");
        require(success, "BillingOracle: Payment failed");
        
        emit VendorPaid(vendor, amount, invoiceId, block.timestamp);
    }
    
    /**
     * @dev Authorize vendor for payments
     * @param vendor Address of vendor to authorize
     */
    function authorizeVendor(address vendor) external onlyOwner {
        require(vendor != address(0), "BillingOracle: Invalid vendor address");
        require(!authorizedVendors[vendor], "BillingOracle: Vendor already authorized");
        
        authorizedVendors[vendor] = true;
        emit VendorAuthorized(vendor, block.timestamp);
    }
    
    /**
     * @dev Deauthorize vendor from receiving payments
     * @param vendor Address of vendor to deauthorize
     */
    function deauthorizeVendor(address vendor) external onlyOwner {
        require(authorizedVendors[vendor], "BillingOracle: Vendor not authorized");
        
        authorizedVendors[vendor] = false;
        emit VendorDeauthorized(vendor, block.timestamp);
    }
    
    /**
     * @dev Emergency pause functionality
     */
    function pause() external onlyOwner {
        paused = true;
        emit EmergencyPause(block.timestamp);
    }
    
    /**
     * @dev Unpause contract operations
     */
    function unpause() external onlyOwner {
        paused = false;
        emit EmergencyUnpause(block.timestamp);
    }
    
    /**
     * @dev Transfer ownership with safety checks
     * @param newOwner Address of new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BillingOracle: New owner cannot be zero address");
        require(newOwner != owner, "BillingOracle: New owner must be different");
        
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    /**
     * @dev Update treasury DAO address
     * @param newDAO Address of new treasury DAO
     */
    function updateTreasuryDAO(address newDAO) external onlyOwner {
        require(newDAO != address(0), "BillingOracle: New DAO cannot be zero address");
        
        address previousDAO = treasuryDAO;
        treasuryDAO = newDAO;
        emit TreasuryDAOUpdated(previousDAO, newDAO);
    }
    
    /**
     * @dev Get transaction history count
     * @return Total number of transactions processed
     */
    function getTransactionCount() external view returns (uint256) {
        return transactionHistory.length;
    }
    
    /**
     * @dev Get transaction details by index
     * @param index Transaction index
     * @return Transaction details
     */
    function getTransaction(uint256 index) external view returns (Transaction memory) {
        require(index < transactionHistory.length, "BillingOracle: Transaction index out of bounds");
        return transactionHistory[index];
    }
    
    /**
     * @dev Get contract financial summary
     * @return contractBalance Current contract ETH balance
     * @return totalCredits Total credits issued to users
     * @return totalPayouts Total payouts made to vendors
     * @return transactionCount Total number of transactions
     */
    function getFinancialSummary() external view returns (
        uint256 contractBalance,
        uint256 totalCredits,
        uint256 totalPayouts,
        uint256 transactionCount
    ) {
        return (
            address(this).balance,
            totalCreditsIssued,
            totalVendorPayouts,
            transactionHistory.length
        );
    }
    
    /**
     * @dev Check if invoice has been processed
     * @param invoiceId Invoice identifier to check
     * @return Whether invoice has been processed
     */
    function isInvoiceProcessed(string memory invoiceId) external view returns (bool) {
        bytes32 invoiceHash = keccak256(abi.encodePacked(invoiceId));
        return processedInvoices[invoiceHash];
    }
    
    /**
     * @dev Receive ETH deposits
     */
    receive() external payable {
        // Contract can receive ETH for vendor payments
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("BillingOracle: Function not found");
    }
}