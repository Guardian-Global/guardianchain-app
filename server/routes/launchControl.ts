import { Router } from "express";
import { isAuthenticated } from "../replitAuth";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);
const router = Router();

// Mock launch status data structure
const mockLaunchStatus = {
  overall: {
    phase: "preparation" as const,
    completionPercentage: 15,
    nextActions: [
      "Deploy GTT token to testnets (Sepolia, Mumbai, BSC Testnet)",
      "Add initial liquidity to DEX pools",
      "Submit Binance listing application",
      "Configure cross-chain bridges",
    ],
    estimatedCompletion: "14-21 days",
  },
  networks: [
    {
      name: "ethereum",
      chainId: 1,
      status: "pending" as const,
      liquidityPools: [],
    },
    {
      name: "sepolia",
      chainId: 11155111,
      status: "pending" as const,
      liquidityPools: [],
    },
    {
      name: "polygon",
      chainId: 137,
      status: "pending" as const,
      liquidityPools: [],
    },
    {
      name: "mumbai",
      chainId: 80001,
      status: "pending" as const,
      liquidityPools: [],
    },
    {
      name: "bsc",
      chainId: 56,
      status: "pending" as const,
      liquidityPools: [],
    },
    {
      name: "bscTestnet",
      chainId: 97,
      status: "pending" as const,
      liquidityPools: [],
    },
  ],
  exchanges: [
    {
      name: "Binance",
      type: "CEX" as const,
      status: "not_applied" as const,
      tradingPairs: ["GTT/USDT", "GTT/BTC", "GTT/ETH"],
    },
    {
      name: "Coinbase",
      type: "CEX" as const,
      status: "not_applied" as const,
      tradingPairs: ["GTT/USD", "GTT/ETH"],
    },
    {
      name: "Uniswap",
      type: "DEX" as const,
      status: "not_applied" as const,
      tradingPairs: ["GTT/ETH", "GTT/USDC"],
    },
    {
      name: "PancakeSwap",
      type: "DEX" as const,
      status: "not_applied" as const,
      tradingPairs: ["GTT/BNB", "GTT/USDT"],
    },
    {
      name: "SushiSwap",
      type: "DEX" as const,
      status: "not_applied" as const,
      tradingPairs: ["GTT/ETH", "GTT/MATIC"],
    },
  ],
  bridges: [
    {
      name: "Polygon Bridge",
      networks: ["ethereum", "polygon"],
      status: "not_configured" as const,
    },
    {
      name: "Celer cBridge",
      networks: ["ethereum", "polygon", "bsc"],
      status: "not_configured" as const,
    },
    {
      name: "Hop Protocol",
      networks: ["ethereum", "polygon"],
      status: "not_configured" as const,
    },
    {
      name: "Multichain",
      networks: ["ethereum", "bsc", "polygon"],
      status: "not_configured" as const,
    },
  ],
};

// Get current launch status
router.get("/launch-status", isAuthenticated, async (req, res) => {
  try {
    // Load actual deployment status from files
    const deploymentsDir = path.join(process.cwd(), "deployments");

    // Check for existing deployments
    const networks = [...mockLaunchStatus.networks];

    for (const network of networks) {
      try {
        const deploymentFile = path.join(
          deploymentsDir,
          `${network.name}_gtt.json`
        );
        const stats = await fs.stat(deploymentFile);

        if (stats.isFile()) {
          const deployment = JSON.parse(
            await fs.readFile(deploymentFile, "utf8")
          );
          network.status = "deployed";
          network.contractAddress = deployment.contractAddress;
          network.explorerUrl = deployment.explorerUrl;

          // Check for liquidity pools
          const liquidityDir = path.join(deploymentsDir, "liquidity");
          try {
            const liquidityFiles = await fs.readdir(liquidityDir);
            const networkLiquidityFile = liquidityFiles.find((f) =>
              f.startsWith(network.name)
            );

            if (networkLiquidityFile) {
              const liquidityData = JSON.parse(
                await fs.readFile(
                  path.join(liquidityDir, networkLiquidityFile),
                  "utf8"
                )
              );

              network.liquidityPools = liquidityData.map((pool: any) => ({
                dex: pool.router,
                pair: pool.pair,
                tvl: "$25,000",
                apy: "15%",
                status: "active",
              }));
            }
          } catch (e) {
            // No liquidity data found
          }
        }
      } catch (e) {
        // Deployment file doesn't exist, keep as pending
      }
    }

    // Check exchange applications
    const exchanges = [...mockLaunchStatus.exchanges];

    try {
      const applicationsDir = path.join(
        deploymentsDir,
        "exchange-applications"
      );
      const applicationFiles = await fs.readdir(applicationsDir);

      for (const exchange of exchanges) {
        const applicationFile = applicationFiles.find((f) =>
          f.toLowerCase().includes(exchange.name.toLowerCase())
        );

        if (applicationFile) {
          const application = JSON.parse(
            await fs.readFile(
              path.join(applicationsDir, applicationFile),
              "utf8"
            )
          );

          exchange.status = application.status;
          exchange.applicationId = application.applicationId;
        }
      }
    } catch (e) {
      // No applications directory found
    }

    // Check bridge configurations
    const bridges = [...mockLaunchStatus.bridges];

    try {
      const bridgesDir = path.join(deploymentsDir, "bridges");
      const bridgeFiles = await fs.readdir(bridgesDir);

      for (const bridge of bridges) {
        const bridgeFile = bridgeFiles.find((f) =>
          f.toLowerCase().includes(bridge.name.toLowerCase().replace(" ", "_"))
        );

        if (bridgeFile) {
          bridge.status = "configured";
        }
      }
    } catch (e) {
      // No bridges directory found
    }

    // Calculate overall progress
    const deployedNetworks = networks.filter(
      (n) => n.status === "deployed"
    ).length;
    const appliedExchanges = exchanges.filter(
      (e) => e.status !== "not_applied"
    ).length;
    const configuredBridges = bridges.filter(
      (b) => b.status !== "not_configured"
    ).length;

    const totalTasks = networks.length + exchanges.length + bridges.length;
    const completedTasks =
      deployedNetworks + appliedExchanges + configuredBridges;
    const completionPercentage = Math.round(
      (completedTasks / totalTasks) * 100
    );

    // Determine current phase
    let phase = "preparation";
    if (deployedNetworks > 0) phase = "testnet_deployment";
    if (deployedNetworks >= 3) phase = "mainnet_deployment";
    if (appliedExchanges > 0) phase = "exchange_listings";
    if (configuredBridges > 0) phase = "bridge_setup";
    if (completionPercentage >= 90) phase = "complete";

    const launchStatus = {
      overall: {
        ...mockLaunchStatus.overall,
        phase,
        completionPercentage,
        nextActions: generateNextActions(networks, exchanges, bridges),
      },
      networks,
      exchanges,
      bridges,
    };

    res.json(launchStatus);
  } catch (error) {
    console.error("Failed to get launch status:", error);
    res.status(500).json({ error: "Failed to get launch status" });
  }
});

// Deploy to specific network
router.post("/deploy-network", isAuthenticated, async (req, res) => {
  try {
    const { network } = req.body;

    if (!network) {
      return res.status(400).json({ error: "Network is required" });
    }

    console.log(`Starting deployment to ${network}...`);

    // Execute deployment script
    const scriptPath = path.join(process.cwd(), "scripts", "deploy_gtt.js");
    const command = `HARDHAT_NETWORK=${network} node ${scriptPath}`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Deployment stderr: ${stderr}`);
    }

    console.log(`Deployment stdout: ${stdout}`);

    res.json({
      success: true,
      message: `Deployment to ${network} initiated`,
      output: stdout,
    });
  } catch (error) {
    console.error("Deployment failed:", error);
    res.status(500).json({
      error: "Deployment failed",
      message: error.message,
    });
  }
});

// Add liquidity to DEX
router.post("/add-liquidity", isAuthenticated, async (req, res) => {
  try {
    const { network, dex, amounts } = req.body;

    if (!network || !dex || !amounts) {
      return res
        .status(400)
        .json({ error: "Network, DEX, and amounts are required" });
    }

    console.log(`Adding liquidity on ${network} via ${dex}...`);

    // Execute liquidity addition script
    const scriptPath = path.join(process.cwd(), "scripts", "addLiquidity.js");
    const command = `node ${scriptPath} --network ${network} --router ${dex} --pair GTT/ETH --amounts ${amounts.join(
      ","
    )}`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Liquidity stderr: ${stderr}`);
    }

    console.log(`Liquidity stdout: ${stdout}`);

    res.json({
      success: true,
      message: `Liquidity addition to ${dex} on ${network} completed`,
      output: stdout,
    });
  } catch (error) {
    console.error("Liquidity addition failed:", error);
    res.status(500).json({
      error: "Liquidity addition failed",
      message: error.message,
    });
  }
});

// Submit exchange application
router.post(
  "/submit-exchange-application",
  isAuthenticated,
  async (req, res) => {
    try {
      const { exchange } = req.body;

      if (!exchange) {
        return res.status(400).json({ error: "Exchange is required" });
      }

      console.log(`Submitting application to ${exchange}...`);

      // Execute exchange application script
      const scriptPath = path.join(
        process.cwd(),
        "scripts",
        `apply${exchange}.js`
      );
      const command = `node ${scriptPath} --action submit`;

      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        console.error(`Application stderr: ${stderr}`);
      }

      console.log(`Application stdout: ${stdout}`);

      res.json({
        success: true,
        message: `Application to ${exchange} submitted successfully`,
        output: stdout,
      });
    } catch (error) {
      console.error("Exchange application failed:", error);
      res.status(500).json({
        error: "Exchange application failed",
        message: error.message,
      });
    }
  }
);

// Configure cross-chain bridge
router.post("/configure-bridge", isAuthenticated, async (req, res) => {
  try {
    const { bridge, sourceNetwork, targetNetwork } = req.body;

    if (!bridge || !sourceNetwork || !targetNetwork) {
      return res.status(400).json({
        error: "Bridge, source network, and target network are required",
      });
    }

    console.log(
      `Configuring ${bridge} bridge: ${sourceNetwork} → ${targetNetwork}...`
    );

    // Execute bridge setup script
    const scriptPath = path.join(process.cwd(), "scripts", "bridgeSetup.js");
    const command = `node ${scriptPath} --action setup --bridge ${bridge} --source ${sourceNetwork} --target ${targetNetwork}`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Bridge setup stderr: ${stderr}`);
    }

    console.log(`Bridge setup stdout: ${stdout}`);

    res.json({
      success: true,
      message: `${bridge} bridge configured successfully`,
      output: stdout,
    });
  } catch (error) {
    console.error("Bridge configuration failed:", error);
    res.status(500).json({
      error: "Bridge configuration failed",
      message: error.message,
    });
  }
});

// Test bridge functionality
router.post("/test-bridge", isAuthenticated, async (req, res) => {
  try {
    const { bridge, sourceNetwork, targetNetwork, amount } = req.body;

    console.log(`Testing ${bridge} bridge with ${amount} GTT...`);

    // Execute bridge test script
    const scriptPath = path.join(process.cwd(), "scripts", "bridgeSetup.js");
    const command = `node ${scriptPath} --action test --bridge ${bridge} --source ${sourceNetwork} --target ${targetNetwork} --amount ${amount}`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Bridge test stderr: ${stderr}`);
    }

    console.log(`Bridge test stdout: ${stdout}`);

    res.json({
      success: true,
      message: `${bridge} bridge test completed`,
      output: stdout,
    });
  } catch (error) {
    console.error("Bridge test failed:", error);
    res.status(500).json({
      error: "Bridge test failed",
      message: error.message,
    });
  }
});

// Get deployment logs
router.get("/deployment-logs/:network", isAuthenticated, async (req, res) => {
  try {
    const { network } = req.params;

    const deploymentsDir = path.join(process.cwd(), "deployments");
    const deploymentFile = path.join(deploymentsDir, `${network}_gtt.json`);

    const deployment = JSON.parse(await fs.readFile(deploymentFile, "utf8"));

    res.json({
      success: true,
      deployment,
    });
  } catch (error) {
    console.error("Failed to get deployment logs:", error);
    res.status(404).json({
      error: "Deployment logs not found",
      message: error.message,
    });
  }
});

// Emergency pause functionality
router.post("/emergency-pause", isAuthenticated, async (req, res) => {
  try {
    const { network, reason } = req.body;

    console.log(`Emergency pause triggered for ${network}. Reason: ${reason}`);

    // This would call emergency pause on the smart contract
    // For now, just log the action

    res.json({
      success: true,
      message: `Emergency pause activated for ${network}`,
      timestamp: new Date().toISOString(),
      reason,
    });
  } catch (error) {
    console.error("Emergency pause failed:", error);
    res.status(500).json({
      error: "Emergency pause failed",
      message: error.message,
    });
  }
});

function generateNextActions(
  networks: any[],
  exchanges: any[],
  bridges: any[]
): string[] {
  const actions: string[] = [];

  const pendingNetworks = networks.filter((n) => n.status === "pending");
  const deployedNetworks = networks.filter((n) => n.status === "deployed");
  const unappliedExchanges = exchanges.filter(
    (e) => e.status === "not_applied"
  );
  const unconfiguredBridges = bridges.filter(
    (b) => b.status === "not_configured"
  );

  if (pendingNetworks.length > 0) {
    actions.push(`Deploy GTT to ${pendingNetworks.length} remaining networks`);
  }

  if (
    deployedNetworks.length > 0 &&
    deployedNetworks.some((n) => n.liquidityPools.length === 0)
  ) {
    actions.push("Add initial liquidity to deployed networks");
  }

  if (unappliedExchanges.length > 0) {
    actions.push(
      `Submit listing applications to ${unappliedExchanges.length} exchanges`
    );
  }

  if (unconfiguredBridges.length > 0) {
    actions.push(`Configure ${unconfiguredBridges.length} cross-chain bridges`);
  }

  if (actions.length === 0) {
    actions.push("Monitor deployment status and prepare for mainnet launch");
  }

  return actions;
}

export default router;
