import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// SMRI (Subjective Memory Resonance Index) Badge Traits
export interface SMRITraits {
  memoryType: 'visual' | 'auditory' | 'kinesthetic' | 'emotional' | 'cognitive';
  griefScore: 'low' | 'medium' | 'high' | 'transcendent';
  trustIndex: string; // 0-100 numeric string
  profileAffinity: 'curious' | 'empathetic' | 'analytical' | 'protective' | 'visionary';
  resonanceFrequency: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta';
  temporalAnchor: 'past' | 'present' | 'future' | 'eternal';
}

// SMRI Badge Contract ABI (minimal for minting)
const SMRI_BADGE_ABI = [
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "tokenURI", "type": "string"}
    ],
    "name": "mintTo",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI", 
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * Generate SMRI metadata based on traits
 */
export function generateSMRIMetadata(traits: SMRITraits): any {
  return {
    name: `SMRI Badge - ${traits.profileAffinity.charAt(0).toUpperCase() + traits.profileAffinity.slice(1)}`,
    description: `Subjective Memory Resonance Index Badge certifying ${traits.memoryType} memory processing with ${traits.griefScore} grief resonance and ${traits.trustIndex}% trust index.`,
    image: `https://gateway.pinata.cloud/ipfs/QmSMRIBadge${traits.profileAffinity}${traits.griefScore}`,
    attributes: [
      {
        trait_type: "Memory Type",
        value: traits.memoryType
      },
      {
        trait_type: "Grief Score", 
        value: traits.griefScore
      },
      {
        trait_type: "Trust Index",
        value: parseInt(traits.trustIndex),
        max_value: 100
      },
      {
        trait_type: "Profile Affinity",
        value: traits.profileAffinity
      },
      {
        trait_type: "Resonance Frequency",
        value: traits.resonanceFrequency
      },
      {
        trait_type: "Temporal Anchor",
        value: traits.temporalAnchor
      },
      {
        trait_type: "Badge Type",
        value: "SMRI"
      }
    ],
    external_url: "https://guardianchain.io/smri-badges"
  };
}

/**
 * Upload SMRI metadata to IPFS
 */
export async function uploadSMRIMetadata(traits: SMRITraits): Promise<string> {
  try {
    const metadata = generateSMRIMetadata(traits);
    
    // In production, upload to Pinata or IPFS
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: metadata,
        type: 'smri-metadata'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to upload SMRI metadata to IPFS');
    }

    const result = await response.json();
    return result.ipfsHash;
  } catch (error) {
    console.error('SMRI metadata upload failed:', error);
    throw error;
  }
}

/**
 * Mint SMRI Badge NFT
 */
export async function mintSMRIBadge(
  recipientAddress: string, 
  traits: SMRITraits
): Promise<{ tokenId: string; txHash: string; metadataUrl: string }> {
  try {
    // Check if window.ethereum is available
    if (!window.ethereum) {
      throw new Error('MetaMask or Web3 wallet not detected');
    }

    const provider = new (ethers as any).providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Get contract address from environment
    const contractAddress = import.meta.env.VITE_SMRI_NFT_CONTRACT;
    if (!contractAddress) {
      throw new Error('SMRI NFT contract address not configured. Please set NEXT_PUBLIC_SMRI_NFT_CONTRACT in environment variables.');
    }

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, SMRI_BADGE_ABI, signer);

    // Upload metadata to IPFS
    console.log('🔄 Uploading SMRI metadata to IPFS...');
    const metadataHash = await uploadSMRIMetadata(traits);
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;

    // Mint the NFT
    console.log('🔄 Minting SMRI Badge NFT...');
    const mintTx = await contract.mintTo(recipientAddress, metadataUrl);
    
    console.log('⏳ Waiting for transaction confirmation...');
    const receipt = await mintTx.wait();

    // Extract token ID from logs
    const mintEvent = receipt.events?.find((event: any) => event.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId?.toString() || 'unknown';

    console.log('✅ SMRI Badge minted successfully!', {
      tokenId,
      txHash: receipt.transactionHash,
      metadataUrl
    });

    return {
      tokenId,
      txHash: receipt.transactionHash,
      metadataUrl
    };

  } catch (error) {
    console.error('❌ SMRI Badge minting failed:', error);
    throw error;
  }
}

/**
 * Analyze capsule content to determine SMRI traits using AI
 */
export async function analyzeCapsuleForSMRI(capsuleText: string): Promise<SMRITraits> {
  try {
    const response = await fetch('/api/smri/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ capsuleText })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze capsule for SMRI traits');
    }

    const traits = await response.json();
    return traits;
  } catch (error) {
    console.error('SMRI analysis failed:', error);
    // Return default traits if analysis fails
    return {
      memoryType: 'emotional',
      griefScore: 'medium',
      trustIndex: '75',
      profileAffinity: 'empathetic',
      resonanceFrequency: 'theta',
      temporalAnchor: 'present'
    };
  }
}

/**
 * Get SMRI Badge details by token ID
 */
export async function getSMRIBadgeDetails(tokenId: string): Promise<any> {
  try {
    if (!window.ethereum) {
      throw new Error('Web3 wallet not detected');
    }

    const provider = new (ethers as any).providers.Web3Provider(window.ethereum);
    const contractAddress = import.meta.env.VITE_SMRI_NFT_CONTRACT;
    
    if (!contractAddress) {
      throw new Error('SMRI NFT contract address not configured');
    }

    const contract = new ethers.Contract(contractAddress, SMRI_BADGE_ABI, provider);
    const tokenURI = await contract.tokenURI(tokenId);

    // Fetch metadata from IPFS
    const response = await fetch(tokenURI);
    const metadata = await response.json();

    return {
      tokenId,
      tokenURI,
      metadata
    };
  } catch (error) {
    console.error('Failed to get SMRI badge details:', error);
    throw error;
  }
}