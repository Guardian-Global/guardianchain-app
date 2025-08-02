import * as crypto from 'crypto';

export interface DecryptCapsuleParams {
  encryptedContent: string;
  encryptedSymmetricKey: string;
  accessControlConditions: any[];
  chain?: string;
}

// Development fallback decryption using Node.js crypto
function simpleDecrypt(encryptedText: string, password: string): string {
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(password, 'salt', 32);
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt content');
  }
}

export async function decryptCapsule({
  encryptedContent,
  encryptedSymmetricKey,
  accessControlConditions,
  chain = "polygon"
}: DecryptCapsuleParams): Promise<string> {
  try {
    // For development, use simple decryption
    // In production, this would use actual Lit Protocol
    console.log("Using development decryption fallback for Lit Protocol");
    
    // Check access conditions (simplified for development)
    const currentTime = Date.now();
    for (const condition of accessControlConditions) {
      if (condition.method === "eth_getBlockByNumber" && 
          condition.returnValueTest.comparator === ">=" &&
          currentTime < parseInt(condition.returnValueTest.value)) {
        throw new Error("Time lock condition not met");
      }
    }

    const encryptionKey = Buffer.from(encryptedSymmetricKey, 'base64').toString();
    const encryptedData = Buffer.from(encryptedContent, 'base64').toString();
    
    const decryptedContent = simpleDecrypt(encryptedData, encryptionKey);

    return decryptedContent;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error(`Failed to decrypt capsule: ${error.message}`);
  }
}