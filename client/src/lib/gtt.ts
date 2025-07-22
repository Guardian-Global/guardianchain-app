import { ethers } from 'ethers';

// GTT Token Contract ABI (essential functions)
export const GTT_TOKEN_ABI = [
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function setTaxRate(uint256 bp) external",
  "function setTreasury(address _treasury) external",
  "function setYieldPool(address _yieldPool) external",
  "function setTaxExempt(address account, bool exempt) external",
  "function getContractInfo() external view returns (uint256, uint256, uint256, address, address, uint256, uint256)",
  "function isExemptFromTax(address account) external view returns (bool)",
  "function calculateTax(address from, address to, uint256 amount) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TaxRateChanged(uint256 newRate)",
  "event TreasuryChanged(address indexed oldTreasury, address indexed newTreasury)",
  "event YieldPoolChanged(address indexed oldYieldPool, address indexed newYieldPool)",
  "event TradingTaxCollected(address indexed from, address indexed to, uint256 taxAmount)"
];

export interface GTTContractInfo {
  totalSupply: string;
  maxSupply: string;
  currentTaxRate: number;
  treasury: string;
  yieldPool: string;
  treasuryBalance: string;
  yieldPoolBalance: string;
}

export interface GTTBalance {
  balance: string;
  formattedBalance: string;
  usdValue?: number;
}

/**
 * Get GTT balance for an address
 */
export async function getGTTBalance(
  provider: ethers.Provider,
  tokenAddress: string,
  userAddress: string
): Promise<GTTBalance> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    const formattedBalance = ethers.formatEther(balance);
    
    return {
      balance: balance.toString(),
      formattedBalance,
      usdValue: parseFloat(formattedBalance) * 0.50 // Mock price - replace with real price feed
    };
  } catch (error) {
    console.error('Error getting GTT balance:', error);
    throw error;
  }
}

/**
 * Get GTT contract information
 */
export async function getGTTContractInfo(
  provider: ethers.Provider,
  tokenAddress: string
): Promise<GTTContractInfo> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, provider);
    const [
      totalSupply,
      maxSupply,
      currentTaxRate,
      treasury,
      yieldPool,
      treasuryBalance,
      yieldPoolBalance
    ] = await contract.getContractInfo();
    
    return {
      totalSupply: ethers.formatEther(totalSupply),
      maxSupply: ethers.formatEther(maxSupply),
      currentTaxRate: currentTaxRate.toNumber(),
      treasury,
      yieldPool,
      treasuryBalance: ethers.formatEther(treasuryBalance),
      yieldPoolBalance: ethers.formatEther(yieldPoolBalance)
    };
  } catch (error) {
    console.error('Error getting GTT contract info:', error);
    throw error;
  }
}

/**
 * Transfer GTT tokens
 */
export async function transferGTT(
  signer: ethers.Signer,
  tokenAddress: string,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, signer);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.transfer(to, amountWei);
    return tx;
  } catch (error) {
    console.error('Error transferring GTT:', error);
    throw error;
  }
}

/**
 * Approve GTT spending
 */
export async function approveGTT(
  signer: ethers.Signer,
  tokenAddress: string,
  spender: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, signer);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.approve(spender, amountWei);
    return tx;
  } catch (error) {
    console.error('Error approving GTT:', error);
    throw error;
  }
}

/**
 * Check GTT allowance
 */
export async function getGTTAllowance(
  provider: ethers.Provider,
  tokenAddress: string,
  owner: string,
  spender: string
): Promise<string> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, provider);
    const allowance = await contract.allowance(owner, spender);
    return ethers.formatEther(allowance);
  } catch (error) {
    console.error('Error getting GTT allowance:', error);
    throw error;
  }
}

/**
 * Calculate trading tax for a transaction
 */
export async function calculateTradingTax(
  provider: ethers.Provider,
  tokenAddress: string,
  from: string,
  to: string,
  amount: string
): Promise<string> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, provider);
    const amountWei = ethers.parseEther(amount);
    const tax = await contract.calculateTax(from, to, amountWei);
    return ethers.formatEther(tax);
  } catch (error) {
    console.error('Error calculating trading tax:', error);
    throw error;
  }
}

/**
 * Check if address is tax exempt
 */
export async function isAddressTaxExempt(
  provider: ethers.Provider,
  tokenAddress: string,
  address: string
): Promise<boolean> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, provider);
    return await contract.isExemptFromTax(address);
  } catch (error) {
    console.error('Error checking tax exemption:', error);
    throw error;
  }
}

/**
 * Mint GTT tokens (admin only)
 */
export async function mintGTT(
  signer: ethers.Signer,
  tokenAddress: string,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, signer);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.mint(to, amountWei);
    return tx;
  } catch (error) {
    console.error('Error minting GTT:', error);
    throw error;
  }
}

/**
 * Burn GTT tokens
 */
export async function burnGTT(
  signer: ethers.Signer,
  tokenAddress: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, signer);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.burn(amountWei);
    return tx;
  } catch (error) {
    console.error('Error burning GTT:', error);
    throw error;
  }
}

/**
 * Set trading tax rate (admin only)
 */
export async function setTaxRate(
  signer: ethers.Signer,
  tokenAddress: string,
  basisPoints: number
): Promise<ethers.TransactionResponse> {
  try {
    const contract = new ethers.Contract(tokenAddress, GTT_TOKEN_ABI, signer);
    const tx = await contract.setTaxRate(basisPoints);
    return tx;
  } catch (error) {
    console.error('Error setting tax rate:', error);
    throw error;
  }
}

/**
 * Get current GTT price from authentic sources only
 */
export async function getGTTPrice(): Promise<number | null> {
  try {
    const response = await fetch('/api/token/gtt-data');
    const data = await response.json();
    
    if (data.success && data.data.price !== null) {
      return Number(data.data.price);
    } else {
      console.warn('GTT price not available from authentic sources');
      return null; // Return null instead of fake price
    }
  } catch (error) {
    console.error('Error fetching GTT price:', error);
    return null; // Return null instead of fake price
  }
}

/**
 * Get 24h price change from authentic sources only
 */
export async function getGTTPriceChange24h(): Promise<number | null> {
  try {
    const response = await fetch('/api/token/gtt-data');
    const data = await response.json();
    
    if (data.success && data.data.change24h !== null) {
      return Number(data.data.change24h);
    } else {
      console.warn('GTT price change not available from authentic sources');
      return null; // Return null instead of fake data
    }
  } catch (error) {
    console.error('Error fetching GTT price change:', error);
    return null; // Return null instead of fake data
  }
}

/**
 * Format GTT amount for display
 */
export function formatGTTAmount(amount: string | number, decimals: number = 4): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  return num.toFixed(decimals);
}

/**
 * Parse GTT amount from user input
 */
export function parseGTTAmount(input: string): string {
  try {
    const cleaned = input.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed) || parsed < 0) {
      throw new Error('Invalid amount');
    }
    return parsed.toString();
  } catch (error) {
    throw new Error('Invalid GTT amount format');
  }
}

/**
 * Validate GTT transfer parameters
 */
export function validateGTTTransfer(to: string, amount: string, balance: string): { valid: boolean; error?: string } {
  if (!ethers.isAddress(to)) {
    return { valid: false, error: 'Invalid recipient address' };
  }
  
  try {
    const parsedAmount = parseGTTAmount(amount);
    const parsedBalance = parseFloat(balance);
    
    if (parseFloat(parsedAmount) <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    
    if (parseFloat(parsedAmount) > parsedBalance) {
      return { valid: false, error: 'Insufficient balance' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid amount format' };
  }
}