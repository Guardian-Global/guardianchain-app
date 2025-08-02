import { LitNodeClient, decryptString } from "lit-js-sdk/build/index.node.mjs";

export async function unlockDisclosure({
  encryptedSymmetricKey,
  encryptedContent,
  accessControlConditions,
  chain = "polygon"
}: {
  encryptedSymmetricKey: string;
  encryptedContent: string;
  accessControlConditions: any[];
  chain?: string;
}) {
  const litNodeClient = new LitNodeClient();
  await litNodeClient.connect();

  const authSig = await LitNodeClient.checkAndSignAuthMessage({ chain });

  const symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain,
    authSig,
  });

  const blob = new Blob([Uint8Array.from(Buffer.from(encryptedContent, "base64"))]);
  const decrypted = await decryptString(blob, symmetricKey);

  return decrypted;
}

// Enhanced unlock with error handling and retry logic
export async function unlockDisclosureWithRetry({
  encryptedSymmetricKey,
  encryptedContent,
  accessControlConditions,
  chain = "polygon",
  maxRetries = 3
}: {
  encryptedSymmetricKey: string;
  encryptedContent: string;
  accessControlConditions: any[];
  chain?: string;
  maxRetries?: number;
}) {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await unlockDisclosure({
        encryptedSymmetricKey,
        encryptedContent,
        accessControlConditions,
        chain,
      });
    } catch (error) {
      lastError = error as Error;
      console.warn(`Disclosure unlock attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw new Error(`Failed to unlock disclosure after ${maxRetries} attempts: ${lastError?.message}`);
}