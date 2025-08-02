import { apiRequest } from "@/lib/queryClient";

/**
 * Trigger GTT yield distribution based on grief tier
 * @param authorAddress - Ethereum address of the capsule author
 * @param griefTier - Grief tier level (1-5, higher = more yield)
 * @returns Transaction hash of the yield distribution
 */
export async function triggerGTTYield(authorAddress: string, griefTier: number): Promise<string> {
  try {
    console.log('🔗 Triggering GTT yield distribution:', { authorAddress, griefTier });
    
    const response = await apiRequest("POST", "/api/gtt/distribute-yield", {
      authorAddress,
      griefTier,
      timestamp: new Date().toISOString()
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ GTT yield distribution successful:', result);
      return result.transactionHash;
    } else {
      throw new Error('Failed to distribute GTT yield');
    }
  } catch (error) {
    console.error('❌ GTT yield distribution failed:', error);
    throw error;
  }
}

/**
 * Calculate grief-based yield amount
 * @param truthScore - Truth score of the capsule (0-100)
 * @param verificationCount - Number of verifications
 * @param capsuleAge - Age of capsule in milliseconds
 * @returns Calculated yield details
 */
export async function calculateGriefYield(
  truthScore: number, 
  verificationCount: number, 
  capsuleAge: number
) {
  try {
    const response = await apiRequest("POST", "/api/gtt/calculate-yield", {
      truthScore,
      verificationCount,
      capsuleAge
    });

    if (response.ok) {
      const result = await response.json();
      return result.yieldCalculation;
    } else {
      throw new Error('Failed to calculate grief yield');
    }
  } catch (error) {
    console.error('❌ Grief yield calculation failed:', error);
    throw error;
  }
}

/**
 * Get GTT balance for a wallet address
 * @param address - Ethereum wallet address
 * @returns GTT balance as string
 */
export async function getGTTBalance(address: string): Promise<string> {
  try {
    const response = await apiRequest("GET", `/api/gtt/balance/${address}`);
    
    if (response.ok) {
      const result = await response.json();
      return result.balance;
    } else {
      throw new Error('Failed to get GTT balance');
    }
  } catch (error) {
    console.error('❌ Failed to get GTT balance:', error);
    return "0";
  }
}

/**
 * Get GTT contract information
 * @returns Contract details including name, symbol, total supply
 */
export async function getGTTContractInfo() {
  try {
    const response = await apiRequest("GET", "/api/gtt/contract-info");
    
    if (response.ok) {
      const result = await response.json();
      return result.contract;
    } else {
      throw new Error('Failed to get contract info');
    }
  } catch (error) {
    console.error('❌ Failed to get contract info:', error);
    return null;
  }
}

/**
 * Distribute replay yield between author and viewer
 * @param capsuleId - ID of the capsule being replayed
 * @param authorAddress - Author's wallet address
 * @param viewerAddress - Viewer's wallet address
 * @param yieldAmount - Total yield amount to distribute
 * @returns Distribution result with transaction hashes
 */
export async function distributeReplayYield(
  capsuleId: string,
  authorAddress: string,
  viewerAddress: string,
  yieldAmount: number
) {
  try {
    console.log('🔗 Distributing replay yield:', { capsuleId, authorAddress, viewerAddress, yieldAmount });
    
    const response = await apiRequest("POST", "/api/replay-capsule", {
      capsuleId,
      authorWalletAddress: authorAddress,
      viewerWalletAddress: viewerAddress,
      yieldAmount
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Replay yield distribution successful:', result);
      return result.replay.web3Distribution;
    } else {
      throw new Error('Failed to distribute replay yield');
    }
  } catch (error) {
    console.error('❌ Replay yield distribution failed:', error);
    throw error;
  }
}