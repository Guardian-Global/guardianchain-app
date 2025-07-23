// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GTTToken
 * @dev GUARDIANCHAIN Truth Token - Mainnet Launch Version
 */
contract GTTToken is ERC20, Ownable {
    
    constructor() ERC20("GUARDIANCHAIN Truth Token", "GTT") Ownable(msg.sender) {
        // Mint 2.5 billion GTT tokens to deployer
        _mint(msg.sender, 2_500_000_000 * 10**18);
    }
    
    /**
     * @dev Mint additional tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}