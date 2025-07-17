// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Guardian Truth Token (GTT)
 * @dev ERC20 token for rewarding truth verification and content creation
 * Only the TruthVault contract can mint new tokens
 */
contract GTTToken is ERC20, Ownable, Pausable {
    address public truthVault;
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion GTT
    
    event TruthVaultSet(address indexed oldVault, address indexed newVault);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    modifier onlyTruthVault() {
        require(msg.sender == truthVault, "GTT: Only TruthVault can call this");
        _;
    }
    
    constructor() ERC20("Guardian Truth Token", "GTT") Ownable(msg.sender) {
    }
    
    /**
     * @dev Set the TruthVault contract address
     * @param _truthVault Address of the TruthVault contract
     */
    function setVault(address _truthVault) external onlyOwner {
        require(_truthVault != address(0), "GTT: TruthVault cannot be zero address");
        address oldVault = truthVault;
        truthVault = _truthVault;
        emit TruthVaultSet(oldVault, _truthVault);
    }
    
    /**
     * @dev Mint GTT tokens for yield rewards
     * Can only be called by the TruthVault contract
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (for transparency)
     */
    function mintYieldReward(
        address to, 
        uint256 amount, 
        string calldata reason
    ) external onlyTruthVault whenNotPaused {
        require(to != address(0), "GTT: Cannot mint to zero address");
        require(amount > 0, "GTT: Amount must be greater than zero");
        require(totalSupply() + amount <= MAX_SUPPLY, "GTT: Would exceed max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Burn tokens from sender's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from specified account (with allowance)
     * @param from Account to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }
    
    /**
     * @dev Pause token transfers (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to respect pause state
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
    
    /**
     * @dev Get remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}