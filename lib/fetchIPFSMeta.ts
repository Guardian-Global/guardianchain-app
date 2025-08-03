/**
 * IPFS Metadata Fetcher for GuardianChain Capsules
 * Fetches capsule metadata from IPFS with proper error handling and grief score extraction
 */

export interface IPFSCapsuleMetadata {
  title: string;
  griefScore: number;
  author: string;
  description: string;
  category?: string;
  timestamp?: string;
  emotionalResonance?: number;
}

/**
 * Fetches capsule metadata from IPFS
 * @param cid - IPFS Content Identifier
 * @returns Promise<IPFSCapsuleMetadata | null>
 */
export async function fetchIPFSMeta(cid: string): Promise<IPFSCapsuleMetadata | null> {
  try {
    // Use multiple IPFS gateways for reliability
    const gateways = [
      `https://ipfs.io/ipfs/${cid}`,
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://cloudflare-ipfs.com/ipfs/${cid}`
    ];

    let lastError: Error | null = null;

    for (const gateway of gateways) {
      try {
        const res = await fetch(gateway, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GuardianChain/1.0'
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        
        return {
          title: json.title || "Untitled Capsule",
          griefScore: typeof json.griefScore === 'number' ? json.griefScore : 0,
          author: json.author || "Anonymous",
          description: json.description || "No description provided.",
          category: json.category || "general",
          timestamp: json.timestamp || new Date().toISOString(),
          emotionalResonance: typeof json.emotionalResonance === 'number' ? json.emotionalResonance : 0
        };
      } catch (err) {
        lastError = err as Error;
        console.warn(`IPFS gateway ${gateway} failed:`, err);
        continue;
      }
    }

    throw lastError || new Error('All IPFS gateways failed');
  } catch (err) {
    console.error("IPFS Fetch Error:", err);
    return null;
  }
}

/**
 * Validates IPFS CID format
 * @param cid - Content Identifier to validate
 * @returns boolean
 */
export function isValidCID(cid: string): boolean {
  if (!cid || typeof cid !== 'string') return false;
  
  // Basic CID validation (simplified)
  const cidRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$|^[A-Za-z0-9]{59}$/;
  return cidRegex.test(cid);
}

/**
 * Fetches multiple capsule metadata concurrently
 * @param cids - Array of IPFS Content Identifiers
 * @returns Promise<Array<IPFSCapsuleMetadata | null>>
 */
export async function fetchMultipleIPFSMeta(cids: string[]): Promise<Array<IPFSCapsuleMetadata | null>> {
  const validCids = cids.filter(isValidCID);
  
  if (validCids.length === 0) {
    return [];
  }

  try {
    const promises = validCids.map(cid => fetchIPFSMeta(cid));
    return await Promise.all(promises);
  } catch (err) {
    console.error("Batch IPFS Fetch Error:", err);
    return new Array(validCids.length).fill(null);
  }
}