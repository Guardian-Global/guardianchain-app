// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GTTToken
 * @dev Guardian Truth Token with automated treasury funding and yield distribution
 */
contract GTTToken is ERC20, Ownable, ReentrancyGuard {
    address public treasury;
    address public yieldPool;
    uint256 public tradingTaxBP = 200; // 2% trading tax (200 basis points)
    
    mapping(address => bool) public isTaxExempt;
    mapping(address => uint256) public lastTransactionTime;
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether; // 1 billion GTT
    uint256 public constant MAX_TAX_RATE = 500; // 5% maximum tax rate
    
    event TaxRateChanged(uint256 newRate);
    event TreasuryChanged(address indexed oldTreasury, address indexed newTreasury);
    event YieldPoolChanged(address indexed oldYieldPool, address indexed newYieldPool);
    event TaxExemptionChanged(address indexed account, bool exempt);
    event TradingTaxCollected(address indexed from, address indexed to, uint256 taxAmount);

    constructor(
        address _treasury, 
        address _yieldPool
    ) ERC20("Guardian Truth Token", "GTT") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");
        require(_yieldPool != address(0), "Invalid yield pool address");
        
        treasury = _treasury;
        yieldPool = _yieldPool;
        
        // Mint initial supply to deployer
        _mint(msg.sender, MAX_SUPPLY);
        
        // Set tax exemptions for core contracts
        isTaxExempt[msg.sender] = true;
        isTaxExempt[_treasury] = true;
        isTaxExempt[_yieldPool] = true;
        
        emit TreasuryChanged(address(0), _treasury);
        emit YieldPoolChanged(address(0), _yieldPool);
    }

    /**
     * @dev Set the trading tax rate (only owner)
     * @param bp Tax rate in basis points (100 = 1%)
     */
    function setTaxRate(uint256 bp) external onlyOwner {
        require(bp <= MAX_TAX_RATE, "Tax rate too high");
        uint256 oldRate = tradingTaxBP;
        tradingTaxBP = bp;
        emit TaxRateChanged(bp);
    }

    /**
     * @dev Update treasury address (only owner)
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        address oldTreasury = treasury;
        treasury = _treasury;
        isTaxExempt[_treasury] = true;
        emit TreasuryChanged(oldTreasury, _treasury);
    }

    /**
     * @dev Update yield pool address (only owner)
     * @param _yieldPool New yield pool address
     */
    function setYieldPool(address _yieldPool) external onlyOwner {
        require(_yieldPool != address(0), "Invalid yield pool address");
        address oldYieldPool = yieldPool;
        yieldPool = _yieldPool;
        isTaxExempt[_yieldPool] = true;
        emit YieldPoolChanged(oldYieldPool, _yieldPool);
    }

    /**
     * @dev Set tax exemption status for an address (only owner)
     * @param account Address to modify
     * @param exempt Whether the address should be exempt from taxes
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
     * @dev Internal transfer function with tax logic
     */
    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        // Update transaction timestamps
        lastTransactionTime[from] = block.timestamp;
        lastTransactionTime[to] = block.timestamp;

        // Apply trading tax if neither party is exempt and tax rate > 0
        if (!isTaxExempt[from] && !isTaxExempt[to] && tradingTaxBP > 0) {
            uint256 taxAmount = (amount * tradingTaxBP) / 10_000;
            uint256 treasuryAmount = taxAmount / 2;
            uint256 yieldAmount = taxAmount - treasuryAmount;
            
            // Transfer tax portions
            super._transfer(from, treasury, treasuryAmount);
            super._transfer(from, yieldPool, yieldAmount);
            
            // Transfer remaining amount
            super._transfer(from, to, amount - taxAmount);
            
            emit TradingTaxCollected(from, to, taxAmount);
        } else {
            // No tax applied
            super._transfer(from, to, amount);
        }
    }

    /**
     * @dev Get contract information
     */
    function getContractInfo() external view returns (
        uint256 totalSupply_,
        uint256 maxSupply,
        uint256 currentTaxRate,
        address treasury_,
        address yieldPool_,
        uint256 treasuryBalance,
        uint256 yieldPoolBalance
    ) {
        totalSupply_ = totalSupply();
        maxSupply = MAX_SUPPLY;
        currentTaxRate = tradingTaxBP;
        treasury_ = treasury;
        yieldPool_ = yieldPool;
        treasuryBalance = balanceOf(treasury);
        yieldPoolBalance = balanceOf(yieldPool);
    }

    /**
     * @dev Check if an address is tax exempt
     */
    function isExemptFromTax(address account) external view returns (bool) {
        return isTaxExempt[account];
    }

    /**
     * @dev Calculate tax amount for a transfer
     */
    function calculateTax(address from, address to, uint256 amount) external view returns (uint256) {
        if (isTaxExempt[from] || isTaxExempt[to] || tradingTaxBP == 0) {
            return 0;
        }
        return (amount * tradingTaxBP) / 10_000;
    }
}