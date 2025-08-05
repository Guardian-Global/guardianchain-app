import type { Express } from "express";
import { GTTYieldVaultService, CONTRACT_CONFIG } from "../web3/contracts";
import { ethers } from "ethers";
import { consolidatedAuth } from "../auth/authConsolidation";

export function registerGTTContractRoutes(app: Express) {
  // User-initiated GTT yield claiming endpoint
  app.post(
    "/api/gtt/vault/claim",
    consolidatedAuth,
    async (req: any, res) => {
      try {
        const { griefTier } = req.body;

        if (!griefTier) {
          return res.status(400).json({
            error: "Missing required field: griefTier",
          });
        }

        // Check if contracts are deployed
        if (
          CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS ===
          "0x0000000000000000000000000000000000000000"
        ) {
          // Development mode - return simulated result
          const simulatedResult = {
            transactionHash: `0x${Math.random().toString(16).slice(2, 15)}`,
            blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
            gasUsed: "45000",
            yieldAmount: (griefTier * 10).toString(),
            status: "simulated_development",
            network: "Polygon",
            timestamp: new Date().toISOString(),
            claimedBy: req.user.id,
          };

          console.log(
            "🔵 DEBUG: GTT Vault yield claimed (development mode):",
            simulatedResult,
          );

          return res.json({
            success: true,
            claim: simulatedResult,
            message: "Yield claimed via development simulation",
          });
        }

        // Production mode - interact with actual smart contract
        const privateKey = process.env.ETH_PRIVATE_KEY;
        if (
          !privateKey ||
          privateKey ===
            "0x0000000000000000000000000000000000000000000000000000000000000001"
        ) {
          return res.status(500).json({
            error: "Private key not configured for production deployment",
          });
        }

        const provider = new ethers.JsonRpcProvider(
          CONTRACT_CONFIG.POLYGON_RPC_URL,
        );
        const yieldVaultService = new GTTYieldVaultService(
          provider,
          privateKey,
        );

        const result = await yieldVaultService.claimYield(griefTier);

        console.log("✅ GTT Vault yield claimed:", result);

        res.json({
          success: true,
          claim: {
            ...result,
            status: "completed",
            network: "Polygon",
            timestamp: new Date().toISOString(),
            claimedBy: req.user.id,
          },
          message: "GTT yield claimed via smart contract",
        });
      } catch (error) {
        console.error("❌ GTT Vault claim failed:", error);
        res.status(500).json({
          error: "Failed to claim GTT yield",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Production GTT yield distribution endpoint
  app.post(
    "/api/gtt/vault/distribute",
    consolidatedAuth,
    async (req: any, res) => {
      try {
        const { authorAddress, griefTier } = req.body;

        if (!authorAddress || !griefTier) {
          return res.status(400).json({
            error: "Missing required fields: authorAddress, griefTier",
          });
        }

        // Check if contracts are deployed
        if (
          CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS ===
          "0x0000000000000000000000000000000000000000"
        ) {
          // Development mode - return simulated result
          const simulatedResult = {
            transactionHash: `0x${Math.random().toString(16).slice(2, 15)}`,
            blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
            gasUsed: "65000",
            yieldAmount: (griefTier * 10).toString(),
            status: "simulated_development",
            network: "Polygon",
            timestamp: new Date().toISOString(),
          };

          console.log(
            "🔵 DEBUG: GTT Vault yield distribution (development mode):",
            simulatedResult,
          );

          return res.json({
            success: true,
            distribution: simulatedResult,
            message: "Yield distributed via development simulation",
          });
        }

        // Production mode - interact with actual smart contract
        const privateKey = process.env.ETH_PRIVATE_KEY;
        if (
          !privateKey ||
          privateKey ===
            "0x0000000000000000000000000000000000000000000000000000000000000001"
        ) {
          return res.status(500).json({
            error: "Private key not configured for production deployment",
          });
        }

        const provider = new ethers.JsonRpcProvider(
          CONTRACT_CONFIG.POLYGON_RPC_URL,
        );
        const yieldVaultService = new GTTYieldVaultService(
          provider,
          privateKey,
        );

        const result = await yieldVaultService.distributeYield(
          authorAddress,
          griefTier,
        );

        console.log("✅ GTT Vault yield distributed:", result);

        res.json({
          success: true,
          distribution: {
            ...result,
            status: "completed",
            network: "Polygon",
            timestamp: new Date().toISOString(),
          },
          message: "GTT yield distributed via smart contract",
        });
      } catch (error) {
        console.error("❌ GTT Vault distribution failed:", error);
        res.status(500).json({
          error: "Failed to distribute GTT yield",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Get GTT Yield Vault contract information
  app.get(
    "/api/gtt/vault/info",
    consolidatedAuth,
    async (req: any, res) => {
      try {
        if (
          CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS ===
          "0x0000000000000000000000000000000000000000"
        ) {
          return res.json({
            success: true,
            contract: {
              yieldVaultAddress: "Not deployed (development mode)",
              gttTokenAddress: "Not deployed (development mode)",
              admin: "Development admin",
              network: "Polygon Testnet",
              status: "development",
            },
          });
        }

        const privateKey = process.env.ETH_PRIVATE_KEY;
        if (!privateKey) {
          return res.status(500).json({
            error: "Private key not configured",
          });
        }

        const provider = new ethers.JsonRpcProvider(
          CONTRACT_CONFIG.POLYGON_RPC_URL,
        );
        const yieldVaultService = new GTTYieldVaultService(
          provider,
          privateKey,
        );

        const contractInfo = await yieldVaultService.getContractInfo();

        res.json({
          success: true,
          contract: {
            ...contractInfo,
            status: "production",
          },
        });
      } catch (error) {
        console.error("❌ Failed to get vault info:", error);
        res.status(500).json({
          error: "Failed to get contract information",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Update vault admin (admin only)
  app.post(
    "/api/gtt/vault/update-admin",
    consolidatedAuth,
    async (req: any, res) => {
      try {
        const { newAdminAddress } = req.body;

        if (!newAdminAddress) {
          return res.status(400).json({
            error: "Missing required field: newAdminAddress",
          });
        }

        if (
          CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS ===
          "0x0000000000000000000000000000000000000000"
        ) {
          return res.json({
            success: true,
            transactionHash: `0x${Math.random().toString(16).slice(2, 15)}`,
            message: "Admin updated (development simulation)",
          });
        }

        const privateKey = process.env.ETH_PRIVATE_KEY;
        if (!privateKey) {
          return res.status(500).json({
            error: "Private key not configured",
          });
        }

        const provider = new ethers.JsonRpcProvider(
          CONTRACT_CONFIG.POLYGON_RPC_URL,
        );
        const yieldVaultService = new GTTYieldVaultService(
          provider,
          privateKey,
        );

        const transactionHash =
          await yieldVaultService.updateAdmin(newAdminAddress);

        res.json({
          success: true,
          transactionHash,
          message: "Vault admin updated successfully",
        });
      } catch (error) {
        console.error("❌ Failed to update admin:", error);
        res.status(500).json({
          error: "Failed to update vault admin",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );
}
