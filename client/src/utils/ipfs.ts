/**
 * IPFS utilities for GuardianChain capsule metadata storage
 */

export interface CapsuleMetadata {
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: string;
  createdAt: string;
  creator: string;
  isPrivate: boolean;
  hasVeritasSeal: boolean;
  unlockDate?: string;
  truthScore?: number;
}

/**
 * Pin capsule metadata to IPFS via our backend service
 */
export async function pinCapsuleToIPFS(metadata: CapsuleMetadata): Promise<string> {
  try {
    const response = await fetch("/api/ipfs/pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        metadata,
        name: `${metadata.title}_metadata.json`,
      }),
    });

    if (!response.ok) {
      throw new Error(`IPFS pinning failed: ${response.statusText}`);
    }

    const { ipfsUrl, cid } = await response.json();
    
    console.log("📎 Capsule metadata pinned to IPFS:", { cid, ipfsUrl });
    
    return ipfsUrl;
  } catch (error) {
    console.error("❌ IPFS pinning error:", error);
    throw new Error("Failed to pin metadata to IPFS");
  }
}

/**
 * Pin media file to IPFS
 */
export async function pinMediaToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    const response = await fetch("/api/ipfs/pin-media", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Media IPFS pinning failed: ${response.statusText}`);
    }

    const { ipfsUrl, cid } = await response.json();
    
    console.log("📎 Media pinned to IPFS:", { cid, ipfsUrl, fileName: file.name });
    
    return ipfsUrl;
  } catch (error) {
    console.error("❌ Media IPFS pinning error:", error);
    throw new Error("Failed to pin media to IPFS");
  }
}

/**
 * Retrieve metadata from IPFS URL
 */
export async function fetchFromIPFS(ipfsUrl: string): Promise<CapsuleMetadata | null> {
  try {
    // Convert IPFS URL to HTTP gateway URL if needed
    const gatewayUrl = ipfsUrl.startsWith("ipfs://") 
      ? `https://ipfs.io/ipfs/${ipfsUrl.slice(7)}`
      : ipfsUrl;

    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata as CapsuleMetadata;
  } catch (error) {
    console.error("❌ IPFS fetch error:", error);
    return null;
  }
}

/**
 * Generate IPFS-compatible metadata object
 */
export function createCapsuleMetadata(
  title: string,
  description: string,
  creator: string,
  options: {
    mediaUrl?: string;
    mediaType?: string;
    isPrivate?: boolean;
    hasVeritasSeal?: boolean;
    unlockDate?: string;
    truthScore?: number;
  } = {}
): CapsuleMetadata {
  return {
    title,
    description,
    creator,
    createdAt: new Date().toISOString(),
    mediaType: options.mediaType || "text/plain",
    isPrivate: options.isPrivate || false,
    hasVeritasSeal: options.hasVeritasSeal || false,
    ...options,
  };
}

/**
 * Check if URL is a valid IPFS URL
 */
export function isValidIPFSUrl(url: string): boolean {
  return url.startsWith("ipfs://") || 
         url.includes("ipfs.io/ipfs/") || 
         url.includes("gateway.pinata.cloud/ipfs/") ||
         url.includes("dweb.link/ipfs/");
}

/**
 * Convert IPFS URL to multiple gateway options for reliability
 */
export function getIPFSGateways(ipfsHash: string): string[] {
  return [
    `https://ipfs.io/ipfs/${ipfsHash}`,
    `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    `https://dweb.link/ipfs/${ipfsHash}`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
  ];
}