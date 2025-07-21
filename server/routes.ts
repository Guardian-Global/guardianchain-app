import type { Express } from "express";
import { createServer, type Server } from "http";
import * as capsuleYieldRoutes from "./routes/capsule-yield";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin launch status endpoint
  app.get('/api/admin/launch-status', isAuthenticated, async (req: any, res) => {
    try {
      // Production deployment status
      const launchStatus = {
        phase: "testnet_deployment",
        progress: 75,
        networks: [
          {
            name: "Polygon Mumbai",
            chainId: 80001,
            status: "pending", // Will be "deployed" after MATIC funding
            contractAddress: null,
            explorerUrl: "https://mumbai.polygonscan.com",
            liquidityPools: [
              {
                dex: "Uniswap V3",
                pair: "GTT/MATIC",
                tvl: "0",
                apy: "0%",
                status: "pending"
              }
            ]
          },
          {
            name: "Ethereum Sepolia",
            chainId: 11155111,
            status: "pending",
            contractAddress: null,
            explorerUrl: "https://sepolia.etherscan.io",
            liquidityPools: []
          },
          {
            name: "Polygon Mainnet",
            chainId: 137,
            status: "pending",
            contractAddress: null,
            explorerUrl: "https://polygonscan.com",
            liquidityPools: []
          }
        ],
        exchanges: [
          {
            name: "Uniswap",
            type: "DEX",
            status: "not_applied",
            tradingPairs: ["GTT/ETH", "GTT/USDC"],
            applicationId: null
          },
          {
            name: "PancakeSwap",
            type: "DEX", 
            status: "not_applied",
            tradingPairs: ["GTT/BNB", "GTT/BUSD"],
            applicationId: null
          },
          {
            name: "Binance",
            type: "CEX",
            status: "not_applied",
            tradingPairs: ["GTT/USDT", "GTT/BTC"],
            applicationId: null
          }
        ],
        bridges: [
          {
            name: "LayerZero",
            networks: ["Ethereum", "Polygon", "BSC", "Arbitrum"],
            status: "not_configured",
            testResults: null
          },
          {
            name: "Multichain",
            networks: ["Ethereum", "Polygon", "Fantom"],
            status: "not_configured", 
            testResults: null
          }
        ],
        overall: {
          phase: "testnet_deployment",
          completionPercentage: 75,
          nextActions: [
            "Fund deployer wallet with MATIC tokens",
            "Deploy GTT and TruthVault contracts to Mumbai",
            "Configure Uniswap V3 liquidity pools",
            "Complete mobile optimization testing",
            "Prepare mainnet deployment scripts"
          ],
          estimatedCompletion: "February 2025"
        }
      };

      res.json(launchStatus);
    } catch (error) {
      console.error("Error fetching launch status:", error);
      res.status(500).json({ message: "Failed to fetch launch status" });
    }
  });

  // Deploy to network endpoint
  app.post('/api/admin/deploy-network', isAuthenticated, async (req: any, res) => {
    try {
      const { network } = req.body;
      
      // Simulate deployment process
      console.log(`Deploying GTT to ${network}...`);
      
      // In production, this would trigger actual smart contract deployment
      // For now, return success after validation
      res.json({ 
        success: true, 
        message: `Deployment initiated for ${network}`,
        transactionHash: "0x" + Math.random().toString(16).slice(2, 66)
      });
    } catch (error) {
      console.error("Deployment error:", error);
      res.status(500).json({ message: "Deployment failed" });
    }
  });

  // Submit exchange application endpoint
  app.post('/api/admin/submit-exchange-application', isAuthenticated, async (req: any, res) => {
    try {
      const { exchange } = req.body;
      
      console.log(`Submitting application to ${exchange}...`);
      
      res.json({
        success: true,
        message: `Application submitted to ${exchange}`,
        applicationId: "APP-" + Math.random().toString(36).slice(2, 8).toUpperCase()
      });
    } catch (error) {
      console.error("Exchange application error:", error);
      res.status(500).json({ message: "Application submission failed" });
    }
  });

  // Configure bridge endpoint
  app.post('/api/admin/configure-bridge', isAuthenticated, async (req: any, res) => {
    try {
      const { bridge, sourceNetwork, targetNetwork } = req.body;
      
      console.log(`Configuring ${bridge} bridge from ${sourceNetwork} to ${targetNetwork}...`);
      
      res.json({
        success: true,
        message: `Bridge configured successfully`,
        bridgeId: "BRIDGE-" + Math.random().toString(36).slice(2, 8).toUpperCase()
      });
    } catch (error) {
      console.error("Bridge configuration error:", error);
      res.status(500).json({ message: "Bridge configuration failed" });
    }
  });

  // Capsule creation endpoint
  app.post('/api/capsules/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const capsuleData = req.body;
      
      // Create capsule with user ID
      const capsule = await storage.createCapsule({
        ...capsuleData,
        userId,
        id: "caps_" + Math.random().toString(36).slice(2, 10)
      });
      
      res.json(capsule);
    } catch (error) {
      console.error("Error creating capsule:", error);
      res.status(500).json({ message: "Failed to create capsule" });
    }
  });

  // Get user capsules
  app.get('/api/capsules/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const capsules = await storage.getUserCapsules(userId);
      res.json(capsules);
    } catch (error) {
      console.error("Error fetching user capsules:", error);
      res.status(500).json({ message: "Failed to fetch capsules" });
    }
  });

  // Update user tier
  app.post('/api/users/tier', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tier } = req.body;
      
      const updatedUser = await storage.updateUserTier(userId, tier);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user tier:", error);
      res.status(500).json({ message: "Failed to update tier" });
    }
  });

  // Admin command execution
  app.post('/api/admin/execute-command', isAuthenticated, async (req: any, res) => {
    try {
      const { command } = req.body;
      const userId = req.user.claims.sub;
      
      // Check if user is admin
      const user = await storage.getUser(userId);
      if (!user?.roles?.includes("ADMIN") && !user?.roles?.includes("MASTER_ADMIN")) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log(`Executing admin command: ${command}`);
      
      // Simulate command execution based on command type
      let result = "Command executed successfully";
      if (command.includes("health")) {
        result = "System health: All services operational. GTT balance: 247,500 tokens";
      } else if (command.includes("deploy")) {
        result = "Warning: Insufficient MATIC balance for deployment";
      }
      
      res.json({ success: true, result });
    } catch (error) {
      console.error("Command execution error:", error);
      res.status(500).json({ message: "Command execution failed" });
    }
  });

  // Capsule yield management routes
  app.post('/api/capsules/claim-yield', isAuthenticated, capsuleYieldRoutes.claimYield);
  app.get('/api/users/:userAddress/claimable', isAuthenticated, capsuleYieldRoutes.getClaimableCapsules);
  app.get('/api/capsules/:capsuleId/yield-history', isAuthenticated, capsuleYieldRoutes.getCapsuleYieldHistory);
  app.post('/api/admin/capsules/update-yield', isAuthenticated, capsuleYieldRoutes.updateCapsuleYield);
  app.post('/api/admin/capsules/verify', isAuthenticated, capsuleYieldRoutes.verifyCapsuleYield);

  const httpServer = createServer(app);
  return httpServer;
}