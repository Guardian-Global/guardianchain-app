import { ethers } from "ethers";
import { GTTYieldVaultService, CONTRACT_CONFIG } from "./contracts";
import GTT_ABI from "../../abis/GTT.json"; // your contract ABI

// Production GTT Yield Vault configuration
const POLYGON_RPC_URL = CONTRACT_CONFIG.POLYGON_RPC_URL;
const ETH_PRIVATE_KEY =
  process.env.ETH_PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000001";
const GTT_YIELD_VAULT_ADDRESS = CONTRACT_CONFIG.GTT_YIELD_VAULT_ADDRESS;
const GTT_TOKEN_ADDRESS = CONTRACT_CONFIG.GTT_TOKEN_ADDRESS;

let provider: ethers.JsonRpcProvider | null = null;
let signer: ethers.Wallet | null = null;
let contract: ethers.Contract | null = null;

// Initialize Web3 components safely
function initializeWeb3() {
  try {
    if (!provider) {
      provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    }
    if (
      !signer &&
      ETH_PRIVATE_KEY.length === 66 &&
      ETH_PRIVATE_KEY.startsWith("0x")
    ) {
      signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
    }
    if (!contract && signer) {
      contract = new ethers.Contract(GTT_CONTRACT_ADDRESS, GTT_ABI, signer);
    }
    return { provider, signer, contract };
  } catch (error) {
    console.warn(
      "⚠️ Web3 initialization failed (development mode):",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { provider: null, signer: null, contract: null };
  }
}

export async function triggerGTTYield(author: string, griefTier: number) {
  const web3 = initializeWeb3();
  if (!web3.contract) {
    throw new Error(
      "Web3 not properly initialized - missing contract or signer",
    );
  }

  const yieldAmount = griefTier * 10n * 10n ** 18n; // example: 10 GTT per tier
  const tx = await web3.contract.distributeYield(author, yieldAmount);
  await tx.wait();
  return tx.hash;
}

export async function distributeReplayYield(
  authorAddress: string,
  viewerAddress: string,
  capsuleId: string,
  yieldAmount: number,
) {
  const web3 = initializeWeb3();
  if (!web3.contract) {
    throw new Error(
      "Web3 not properly initialized - missing contract or signer",
    );
  }

  try {
    console.log("🔗 Distributing GTT yield for capsule replay:", {
      authorAddress,
      viewerAddress,
      capsuleId,
      yieldAmount,
    });

    // Convert yield amount to Wei (GTT has 18 decimals)
    const yieldAmountWei = ethers.parseEther(yieldAmount.toString());

    // Calculate distribution: 70% to author, 30% to viewer
    const authorShare = (yieldAmountWei * 70n) / 100n;
    const viewerShare = (yieldAmountWei * 30n) / 100n;

    // Distribute to author
    const authorTx = await web3.contract.distributeYield(
      authorAddress,
      authorShare,
    );
    await authorTx.wait();
    console.log("✅ Author yield distributed:", authorTx.hash);

    // Distribute to viewer (replay reward)
    const viewerTx = await web3.contract.distributeYield(
      viewerAddress,
      viewerShare,
    );
    await viewerTx.wait();
    console.log("✅ Viewer yield distributed:", viewerTx.hash);

    return {
      success: true,
      authorTxHash: authorTx.hash,
      viewerTxHash: viewerTx.hash,
      authorShare: ethers.formatEther(authorShare),
      viewerShare: ethers.formatEther(viewerShare),
      totalDistributed: ethers.formatEther(yieldAmountWei),
    };
  } catch (error) {
    console.error("❌ GTT yield distribution failed:", error);
    throw new Error(
      `GTT yield distribution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function calculateGriefYield(
  truthScore: number,
  verificationCount: number,
  capsuleAge: number,
) {
  // Advanced grief score calculation
  const baseYield = 2.5; // Base GTT yield
  const truthMultiplier = Math.max(1, truthScore / 100); // Truth score bonus
  const verificationBonus = Math.min(2, verificationCount * 0.1); // Verification bonus (max 2x)
  const ageBonus = Math.min(
    1.5,
    (capsuleAge / (30 * 24 * 60 * 60 * 1000)) * 0.1,
  ); // Age bonus (max 1.5x)

  const totalYield =
    baseYield * truthMultiplier * (1 + verificationBonus) * (1 + ageBonus);

  return {
    baseYield,
    truthMultiplier,
    verificationBonus,
    ageBonus,
    totalYield: Math.round(totalYield * 100) / 100,
  };
}

export async function getGTTBalance(address: string): Promise<string> {
  const web3 = initializeWeb3();
  if (!web3.contract) {
    console.warn("⚠️ Web3 contract not available, returning mock balance");
    return "125.50"; // Mock balance for development
  }

  try {
    const balance = await web3.contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("❌ Failed to get GTT balance:", error);
    return "0";
  }
}

export async function getContractInfo() {
  const web3 = initializeWeb3();
  if (!web3.contract) {
    console.warn(
      "⚠️ Web3 contract not available, returning mock contract info",
    );
    return {
      name: "GuardianChain Truth Token",
      symbol: "GTT",
      totalSupply: "1000000000",
      decimals: 18,
      contractAddress: GTT_CONTRACT_ADDRESS,
      network: "Polygon",
      status: "development",
    };
  }

  try {
    const name = await web3.contract.name();
    const symbol = await web3.contract.symbol();
    const totalSupply = await web3.contract.totalSupply();
    const decimals = await web3.contract.decimals();

    return {
      name,
      symbol,
      totalSupply: ethers.formatEther(totalSupply),
      decimals: Number(decimals),
      contractAddress: GTT_CONTRACT_ADDRESS,
      network: "Polygon",
      status: "connected",
    };
  } catch (error) {
    console.error("❌ Failed to get contract info:", error);
    return null;
  }
}
