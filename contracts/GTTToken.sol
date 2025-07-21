// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GTTToken - Guardian Truth Token
 * @dev Advanced ERC-20 token with enterprise features for DeFi deployment
 * 
 * Features:
 * - 1 billion total supply
 * - Burn mechanism for deflationary economics
 * - Anti-whale protection with maximum wallet limits
 * - Transaction tax system for protocol sustainability
 * - Pausable for emergency situations
 * - Multi-signature ownership for security
 */
contract GTTToken is ERC20, ERC20Burnable, Pausable, Ownable, ReentrancyGuard {
    
    // Token Economics
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_WALLET_PERCENT = 200; // 2% of total supply
    uint256 public constant TAX_RATE = 500; // 5% transaction tax (in basis points)
    
    // Tax and limits
    uint256 public maxWalletAmount;
    uint256 public taxRate;
    address public taxRecipient;
    
    // Anti-bot protection
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isExcludedFromLimits;
    
    // Trading controls
    bool public tradingActive = false;
    uint256 public tradingActiveBlock;
    mapping(address => bool) public isAutomatedMarketMakerPair;
    
    // Events
    event TradingActivated(uint256 blockNumber);
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxRecipientUpdated(address oldRecipient, address newRecipient);
    event ExcludedFromTax(address account, bool excluded);
    event ExcludedFromLimits(address account, bool excluded);
    event AutomatedMarketMakerPairUpdated(address pair, bool enabled);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 _taxRate,
        uint256 _maxWalletPercent,
        address _owner
    ) ERC20(name, symbol) {
        require(_taxRate <= 1000, "Tax rate cannot exceed 10%");
        require(_maxWalletPercent >= 100, "Max wallet cannot be less than 1%");
        require(_owner != address(0), "Owner cannot be zero address");
        
        // Set initial parameters
        taxRate = _taxRate;
        maxWalletAmount = (totalSupply * _maxWalletPercent) / 10000;
        taxRecipient = _owner;
        
        // Exclude owner and contract from taxes and limits
        isExcludedFromTax[_owner] = true;
        isExcludedFromTax[address(this)] = true;
        isExcludedFromLimits[_owner] = true;
        isExcludedFromLimits[address(this)] = true;
        
        // Mint total supply to owner
        _mint(_owner, totalSupply);
        
        // Transfer ownership
        _transferOwnership(_owner);
        
        emit TaxRateUpdated(0, _taxRate);
        emit TaxRecipientUpdated(address(0), _owner);
    }
    
    /**
     * @dev Override transfer to include tax and anti-whale protection
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Check if trading is active
        if (!tradingActive) {
            require(
                isExcludedFromLimits[from] || isExcludedFromLimits[to],
                "Trading is not active yet"
            );
        }
        
        // Anti-whale protection
        if (!isExcludedFromLimits[to] && to != address(0)) {
            require(
                balanceOf(to) + amount <= maxWalletAmount,
                "Transfer would exceed maximum wallet amount"
            );
        }
        
        // Calculate tax
        uint256 taxAmount = 0;
        if (
            taxRate > 0 &&
            !isExcludedFromTax[from] &&
            !isExcludedFromTax[to] &&
            (isAutomatedMarketMakerPair[from] || isAutomatedMarketMakerPair[to])
        ) {
            taxAmount = (amount * taxRate) / 10000;
        }
        
        // Execute transfer
        if (taxAmount > 0) {
            super._transfer(from, taxRecipient, taxAmount);
            super._transfer(from, to, amount - taxAmount);
        } else {
            super._transfer(from, to, amount);
        }
    }
    
    /**
     * @dev Activate trading - can only be called once
     */
    function activateTrading() external onlyOwner {
        require(!tradingActive, "Trading is already active");
        tradingActive = true;
        tradingActiveBlock = block.number;
        emit TradingActivated(block.number);
    }
    
    /**
     * @dev Update tax rate
     */
    function updateTaxRate(uint256 newTaxRate) external onlyOwner {
        require(newTaxRate <= 1000, "Tax rate cannot exceed 10%");
        uint256 oldRate = taxRate;
        taxRate = newTaxRate;
        emit TaxRateUpdated(oldRate, newTaxRate);
    }
    
    /**
     * @dev Update tax recipient
     */
    function updateTaxRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Tax recipient cannot be zero address");
        address oldRecipient = taxRecipient;
        taxRecipient = newRecipient;
        emit TaxRecipientUpdated(oldRecipient, newRecipient);
    }
    
    /**
     * @dev Exclude/include account from tax
     */
    function excludeFromTax(address account, bool excluded) external onlyOwner {
        isExcludedFromTax[account] = excluded;
        emit ExcludedFromTax(account, excluded);
    }
    
    /**
     * @dev Exclude/include account from limits
     */
    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }
    
    /**
     * @dev Set automated market maker pair
     */
    function setAutomatedMarketMakerPair(address pair, bool enabled) external onlyOwner {
        isAutomatedMarketMakerPair[pair] = enabled;
        emit AutomatedMarketMakerPairUpdated(pair, enabled);
    }
    
    /**
     * @dev Update maximum wallet amount
     */
    function updateMaxWalletAmount(uint256 newMaxWalletPercent) external onlyOwner {
        require(newMaxWalletPercent >= 100, "Max wallet cannot be less than 1%");
        maxWalletAmount = (TOTAL_SUPPLY * newMaxWalletPercent) / 10000;
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override _beforeTokenTransfer to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Emergency token recovery
     */
    function emergencyTokenRecovery(
        address tokenAddress,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(tokenAddress != address(this), "Cannot recover GTT tokens");
        IERC20(tokenAddress).transfer(owner(), amount);
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo() external view returns (
        uint256 _totalSupply,
        uint256 _maxWalletAmount,
        uint256 _taxRate,
        address _taxRecipient,
        bool _tradingActive,
        uint256 _tradingActiveBlock
    ) {
        return (
            TOTAL_SUPPLY,
            maxWalletAmount,
            taxRate,
            taxRecipient,
            tradingActive,
            tradingActiveBlock
        );
    }
}