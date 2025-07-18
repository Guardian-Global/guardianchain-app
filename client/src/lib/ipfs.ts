import axios from "axios";

const projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_IPFS_SECRET;

// Only create auth if credentials are available
const auth = projectId && projectSecret 
  ? "Basic " + btoa(`${projectId}:${projectSecret}`)
  : null;

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    if (!auth) {
      throw new Error("IPFS credentials not configured. Please set VITE_IPFS_PROJECT_ID and VITE_IPFS_SECRET");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("https://ipfs.infura.io:5001/api/v0/add", formData, {
      headers: {
        Authorization: auth,
        "Content-Type": "multipart/form-data",
      },
    });

    return `https://ipfs.io/ipfs/${res.data.Hash}`;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

export async function uploadJSONToIPFS(metadata: object): Promise<string> {
  try {
    if (!auth) {
      throw new Error("IPFS credentials not configured. Please set VITE_IPFS_PROJECT_ID and VITE_IPFS_SECRET");
    }

    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });
    
    return await uploadToIPFS(file);
  } catch (error) {
    console.error("JSON upload to IPFS failed:", error);
    throw new Error("Failed to upload JSON to IPFS");
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://ipfs.io/ipfs/${hash}`;
}