import * as crypto from "crypto";

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

// Development fallback encryption using Node.js crypto
function simpleEncrypt(text: string, password: string): string {
  const algorithm = "aes-256-gcm";
  const key = crypto.scryptSync(password, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export async function encryptCapsule({
  content,
  accessControlConditions,
  chain = "polygon",
}: EncryptCapsuleParams): Promise<EncryptedCapsuleResult> {
  try {
    // For development, use simple encryption
    // In production, this would use actual Lit Protocol
    console.log("Using development encryption fallback for Lit Protocol");

    const encryptionKey = crypto.randomBytes(32).toString("hex");
    const encryptedContent = simpleEncrypt(content, encryptionKey);
    const encryptedSymmetricKey = Buffer.from(encryptionKey).toString("base64");

    return {
      encryptedContent: Buffer.from(encryptedContent).toString("base64"),
      encryptedSymmetricKey,
      accessControlConditions,
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error(`Failed to encrypt capsule: ${error.message}`);
  }
}
