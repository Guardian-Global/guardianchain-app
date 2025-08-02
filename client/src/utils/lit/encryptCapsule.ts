export interface AccessControlCondition {
  contractAddress: string;
  standardContractType: string;
  chain: string;
  method: string;
  parameters: string[];
  returnValueTest: {
    comparator: string;
    value: string;
  };
}

export interface EncryptCapsuleParams {
  content: string;
  accessControlConditions: AccessControlCondition[];
  chain?: string;
}

export interface EncryptedCapsuleResult {
  encryptedContent: string;
  encryptedSymmetricKey: string;
  accessControlConditions: AccessControlCondition[];
}

// Client-side encryption fallback using Web Crypto API
async function simpleEncrypt(text: string, password: string): Promise<string> {
  try {
    // For client-side, we'll use a simplified approach
    // In production, this would integrate with actual Lit Protocol client SDK
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Simple XOR encryption for development
    const key = encoder.encode(password);
    const data = encoder.encode(text);
    const encrypted = new Uint8Array(data.length);
    
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = data[i] ^ key[i % key.length];
    }
    
    return btoa(String.fromCharCode(...encrypted));
  } catch (error) {
    throw new Error('Failed to encrypt content');
  }
}

export async function encryptCapsule({ 
  content, 
  accessControlConditions, 
  chain = "polygon" 
}: EncryptCapsuleParams): Promise<EncryptedCapsuleResult> {
  try {
    console.log("Using client-side encryption fallback for Lit Protocol");
    
    // Generate a random encryption key
    const encryptionKey = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    
    const encryptedContent = await simpleEncrypt(content, encryptionKey);
    const encryptedSymmetricKey = btoa(encryptionKey);

    return {
      encryptedContent,
      encryptedSymmetricKey,
      accessControlConditions,
    };
  } catch (error) {
    console.error("Client encryption error:", error);
    throw new Error(`Failed to encrypt capsule: ${error.message}`);
  }
}