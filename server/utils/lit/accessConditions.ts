import type { AccessControlCondition } from "./encryptCapsule";

// Time-based access control conditions
export function createTimeBasedCondition(
  unlockTimestamp: number,
): AccessControlCondition[] {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "polygon",
      method: "eth_getBlockByNumber",
      parameters: ["latest", false],
      returnValueTest: {
        comparator: ">=",
        value: unlockTimestamp.toString(),
      },
    },
  ];
}

// NFT ownership access control
export function createNFTOwnershipCondition(
  contractAddress: string,
  tokenId?: string,
): AccessControlCondition[] {
  return [
    {
      contractAddress,
      standardContractType: "ERC721",
      chain: "polygon",
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
}

// Token balance access control
export function createTokenBalanceCondition(
  contractAddress: string,
  minimumBalance: string,
): AccessControlCondition[] {
  return [
    {
      contractAddress,
      standardContractType: "ERC20",
      chain: "polygon",
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">=",
        value: minimumBalance,
      },
    },
  ];
}

// Wallet address whitelist
export function createWalletWhitelistCondition(
  allowedAddresses: string[],
): AccessControlCondition[] {
  return allowedAddresses.map((address) => ({
    contractAddress: "",
    standardContractType: "",
    chain: "polygon",
    method: "",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: address.toLowerCase(),
    },
  }));
}

// Combined conditions (time + ownership)
export function createTimedNFTCondition(
  unlockTimestamp: number,
  nftContractAddress: string,
): AccessControlCondition[] {
  return [
    ...createTimeBasedCondition(unlockTimestamp),
    ...createNFTOwnershipCondition(nftContractAddress),
  ];
}

// Grief score based access (custom contract)
export function createGriefScoreCondition(
  capsuleContractAddress: string,
  minimumGriefScore: number,
): AccessControlCondition[] {
  return [
    {
      contractAddress: capsuleContractAddress,
      standardContractType: "",
      chain: "polygon",
      method: "getGriefScore",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">=",
        value: minimumGriefScore.toString(),
      },
    },
  ];
}
