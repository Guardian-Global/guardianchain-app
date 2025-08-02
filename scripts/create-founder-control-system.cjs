const fs = require("fs");

function createFounderControlSystem() {
  console.log("👑 CREATING FOUNDER CONTROL SYSTEM");
  console.log("=================================");

  const founderControlContract = `
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
}`;

  const founderDashboard = `
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function FounderControlDashboard() {
    const [gttContract, setGttContract] = useState(null);
    const [stats, setStats] = useState({
        totalSupply: '0',
        founderBalance: '0',
        revenueBalance: '0',
        currentFee: '0',
        totalTransactions: '0'
    });
    
    const [liveTransactions, setLiveTransactions] = useState([]);
    
    useEffect(() => {
        initializeContract();
        const interval = setInterval(updateStats, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);
    
    const initializeContract = async () => {
        if (!window.ethereum) return;
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // GTT Contract ABI and address will be set after deployment
        const gttAddress = "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C";
        const contract = new ethers.Contract(gttAddress, GTT_ABI, signer);
        
        setGttContract(contract);
        
        // Listen for live events
        contract.on("Transfer", (from, to, amount) => {
            const newTransaction = {
                type: 'Transfer',
                from: from.substring(0, 8) + '...',
                to: to.substring(0, 8) + '...',
                amount: ethers.formatEther(amount),
                timestamp: new Date().toLocaleTimeString()
            };
            
            setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
        });
        
        contract.on("RevenueCollected", (from, to, amount) => {
            console.log("Revenue collected:", ethers.formatEther(amount), "GTT");
        });
    };
    
    const updateStats = async () => {
        if (!gttContract) return;
        
        try {
            const tokenStats = await gttContract.getTokenStats();
            const totalRevenue = await gttContract.getTotalRevenue();
            
            setStats({
                totalSupply: ethers.formatEther(tokenStats.totalSupply_),
                founderBalance: ethers.formatEther(tokenStats.founderBalance),
                revenueBalance: ethers.formatEther(totalRevenue),
                currentFee: (tokenStats.currentFee / 100).toString() + '%',
                totalTransactions: liveTransactions.length.toString()
            });
        } catch (error) {
            console.error("Error updating stats:", error);
        }
    };
    
    const withdrawRevenue = async () => {
        if (!gttContract) return;
        
        try {
            const tx = await gttContract.withdrawFounderRevenue();
            await tx.wait();
            alert("Revenue withdrawn successfully!");
            updateStats();
        } catch (error) {
            alert("Error withdrawing revenue: " + error.message);
        }
    };
    
    const updateTransactionFee = async (newFee) => {
        if (!gttContract) return;
        
        try {
            const feeInBasisPoints = Math.floor(newFee * 100);
            const tx = await gttContract.setTransactionFee(feeInBasisPoints);
            await tx.wait();
            alert("Transaction fee updated!");
            updateStats();
        } catch (error) {
            alert("Error updating fee: " + error.message);
        }
    };
    
    return (
        <div className="p-8 bg-gradient-to-br from-purple-900 to-green-900 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8">👑 FOUNDER CONTROL DASHBOARD</h1>
            
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-400">{stats.revenueBalance}</p>
                    <p className="text-sm text-gray-300">GTT Tokens</p>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Your Balance</h3>
                    <p className="text-3xl font-bold text-purple-400">{stats.founderBalance}</p>
                    <p className="text-sm text-gray-300">GTT Tokens</p>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Transaction Fee</h3>
                    <p className="text-3xl font-bold text-blue-400">{stats.currentFee}</p>
                    <p className="text-sm text-gray-300">Per Transaction</p>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Total Supply</h3>
                    <p className="text-3xl font-bold text-yellow-400">{parseFloat(stats.totalSupply).toLocaleString()}</p>
                    <p className="text-sm text-gray-300">GTT Tokens</p>
                </div>
            </div>
            
            {/* Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">💰 Revenue Controls</h3>
                    <button 
                        onClick={withdrawRevenue}
                        className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold mb-4"
                    >
                        Withdraw All Revenue
                    </button>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Set Transaction Fee (%)</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="5" 
                            step="0.1"
                            className="w-full p-2 bg-gray-800 rounded border"
                            onChange={(e) => updateTransactionFee(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">🔒 Emergency Controls</h3>
                    <button className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold mb-2">
                        Emergency Pause Trading
                    </button>
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg font-semibold">
                        Resume Trading
                    </button>
                </div>
            </div>
            
            {/* Live Transaction Feed */}
            <div className="bg-black/30 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">📊 Live Transaction Feed</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {liveTransactions.map((tx, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <span className="text-sm">{tx.timestamp}</span>
                            <span className="text-sm">{tx.from} → {tx.to}</span>
                            <span className="text-sm font-semibold text-green-400">{parseFloat(tx.amount).toFixed(2)} GTT</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}`;

  // Save files
  fs.writeFileSync(
    "contracts/GTTTokenWithFounderControl.sol",
    founderControlContract,
  );
  fs.writeFileSync(
    "client/src/components/FounderControlDashboard.tsx",
    founderDashboard,
  );

  console.log("✅ Founder control system created");
  console.log("📄 Smart contract: contracts/GTTTokenWithFounderControl.sol");
  console.log(
    "🖥️ Dashboard: client/src/components/FounderControlDashboard.tsx",
  );

  return {
    contractPath: "contracts/GTTTokenWithFounderControl.sol",
    dashboardPath: "client/src/components/FounderControlDashboard.tsx",
  };
}

createFounderControlSystem();
