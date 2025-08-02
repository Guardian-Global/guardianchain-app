// IPFS Integration for GUARDIANCHAIN
// Supports both browser and server-side uploads with fallback mechanisms

interface IPFSUploadResponse {
  hash: string;
  url: string;
  gateway: string;
}

class IPFSManager {
  private projectId?: string;
  private projectSecret?: string;
  private authHeader?: string;

  constructor() {
    // Use environment variables with fallback
    this.projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
    this.projectSecret = import.meta.env.VITE_IPFS_SECRET;

    if (this.projectId && this.projectSecret) {
      this.authHeader =
        "Basic " + btoa(this.projectId + ":" + this.projectSecret);
    }
  }

  async uploadFile(
    file: File | Buffer,
    filename?: string,
  ): Promise<IPFSUploadResponse> {
    try {
      // Try Infura IPFS first
      if (this.authHeader) {
        return await this.uploadToInfura(file, filename);
      }

      // Fallback to public gateway
      return await this.uploadToPublicGateway(file, filename);
    } catch (error) {
      console.error("IPFS upload failed:", error);
      throw new Error(
        `IPFS upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  private async uploadToInfura(
    file: File | Buffer,
    filename?: string,
  ): Promise<IPFSUploadResponse> {
    const formData = new FormData();

    if (file instanceof File) {
      formData.append("file", file);
    } else {
      // Handle Buffer (server-side)
      const blob = new Blob([file]);
      formData.append("file", blob, filename || "file");
    }

    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      headers: {
        Authorization: this.authHeader!,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Infura IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      hash: result.Hash,
      url: `https://ipfs.io/ipfs/${result.Hash}`,
      gateway: "infura",
    };
  }

  private async uploadToPublicGateway(
    file: File | Buffer,
    filename?: string,
  ): Promise<IPFSUploadResponse> {
    // Fallback implementation using server endpoint
    const formData = new FormData();

    if (file instanceof File) {
      formData.append("file", file);
    } else {
      const blob = new Blob([file]);
      formData.append("file", blob, filename || "file");
    }

    const response = await fetch("/api/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      hash: result.hash,
      url: result.url,
      gateway: "server",
    };
  }

  async uploadJSON(data: object): Promise<IPFSUploadResponse> {
    const jsonString = JSON.stringify(data, null, 2);
    const file = new Blob([jsonString], { type: "application/json" });

    return this.uploadFile(file as File, "metadata.json");
  }

  async uploadCapsuleMetadata(capsuleData: {
    title: string;
    description: string;
    type: string;
    creator: string;
    timestamp: number;
    content?: any;
    attributes?: any[];
  }): Promise<IPFSUploadResponse> {
    const metadata = {
      name: capsuleData.title,
      description: capsuleData.description,
      image: "", // Will be set after content upload
      external_url: `https://guardianchain.app/capsule/${Date.now()}`,
      attributes: [
        { trait_type: "Type", value: capsuleData.type },
        { trait_type: "Creator", value: capsuleData.creator },
        { trait_type: "Timestamp", value: capsuleData.timestamp },
        ...(capsuleData.attributes || []),
      ],
      capsule: {
        version: "1.0",
        protocol: "GUARDIANCHAIN",
        content: capsuleData.content,
        verification: {
          method: "community",
          status: "pending",
        },
      },
    };

    return this.uploadJSON(metadata);
  }

  getGatewayUrl(
    hash: string,
    gateway: "ipfs" | "cloudflare" | "pinata" = "ipfs",
  ): string {
    switch (gateway) {
      case "cloudflare":
        return `https://cloudflare-ipfs.com/ipfs/${hash}`;
      case "pinata":
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
      default:
        return `https://ipfs.io/ipfs/${hash}`;
    }
  }

  isConfigured(): boolean {
    return !!(this.projectId && this.projectSecret);
  }

  getStatus(): { configured: boolean; method: string } {
    if (this.isConfigured()) {
      return { configured: true, method: "infura" };
    }
    return { configured: false, method: "fallback" };
  }
}

// Export singleton instance
export const ipfsManager = new IPFSManager();

// Convenience functions
export async function uploadToIPFS(file: File): Promise<string> {
  const result = await ipfsManager.uploadFile(file);
  return result.url;
}

export async function uploadJSONToIPFS(data: object): Promise<string> {
  const result = await ipfsManager.uploadJSON(data);
  return result.url;
}

export async function uploadCapsuleToIPFS(capsuleData: any): Promise<string> {
  const result = await ipfsManager.uploadCapsuleMetadata(capsuleData);
  return result.url;
}

export { IPFSManager };
export type { IPFSUploadResponse };
