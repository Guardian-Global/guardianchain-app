
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GTTToken is ERC20, Ownable, Pausable {
    address public founder;
    address public revenueWallet;
    uint256 public transactionFee = 100; // 1% = 100 basis points
    uint256 public constant MAX_FEE = 500; // 5% maximum
    
    mapping(address => bool) public exemptFromFees;
    mapping(address => uint256) public userInteractions;
    
    event RevenueCollected(address indexed from, address indexed to, uint256 amount);
    event FounderWithdrawal(uint256 amount);
    event UserInteraction(address indexed user, uint256 amount, string interactionType);
    
    modifier onlyFounder() {
        require(msg.sender == founder, "Only founder can call this");
        _;
    }
    
    constructor() ERC20("GuardianChain Truth Token", "GTT") {
        founder = msg.sender;
        revenueWallet = msg.sender;
        
        // 2.5 billion tokens with 18 decimals
        _mint(msg.sender, 2500000000 * 10**18);
        
        // Founder exempt from fees
        exemptFromFees[msg.sender] = true;
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        uint256 fee = 0;
        
        // Calculate fee if not exempt
        if (!exemptFromFees[owner] && !exemptFromFees[to]) {
            fee = (amount * transactionFee) / 10000;
            
            // Send fee to revenue wallet
            if (fee > 0) {
                _transfer(owner, revenueWallet, fee);
                emit RevenueCollected(owner, revenueWallet, fee);
            }
        }
        
        // Track user interaction
        userInteractions[owner]++;
        emit UserInteraction(owner, amount, "transfer");
        
        // Transfer remaining amount
        _transfer(owner, to, amount - fee);
        return true;
    }
    
    // FOUNDER CONTROL FUNCTIONS
    function setTransactionFee(uint256 _fee) external onlyFounder {
        require(_fee <= MAX_FEE, "Fee too high");
        transactionFee = _fee;
    }
    
    function setRevenueWallet(address _wallet) external onlyFounder {
        revenueWallet = _wallet;
    }
    
    function exemptFromFee(address _address, bool _exempt) external onlyFounder {
        exemptFromFees[_address] = _exempt;
    }
    
    function withdrawFounderRevenue() external onlyFounder {
        uint256 balance = balanceOf(revenueWallet);
        require(balance > 0, "No revenue to withdraw");
        
        _transfer(revenueWallet, founder, balance);
        emit FounderWithdrawal(balance);
    }
    
    function emergencyPause() external onlyFounder {
        _pause();
    }
    
    function emergencyUnpause() external onlyFounder {
        _unpause();
    }
    
    // MONITORING FUNCTIONS
    function getTotalRevenue() external view returns (uint256) {
        return balanceOf(revenueWallet);
    }
    
    function getUserInteractionCount(address user) external view returns (uint256) {
        return userInteractions[user];
    }
    
    function getTokenStats() external view returns (
        uint256 totalSupply_,
        uint256 founderBalance,
        uint256 revenueBalance,
        uint256 currentFee
    ) {
        return (
            totalSupply(),
            balanceOf(founder),
            balanceOf(revenueWallet),
            transactionFee
        );
    }
}