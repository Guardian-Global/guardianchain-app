import { Router } from "express";
import { ethers } from "ethers";
import { isDebugAuthenticated } from "../debugAuth";

const router = Router();

interface WalletVerificationRequest {
  walletAddress: string;
  message: string;
  signature: string;
  nonce: string;
}

/**
 * Verify wallet signature and link to user account
 */
router.post("/verify-wallet", isDebugAuthenticated, async (req: any, res) => {
  try {
    const { walletAddress, message, signature, nonce }: WalletVerificationRequest = req.body;
    
    console.log("🔐 Wallet verification requested:", { walletAddress, nonce });

    // Validate input
    if (!walletAddress || !message || !signature || !nonce) {
      return res.status(400).json({ 
        error: "Missing required fields: walletAddress, message, signature, nonce" 
      });
    }

    // Verify wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address format" 
      });
    }

    // Verify the signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      console.log("🔍 Signature verification:", { 
        provided: walletAddress.toLowerCase(), 
        recovered: recoveredAddress.toLowerCase() 
      });

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({ 
          error: "Signature verification failed: address mismatch" 
        });
      }
    } catch (signatureError) {
      console.error("❌ Signature verification error:", signatureError);
      return res.status(401).json({ 
        error: "Invalid signature format or verification failed" 
      });
    }

    // Verify message format and nonce
    if (!message.includes(walletAddress) || !message.includes(nonce)) {
      return res.status(401).json({ 
        error: "Message verification failed: invalid format" 
      });
    }

    // Check timestamp to prevent replay attacks (optional)
    const timestampMatch = message.match(/Timestamp: (.+)/);
    if (timestampMatch) {
      const messageTime = new Date(timestampMatch[1]);
      const now = new Date();
      const timeDiff = now.getTime() - messageTime.getTime();
      
      // Message should be signed within last 10 minutes
      if (timeDiff > 10 * 60 * 1000) {
        return res.status(401).json({ 
          error: "Message expired: please sign a new message" 
        });
      }
    }

    // In production, you would:
    // 1. Store the verified wallet address in the database
    // 2. Link it to the current user account
    // 3. Update user's verification status

    console.log("✅ Wallet verification successful:", walletAddress);

    // For debug mode, we'll simulate success
    const userId = req.user.id;
    
    // Mock database update - in production, use actual database
    console.log(`🔗 Linking wallet ${walletAddress} to user ${userId}`);

    res.json({
      success: true,
      message: "Wallet verified and linked successfully",
      walletAddress: walletAddress.toLowerCase(),
      userId,
      verificationTimestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Wallet verification error:", error);
    res.status(500).json({ 
      error: "Internal server error during wallet verification" 
    });
  }
});

/**
 * Get GTT token balances across multiple chains
 */
router.get("/balances/:address", isDebugAuthenticated, async (req: any, res) => {
  try {
    const { address } = req.params;
    
    console.log("💰 GTT balance requested for:", address);

    // Validate address
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Mock multi-chain GTT balances - in production, query actual contracts
    const mockBalances = {
      137: "1,250.75", // Polygon
      8453: "3,847.25", // Base  
      1: "500.00", // Ethereum
    };

    // Calculate total balance
    const totalBalance = Object.values(mockBalances)
      .reduce((sum, balance) => sum + parseFloat(balance.replace(",", "")), 0);

    console.log("💰 GTT balances:", mockBalances, "Total:", totalBalance);

    res.json({
      address: address.toLowerCase(),
      balances: mockBalances,
      totalBalance: totalBalance.toFixed(2),
      lastUpdated: new Date().toISOString(),
      chainData: {
        137: { name: "Polygon", symbol: "MATIC", rpc: "https://polygon-rpc.com" },
        8453: { name: "Base", symbol: "ETH", rpc: "https://mainnet.base.org" },
        1: { name: "Ethereum", symbol: "ETH", rpc: "https://mainnet.infura.io" },
      }
    });

  } catch (error) {
    console.error("❌ Balance fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch GTT balances" 
    });
  }
});

/**
 * Get wallet verification status
 */
router.get("/status/:address", isDebugAuthenticated, async (req: any, res) => {
  try {
    const { address } = req.params;
    const userId = req.user.id;
    
    console.log("🔍 Wallet status check:", { address, userId });

    // Validate address
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Mock verification status - in production, check database
    const isVerified = true; // Debug mode always returns verified
    const linkedAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    res.json({
      address: address.toLowerCase(),
      userId,
      isVerified,
      linkedAt: linkedAt.toISOString(),
      verificationMethod: "signature",
      lastActivity: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Wallet status error:", error);
    res.status(500).json({ 
      error: "Failed to get wallet status" 
    });
  }
});

/**
 * Unlink wallet from user account
 */
router.delete("/unlink/:address", isDebugAuthenticated, async (req: any, res) => {
  try {
    const { address } = req.params;
    const userId = req.user.id;
    
    console.log("🔓 Wallet unlink requested:", { address, userId });

    // Validate address
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // In production, remove wallet link from database
    console.log(`🔓 Unlinking wallet ${address} from user ${userId}`);

    res.json({
      success: true,
      message: "Wallet unlinked successfully",
      address: address.toLowerCase(),
      userId,
      unlinkedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Wallet unlink error:", error);
    res.status(500).json({ 
      error: "Failed to unlink wallet" 
    });
  }
});

export default router;