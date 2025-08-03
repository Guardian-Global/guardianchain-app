import { ethers } from "ethers";

export async function verifyRedemptionSig({ message, signature, expectedAddress }) {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch (err) {
    console.error("Signature verification failed:", err);
    return false;
  }
}
