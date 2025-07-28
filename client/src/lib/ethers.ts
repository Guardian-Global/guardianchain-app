import { useMemo } from "react";
import { useConnectorClient } from "wagmi";
import { type JsonRpcSigner, type BrowserProvider } from "ethers";

// Helper function to convert wagmi provider to ethers provider
export function useEthersProvider() {
  // Get provider from wagmi config
  if (typeof window !== "undefined" && window.ethereum) {
    // Use ethers' BrowserProvider with window.ethereum
    const { BrowserProvider } = require("ethers");
    return new BrowserProvider(window.ethereum);
  }

  // Fallback to null if no provider available
  return null;
}

// Helper function to convert wagmi client to ethers signer
export function useEthersSigner() {
  const { data: client } = useConnectorClient();

  return useMemo(() => {
    if (!client) return null;

    // Convert wagmi client to ethers signer
    try {
      const { BrowserProvider } = require("ethers");
      const provider = new BrowserProvider(client.transport);
      return provider.getSigner();
    } catch (error) {
      console.error("Error creating ethers signer:", error);
      return null;
    }
  }, [client]);
}

// Utility to format ethers addresses
export function formatAddress(
  address: string | undefined,
  length: number = 4
): string {
  if (!address) return "";

  if (address.length <= length * 2 + 2) {
    return address;
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

// Utility to parse ethers amounts safely
export function parseEthersAmount(
  amount: string,
  decimals: number = 18
): string {
  try {
    const { parseUnits } = require("ethers");
    return parseUnits(amount, decimals).toString();
  } catch (error) {
    console.error("Error parsing ethers amount:", error);
    return "0";
  }
}

// Utility to format ethers amounts for display
export function formatEthersAmount(
  amount: string,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  try {
    const { formatUnits } = require("ethers");
    const formatted = formatUnits(amount, decimals);
    const num = parseFloat(formatted);

    if (num === 0) return "0";
    if (num < Math.pow(10, -displayDecimals))
      return `< ${Math.pow(10, -displayDecimals)}`;

    return num.toFixed(displayDecimals);
  } catch (error) {
    console.error("Error formatting ethers amount:", error);
    return "0";
  }
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  try {
    const { isAddress } = require("ethers");
    return isAddress(address);
  } catch (error) {
    return false;
  }
}

// Get transaction receipt with retry logic
export async function getTransactionReceipt(
  provider: any,
  txHash: string,
  maxRetries: number = 5
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, retrying...`);
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(
    `Failed to get transaction receipt after ${maxRetries} attempts`
  );
}

// Contract call with error handling
export async function safeContractCall<T>(
  contractCall: () => Promise<T>,
  fallbackValue: T,
  errorMessage: string = "Contract call failed"
): Promise<T> {
  try {
    return await contractCall();
  } catch (error) {
    console.error(errorMessage, error);
    return fallbackValue;
  }
}

// Gas estimation helper
export async function estimateGasWithBuffer(
  contract: any,
  method: string,
  args: any[],
  bufferPercentage: number = 20
): Promise<bigint> {
  try {
    const gasEstimate = await contract[method].estimateGas(...args);
    const buffer = (gasEstimate * BigInt(bufferPercentage)) / BigInt(100);
    return gasEstimate + buffer;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    // Return a reasonable default gas limit
    return BigInt(500000);
  }
}

// Wait for transaction confirmation
export async function waitForTransaction(
  provider: any,
  txHash: string,
  confirmations: number = 1
): Promise<any> {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      throw new Error("Transaction not found");
    }

    return await tx.wait(confirmations);
  } catch (error) {
    console.error("Error waiting for transaction:", error);
    throw error;
  }
}
