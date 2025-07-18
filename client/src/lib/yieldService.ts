import { parseEther, formatEther } from "viem";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "./contracts";

// Mock yield data for demonstration
const mockYieldData = {
  "1": {
    totalYield: parseEther("12.5"),
    emotionalScore: 85,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 7), // 7 days ago
    yieldHistory: [
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 6), amount: parseEther("1.2") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 5), amount: parseEther("2.1") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 4), amount: parseEther("1.8") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3), amount: parseEther("2.3") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2), amount: parseEther("2.8") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1), amount: parseEther("2.3") },
    ],
    isSealed: true,
  },
  "2": {
    totalYield: parseEther("8.2"),
    emotionalScore: 72,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 5),
    yieldHistory: [
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 4), amount: parseEther("1.5") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3), amount: parseEther("2.2") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2), amount: parseEther("2.1") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1), amount: parseEther("2.4") },
    ],
    isSealed: false,
  },
  "3": {
    totalYield: parseEther("25.7"),
    emotionalScore: 94,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 14),
    yieldHistory: [
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 12), amount: parseEther("2.1") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 10), amount: parseEther("3.5") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 8), amount: parseEther("4.2") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 6), amount: parseEther("5.1") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 4), amount: parseEther("4.8") },
      { timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2), amount: parseEther("6.0") },
    ],
    isSealed: true,
  }
};

export interface YieldData {
  totalYield: bigint;
  emotionalScore: number;
  createdAt: bigint;
  yieldHistory: Array<{ timestamp: bigint; amount: bigint }>;
  isSealed: boolean;
}

export async function getCapsuleYield(capsuleId: string): Promise<YieldData | null> {
  // For now, return mock data. In production, this would query the smart contract
  const data = mockYieldData[capsuleId as keyof typeof mockYieldData];
  
  if (!data) {
    return null;
  }
  
  return data;
}

export function formatYieldAmount(amount: bigint): string {
  return parseFloat(formatEther(amount)).toFixed(4);
}

export function calculateYieldGrowth(history: Array<{ timestamp: bigint; amount: bigint }>): number {
  if (history.length < 2) return 0;
  
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  
  const latestAmount = parseFloat(formatEther(latest.amount));
  const previousAmount = parseFloat(formatEther(previous.amount));
  
  return ((latestAmount - previousAmount) / previousAmount) * 100;
}

export function generateShareMetadata(capsuleId: string, yieldData: YieldData) {
  const totalYieldFormatted = formatYieldAmount(yieldData.totalYield);
  
  return {
    title: `${BRAND_NAME} Capsule #${capsuleId} - ${totalYieldFormatted} GTT Yielded`,
    description: `Track the truth yield and emotional resonance of this verified capsule. Current score: ${yieldData.emotionalScore}/100`,
    image: `/api/og/capsule/${capsuleId}`, // Dynamic OG image endpoint
    url: `${window.location.origin}/capsule/${capsuleId}`,
  };
}

// Constants for the service
export const BRAND_NAME = "GUARDIANCHAIN";