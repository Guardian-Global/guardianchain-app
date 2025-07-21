// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleGTTToken
 * @dev GUARDIANCHAIN Truth Token - Simplified ERC20 for Mumbai deployment
 */
contract SimpleGTTToken is ERC20, Ownable, ReentrancyGuard {
    // Token constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million initial
    
    // Yield distribution
    address public yieldPool;
    address public treasury;
    
    // Trading tax (in basis points, 10000 = 100%)
    uint256 public tradingTaxBP = 250; // 2.5% default
    mapping(address => bool) public isTaxExempt;
    
    // User tracking
    mapping(address => uint256) public lastTransactionTime;
    mapping(address => uint256) public totalYieldClaimed;
    
    // Events
    event TradingTaxCollected(address indexed from, address indexed to, uint256 amount);
    event YieldDistributed(address indexed recipient, uint256 amount);
    event TaxExemptionChanged(address indexed account, bool exempt);
    event TradingTaxUpdated(uint256 oldRate, uint256 newRate);
    
    constructor(
        address _treasury,
        address _yieldPool
    ) ERC20("GUARDIANCHAIN Truth Token", "GTT") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");
        require(_yieldPool != address(0), "Invalid yield pool address");
        
        treasury = _treasury;
        yieldPool = _yieldPool;
        
        // Mint initial supply to treasury
        _mint(_treasury, INITIAL_SUPPLY);
        
        // Set tax exemptions
        isTaxExempt[_treasury] = true;
        isTaxExempt[_yieldPool] = true;
        isTaxExempt[msg.sender] = true; // Owner exempt
    }
    
    /**
     * @dev Update trading tax rate (only owner)
     * @param newTaxBP New tax rate in basis points (max 1000 = 10%)
     */
    function setTradingTax(uint256 newTaxBP) external onlyOwner {
        require(newTaxBP <= 1000, "Tax rate too high (max 10%)");
        uint256 oldRate = tradingTaxBP;
        tradingTaxBP = newTaxBP;
        emit TradingTaxUpdated(oldRate, newTaxBP);
    }
    
    /**
     * @dev Set tax exemption status for an account
     * @param account Account to update
     * @param exempt Whether account should be exempt from trading tax
     */
    function setTaxExempt(address account, bool exempt) external onlyOwner {
        require(account != address(0), "Invalid account address");
        isTaxExempt[account] = exempt;
        emit TaxExemptionChanged(account, exempt);
    }
    
    /**
     * @dev Mint new tokens (only owner, respects max supply)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Get contract information
     */
    function getTokenInfo() external view returns (
        uint256 totalSupply_,
        uint256 maxSupply_,
        uint256 tradingTax_,
        address treasury_,
        address yieldPool_
    ) {
        return (
            totalSupply(),
            MAX_SUPPLY,
            tradingTaxBP,
            treasury,
            yieldPool
        );
    }
    
    /**
     * @dev Get user stats
     * @param user Address to check
     */
    function getUserStats(address user) external view returns (
        uint256 balance_,
        uint256 lastTransaction_,
        uint256 totalYield_,
        bool taxExempt_
    ) {
        return (
            balanceOf(user),
            lastTransactionTime[user],
            totalYieldClaimed[user],
            isTaxExempt[user]
        );
    }
    
    /**
     * @dev Distribute yield to user (only yield pool)
     * @param recipient Address to receive yield
     * @param amount Amount of yield to distribute
     */
    function distributeYield(address recipient, uint256 amount) external {
        require(msg.sender == yieldPool, "Only yield pool can distribute");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than zero");
        
        totalYieldClaimed[recipient] += amount;
        _transfer(yieldPool, recipient, amount);
        emit YieldDistributed(recipient, amount);
    }
}