import { ethers } from "ethers";

export const YIELD_VAULT_ABI = [
  "function depositYield(address capsuleOwner, uint256 amount) external",
  "function bulkDepositYield(address[] calldata capsuleOwners, uint256[] calldata amounts) external",
  "function claimYield() external",
  "function getClaimable(address user) public view returns (uint256)",
  "function getUserYieldInfo(address user) external view returns (uint256 totalEarned, uint256 totalWithdrawn, uint256 claimable, uint256 lastDistributionTime)",
  "function getVaultStats() external view returns (uint256 totalEarned, uint256 totalDistributed, uint256 pendingClaims, uint256 vaultBalance, uint256 distributionCount)",
  "function emergencyWithdraw(uint256 amount) external",
  "event YieldDeposited(address indexed capsuleOwner, uint256 amount, uint256 timestamp)",
  "event YieldClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event BulkDistribution(uint256 totalAmount, uint256 recipientCount, uint256 timestamp)",
];

export function getYieldVaultContract(providerOrSigner: any, address: string) {
  return new ethers.Contract(address, YIELD_VAULT_ABI, providerOrSigner);
}

export interface YieldInfo {
  totalEarned: string;
  totalWithdrawn: string;
  claimable: string;
  lastDistributionTime: string;
}

export interface VaultStats {
  totalEarned: string;
  totalDistributed: string;
  pendingClaims: string;
  vaultBalance: string;
  distributionCount: string;
}

export async function getUserYieldInfo(
  contract: ethers.Contract,
  userAddress: string,
): Promise<YieldInfo> {
  try {
    const [totalEarned, totalWithdrawn, claimable, lastDistributionTime] =
      await contract.getUserYieldInfo(userAddress);

    return {
      totalEarned: ethers.formatEther(totalEarned),
      totalWithdrawn: ethers.formatEther(totalWithdrawn),
      claimable: ethers.formatEther(claimable),
      lastDistributionTime: lastDistributionTime.toString(),
    };
  } catch (error) {
    console.error("Error getting user yield info:", error);
    throw error;
  }
}

export async function getVaultStats(
  contract: ethers.Contract,
): Promise<VaultStats> {
  try {
    const [
      totalEarned,
      totalDistributed,
      pendingClaims,
      vaultBalance,
      distributionCount,
    ] = await contract.getVaultStats();

    return {
      totalEarned: ethers.formatEther(totalEarned),
      totalDistributed: ethers.formatEther(totalDistributed),
      pendingClaims: ethers.formatEther(pendingClaims),
      vaultBalance: ethers.formatEther(vaultBalance),
      distributionCount: distributionCount.toString(),
    };
  } catch (error) {
    console.error("Error getting vault stats:", error);
    throw error;
  }
}

export async function claimYield(
  contract: ethers.Contract,
): Promise<ethers.TransactionResponse> {
  try {
    const tx = await contract.claimYield();
    return tx;
  } catch (error) {
    console.error("Error claiming yield:", error);
    throw error;
  }
}

export async function depositYield(
  contract: ethers.Contract,
  capsuleOwner: string,
  amount: string,
): Promise<ethers.TransactionResponse> {
  try {
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.depositYield(capsuleOwner, amountWei);
    return tx;
  } catch (error) {
    console.error("Error depositing yield:", error);
    throw error;
  }
}

export async function bulkDepositYield(
  contract: ethers.Contract,
  capsuleOwners: string[],
  amounts: string[],
): Promise<ethers.TransactionResponse> {
  try {
    const amountsWei = amounts.map((amount) => ethers.parseEther(amount));
    const tx = await contract.bulkDepositYield(capsuleOwners, amountsWei);
    return tx;
  } catch (error) {
    console.error("Error bulk depositing yield:", error);
    throw error;
  }
}
