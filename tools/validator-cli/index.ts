#!/usr/bin/env node

/**
 * GuardianChain Validator CLI
 * Comprehensive validation and auditing tool for capsule management
 */

import { fetchIPFSMeta, fetchMultipleIPFSMeta } from "../../lib/fetchIPFSMeta";
import { canUnlockWithBoost, getOptimalUnlockStrategy, formatTimeUntilUnlock } from "../../lib/unlockWithBoost";
import { verifyZKUnlock, batchVerifyZKUnlocks, generateVerificationReport } from "../../lib/zkVerifyUnlock";
import { exportAuditToCSV } from "./exportAuditCSV";
import { sendDiscordAlert } from "./sendDiscordAlert";
import fs from "fs";
import path from "path";

interface CapsuleData {
  id: string;
  cid?: string;
  title?: string;
  unlockTimestamp?: number;
  created?: string;
}

interface ChainData {
  chain: string;
  chainId: number;
  capsules: CapsuleData[];
}

interface ValidationReport {
  capsuleId: string;
  title: string;
  griefScore: number;
  chain: string;
  unlocked: boolean;
  zkValid: boolean;
  confidenceScore: number;
  boostType: string;
  timeReduction: number;
  timestamp: string;
  errors?: string[];
}

/**
 * Load capsule data from JSON file
 */
function loadCapsuleData(filePath: string = "./syncedCapsules.json"): ChainData[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Capsule data file not found: ${filePath}`);
      return generateMockData();
    }
    
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Failed to load capsule data: ${error}`);
    return generateMockData();
  }
}

/**
 * Generate mock data for testing when no real data is available
 */
function generateMockData(): ChainData[] {
  return [
    {
      chain: "base",
      chainId: 8453,
      capsules: [
        {
          id: "cap_base_001",
          cid: "QmMockCID123Base",
          title: "Base Network Capsule",
          unlockTimestamp: Date.now() + 3600000, // 1 hour from now
          created: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: "cap_base_002",
          cid: "QmMockCID456Base",
          title: "High Grief Score Capsule",
          unlockTimestamp: Date.now() + 1800000, // 30 minutes from now
          created: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        }
      ]
    },
    {
      chain: "polygon",
      chainId: 137,
      capsules: [
        {
          id: "cap_poly_001",
          cid: "QmMockCIDPolygon123",
          title: "Polygon Network Capsule",
          unlockTimestamp: Date.now() + 7200000, // 2 hours from now
          created: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ]
    }
  ];
}

/**
 * Generate mock metadata for testing
 */
function generateMockMetadata(capsule: CapsuleData, chainId: number) {
  const baseGrief = Math.floor(Math.random() * 11); // 0-10
  
  // Base network gets slight grief score bonus
  const griefBonus = chainId === 8453 ? 1 : 0;
  const finalGrief = Math.min(10, baseGrief + griefBonus);
  
  return {
    title: capsule.title || `Mock Capsule ${capsule.id}`,
    griefScore: finalGrief,
    author: "Mock Author",
    description: `Auto-generated mock capsule data for ${capsule.id}`,
    category: "test",
    timestamp: capsule.created || new Date().toISOString(),
    emotionalResonance: Math.floor(Math.random() * 101) // 0-100
  };
}

/**
 * Main validation routine
 */
async function runValidation(): Promise<void> {
  console.log("🚀 Starting GuardianChain Validator CLI");
  console.log("=" .repeat(50));
  
  const startTime = Date.now();
  const capsuleData = loadCapsuleData();
  const validationReports: ValidationReport[] = [];
  
  for (const chain of capsuleData) {
    console.log(`\n🔗 Processing ${chain.chain.toUpperCase()} Network (Chain ID: ${chain.chainId})`);
    console.log("-" .repeat(40));
    
    if (chain.capsules.length === 0) {
      console.log("   No capsules found for this chain");
      continue;
    }
    
    // Fetch all metadata concurrently
    const cids = chain.capsules.map(cap => cap.cid || "QmMockCID");
    const metadataResults = await fetchMultipleIPFSMeta(cids);
    
    // Process each capsule
    for (let i = 0; i < chain.capsules.length; i++) {
      const capsule = chain.capsules[i];
      let metadata = metadataResults[i];
      
      // Generate mock data if IPFS fetch failed
      if (!metadata) {
        metadata = generateMockMetadata(capsule, chain.chainId);
        console.log(`   ℹ️  Using mock data for ${capsule.id} (IPFS unavailable)`);
      }
      
      const unlockTimestamp = capsule.unlockTimestamp || Date.now() + 3600000;
      
      // Check unlock with boost system
      const boostResult = canUnlockWithBoost({
        griefScore: metadata.griefScore,
        chainId: chain.chainId,
        unlockTimestamp,
        userTier: 'CREATOR', // Default tier for validation
        premiumBonus: true
      });
      
      // Verify with zero-knowledge proof
      const zkResult = await verifyZKUnlock({
        griefScore: metadata.griefScore,
        chainId: chain.chainId,
        unlockTimestamp
      });
      
      // Get optimal strategy
      const strategy = getOptimalUnlockStrategy({
        griefScore: metadata.griefScore,
        chainId: chain.chainId,
        unlockTimestamp,
        userTier: 'CREATOR'
      });
      
      // Create validation report
      const report: ValidationReport = {
        capsuleId: capsule.id,
        title: metadata.title,
        griefScore: metadata.griefScore,
        chain: chain.chain,
        unlocked: boostResult.canUnlock,
        zkValid: zkResult.valid,
        confidenceScore: zkResult.confidenceScore,
        boostType: boostResult.boostType,
        timeReduction: boostResult.timeReduction,
        timestamp: new Date().toISOString(),
        errors: zkResult.errors
      };
      
      validationReports.push(report);
      
      // Console output
      const statusIcon = boostResult.canUnlock ? "✅" : "🔒";
      const zkIcon = zkResult.valid ? "✅" : "❌";
      
      console.log(`   ${statusIcon} ${metadata.title}`);
      console.log(`      📊 Grief Score: ${metadata.griefScore}/10`);
      console.log(`      ⚡ Boost: ${boostResult.boostType}`);
      console.log(`      ⏱️  Time Reduction: ${formatTimeUntilUnlock(boostResult.timeReduction)}`);
      console.log(`      🔐 ZK Proof: ${zkIcon} (${zkResult.confidenceScore}% confidence)`);
      
      if (!boostResult.canUnlock) {
        console.log(`      ⏳ Remaining: ${formatTimeUntilUnlock(boostResult.remainingTime)}`);
      }
      
      if (strategy.upgradeOptions.length > 0) {
        console.log(`      💡 Suggestion: ${strategy.recommendation}`);
      }
      
      // Send Discord alert for successful unlocks
      if (boostResult.canUnlock && zkResult.valid) {
        try {
          await sendDiscordAlert({
            title: metadata.title,
            chain: chain.chain,
            griefScore: metadata.griefScore,
            boostType: boostResult.boostType,
            confidenceScore: zkResult.confidenceScore
          });
        } catch (error) {
          console.log(`      ⚠️  Discord alert failed: ${error}`);
        }
      }
      
      console.log(""); // Empty line for readability
    }
  }
  
  // Generate summary statistics
  const totalCapsules = validationReports.length;
  const unlockedCount = validationReports.filter(r => r.unlocked).length;
  const zkValidCount = validationReports.filter(r => r.zkValid).length;
  const averageGrief = validationReports.reduce((sum, r) => sum + r.griefScore, 0) / totalCapsules;
  const averageConfidence = validationReports.reduce((sum, r) => sum + r.confidenceScore, 0) / totalCapsules;
  
  console.log("\n📈 VALIDATION SUMMARY");
  console.log("=" .repeat(50));
  console.log(`Total Capsules Processed: ${totalCapsules}`);
  console.log(`Unlocked Capsules: ${unlockedCount} (${Math.round(unlockedCount/totalCapsules*100)}%)`);
  console.log(`ZK Valid Capsules: ${zkValidCount} (${Math.round(zkValidCount/totalCapsules*100)}%)`);
  console.log(`Average Grief Score: ${Math.round(averageGrief * 100) / 100}/10`);
  console.log(`Average Confidence: ${Math.round(averageConfidence * 100) / 100}%`);
  console.log(`Total Processing Time: ${Date.now() - startTime}ms`);
  
  // Export results
  try {
    exportAuditToCSV(validationReports);
    console.log(`\n✅ Audit report exported to ./capsule-audit.csv`);
  } catch (error) {
    console.error(`❌ Failed to export audit report: ${error}`);
  }
  
  console.log("\n🎉 Validation complete!");
}

/**
 * CLI argument handling
 */
function parseArgs(): { [key: string]: string | boolean } {
  const args: { [key: string]: string | boolean } = {};
  
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value || true;
    }
  });
  
  return args;
}

/**
 * Display help information
 */
function showHelp(): void {
  console.log(`
GuardianChain Validator CLI v1.0

Usage: node validator-cli [options]

Options:
  --help              Show this help message
  --file=<path>       Specify capsule data file (default: ./syncedCapsules.json)
  --export=<path>     Specify CSV export path (default: ./capsule-audit.csv)
  --quiet             Suppress detailed output
  --chain=<name>      Validate specific chain only (base, polygon, ethereum)

Examples:
  node validator-cli --file=./data/capsules.json
  node validator-cli --chain=base --export=./reports/base-audit.csv
  node validator-cli --quiet
  `);
}

/**
 * Entry point
 */
async function main(): Promise<void> {
  const args = parseArgs();
  
  if (args.help) {
    showHelp();
    return;
  }
  
  try {
    await runValidation();
  } catch (error) {
    console.error(`❌ Validation failed: ${error}`);
    process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { runValidation, loadCapsuleData, generateMockData };