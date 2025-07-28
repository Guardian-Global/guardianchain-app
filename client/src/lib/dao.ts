import { writeContract, readContract } from "@wagmi/core";
import { parseEther } from "viem";
import { BRAND_NAME } from "./constants";

const DAO_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Local deployment

const DAO_ABI = [
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "createProposal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "bool", name: "support", type: "bool" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "proposals",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "votesFor", type: "uint256" },
      { internalType: "uint256", name: "votesAgainst", type: "uint256" },
      { internalType: "bool", name: "executed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function createBrandingProposal(): Promise<string> {
  try {
    const title = `Enforce ${BRAND_NAME} Brand Format Protocol`;
    const description = `This proposal enforces the official brand format for ${BRAND_NAME} across all platform communications, documentation, and smart contracts. The brand name must always be written in all-caps with no spaces: "${BRAND_NAME}". This ensures consistent brand recognition and protocol compliance.

Key requirements:
- All UI elements must display "${BRAND_NAME}" 
- Documentation must use the all-caps format
- Smart contract metadata must reference "${BRAND_NAME}"
- Social media and marketing materials must maintain format consistency
- Color coding: GUARDIAN (#7F5AF0 purple) and CHAIN (#2CB67D green)

This proposal locks in our brand identity at the protocol level and ensures professional presentation across all touchpoints.`;

    const { hash } = await writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: "createProposal",
      args: [title, description],
    });

    return hash;
  } catch (error) {
    console.error("Failed to create branding proposal:", error);
    throw new Error("Failed to create branding proposal");
  }
}

export async function voteOnProposal(
  proposalId: number,
  support: boolean
): Promise<string> {
  try {
    const { hash } = await writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: "vote",
      args: [BigInt(proposalId), support],
    });

    return hash;
  } catch (error) {
    console.error("Failed to vote on proposal:", error);
    throw new Error("Failed to submit vote");
  }
}

export async function getProposal(proposalId: number) {
  try {
    const proposal = await readContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: "proposals",
      args: [BigInt(proposalId)],
    });

    return {
      title: proposal[0],
      description: proposal[1],
      votesFor: Number(proposal[2]),
      votesAgainst: Number(proposal[3]),
      executed: proposal[4],
    };
  } catch (error) {
    console.error("Failed to fetch proposal:", error);
    return null;
  }
}

export interface DAOStats {
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  treasuryBalance: string;
  governanceToken: string;
}

export async function getDAOStats(): Promise<DAOStats> {
  // In a real implementation, this would fetch from multiple contract calls
  return {
    totalProposals: 12,
    activeProposals: 3,
    totalVotes: 1247,
    treasuryBalance: "125000",
    governanceToken: "GTT",
  };
}
