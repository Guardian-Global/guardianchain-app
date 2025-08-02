import { create } from 'ipfs-http-client';
import { randomUUID } from 'crypto';

// IPFS Configuration
const IPFS_API_URL = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001';
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

export interface IPFSMetadata {
  id: string;
  title: string;
  content: string;
  contentType: string;
  griefTier: number;
  author: string;
  timestamp: string;
  tags: string[];
  sealed: boolean;
  sealData?: {
    sealHash: string;
    sealTimestamp: string;
    verificationHash: string;
  };
}

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
  pinned: boolean;
}

export class IPFSService {
  private client: any;

  constructor() {
    try {
      this.client = create({
        url: IPFS_API_URL,
        headers: {
          authorization: process.env.IPFS_PROJECT_SECRET 
            ? `Basic ${Buffer.from(`${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`).toString('base64')}`
            : undefined
        }
      });
    } catch (error) {
      console.warn('⚠️ IPFS client initialization failed, using mock mode:', error.message);
      this.client = null;
    }
  }

  // Upload capsule content to IPFS
  async uploadCapsule(metadata: IPFSMetadata): Promise<IPFSUploadResult> {
    if (!this.client) {
      return this.mockUpload(metadata);
    }

    try {
      const jsonContent = JSON.stringify(metadata, null, 2);
      const buffer = Buffer.from(jsonContent);

      const result = await this.client.add(buffer, {
        pin: true,
        cidVersion: 1
      });

      console.log('📦 IPFS Upload successful:', result.cid.toString());
      
      return {
        hash: result.cid.toString(),
        url: `${IPFS_GATEWAY}${result.cid.toString()}`,
        size: result.size,
        pinned: true
      };
    } catch (error) {
      console.error('❌ IPFS upload failed:', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  // Retrieve capsule from IPFS
  async getCapsule(hash: string): Promise<IPFSMetadata | null> {
    if (!this.client) {
      return this.mockRetrieve(hash);
    }

    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      
      const content = Buffer.concat(chunks).toString();
      const metadata = JSON.parse(content);
      
      console.log('📦 IPFS Retrieval successful for hash:', hash);
      return metadata;
    } catch (error) {
      console.error('❌ IPFS retrieval failed:', error);
      return null;
    }
  }

  // Seal capsule with cryptographic proof
  async sealCapsule(metadata: IPFSMetadata): Promise<IPFSMetadata> {
    const sealTimestamp = new Date().toISOString();
    const contentHash = this.generateContentHash(metadata.content);
    const verificationHash = this.generateVerificationHash(metadata, sealTimestamp);

    const sealedMetadata: IPFSMetadata = {
      ...metadata,
      sealed: true,
      sealData: {
        sealHash: contentHash,
        sealTimestamp,
        verificationHash
      }
    };

    console.log('🔒 Capsule sealed with verification hash:', verificationHash.slice(0, 16) + '...');
    return sealedMetadata;
  }

  // Pin content to IPFS for long-term storage
  async pinContent(hash: string): Promise<boolean> {
    if (!this.client) {
      console.log('📌 Mock pinning hash:', hash);
      return true;
    }

    try {
      await this.client.pin.add(hash);
      console.log('📌 Content pinned successfully:', hash);
      return true;
    } catch (error) {
      console.error('❌ Pinning failed:', error);
      return false;
    }
  }

  // Generate content verification hashes
  private generateContentHash(content: string): string {
    // In production, use actual cryptographic hashing
    return 'sha256:' + Buffer.from(content).toString('base64').slice(0, 32);
  }

  private generateVerificationHash(metadata: IPFSMetadata, timestamp: string): string {
    const verificationString = `${metadata.id}:${metadata.author}:${timestamp}:${metadata.content}`;
    return 'verify:' + Buffer.from(verificationString).toString('base64').slice(0, 32);
  }

  // Mock implementations for development
  private async mockUpload(metadata: IPFSMetadata): Promise<IPFSUploadResult> {
    const mockHash = `Qm${randomUUID().replace(/-/g, '').slice(0, 44)}`;
    console.log('🔧 Mock IPFS upload:', mockHash);
    
    return {
      hash: mockHash,
      url: `${IPFS_GATEWAY}${mockHash}`,
      size: JSON.stringify(metadata).length,
      pinned: true
    };
  }

  private async mockRetrieve(hash: string): Promise<IPFSMetadata | null> {
    console.log('🔧 Mock IPFS retrieval for:', hash);
    
    // Return mock data for testing
    return {
      id: 'mock_capsule_' + hash.slice(-8),
      title: 'Mock Capsule from IPFS',
      content: 'This is mock content retrieved from IPFS hash: ' + hash,
      contentType: 'text/plain',
      griefTier: 3,
      author: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: new Date().toISOString(),
      tags: ['mock', 'ipfs', 'test'],
      sealed: true,
      sealData: {
        sealHash: 'sha256:' + hash.slice(0, 32),
        sealTimestamp: new Date().toISOString(),
        verificationHash: 'verify:' + hash.slice(-32)
      }
    };
  }

  // Validate capsule integrity
  async validateCapsule(metadata: IPFSMetadata): Promise<boolean> {
    if (!metadata.sealed || !metadata.sealData) {
      return false;
    }

    const currentHash = this.generateContentHash(metadata.content);
    const expectedHash = metadata.sealData.sealHash;
    
    const isValid = currentHash === expectedHash;
    console.log('🔍 Capsule validation:', isValid ? 'PASSED' : 'FAILED');
    
    return isValid;
  }

  // Get IPFS node status
  async getNodeStatus(): Promise<{ online: boolean; peers: number; version?: string }> {
    if (!this.client) {
      return { online: false, peers: 0 };
    }

    try {
      const version = await this.client.version();
      const swarm = await this.client.swarm.peers();
      
      return {
        online: true,
        peers: swarm.length,
        version: version.version
      };
    } catch (error) {
      return { online: false, peers: 0 };
    }
  }
}

export const ipfsService = new IPFSService();