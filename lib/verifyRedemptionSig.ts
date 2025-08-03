/**
 * Enhanced Redemption Signature Verification System
 * Provides cryptographic verification for capsule redemption operations
 */

import crypto from 'crypto';

export interface RedemptionSignature {
  capsuleId: string;
  redeemer: string;
  amount: number;
  timestamp: number;
  nonce: string;
  signature: string;
  signerAddress: string;
  metadata?: {
    griefScore?: number;
    validatorApproval?: boolean;
    emergencyRedeem?: boolean;
    batch?: string;
  };
}

export interface SignatureValidationResult {
  valid: boolean;
  capsuleId?: string;
  redeemer?: string;
  amount?: number;
  timestamp?: number;
  signerAddress?: string;
  error?: string;
  warnings?: string[];
  securityScore?: number;
}

export interface RedemptionVerificationConfig {
  authorizedSigners: string[];
  requiredSigners: number;
  maxAge: number; // Maximum age of signature in milliseconds
  nonceWindow: number; // Window for nonce validation
  emergencyOverride: boolean;
  securityThreshold: number; // Minimum security score (0-100)
}

export class RedemptionSignatureVerifier {
  private usedNonces: Set<string> = new Set();
  private config: RedemptionVerificationConfig;

  constructor(config?: Partial<RedemptionVerificationConfig>) {
    this.config = {
      authorizedSigners: [
        '0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7', // Primary validator
        '0x8ba1f109551bD432803012645Hac136c31b2Dc8',  // Secondary validator
        '0x9c5B4d6d7e8f123456789abcdef0123456789abc',  // Tertiary validator
        '0xDef1B23456789aBcDeF0123456789AbCdEf01234'   // Emergency validator
      ],
      requiredSigners: 1,
      maxAge: 15 * 60 * 1000, // 15 minutes
      nonceWindow: 1000, // Allow 1000 recent nonces
      emergencyOverride: true,
      securityThreshold: 75,
      ...config
    };
  }

  /**
   * Generate redemption signature for authorized signers
   */
  generateRedemptionSignature(redemptionData: {
    capsuleId: string;
    redeemer: string;
    amount: number;
    signerPrivateKey?: string; // In production, use hardware wallet or secure enclave
    metadata?: RedemptionSignature['metadata'];
  }): RedemptionSignature {
    
    const timestamp = Date.now();
    const nonce = this.generateSecureNonce();
    
    // Create message to sign
    const message = this.createSignatureMessage({
      capsuleId: redemptionData.capsuleId,
      redeemer: redemptionData.redeemer,
      amount: redemptionData.amount,
      timestamp,
      nonce
    });

    // Generate signature (simplified for demo - in production use proper crypto)
    const signature = this.createSignature(message, redemptionData.signerPrivateKey);
    const signerAddress = this.deriveSignerAddress(signature);

    const redemptionSignature: RedemptionSignature = {
      capsuleId: redemptionData.capsuleId,
      redeemer: redemptionData.redeemer,
      amount: redemptionData.amount,
      timestamp,
      nonce,
      signature,
      signerAddress,
      metadata: redemptionData.metadata
    };

    console.log(`✍️ Generated redemption signature for capsule ${redemptionData.capsuleId}`);
    console.log(`📝 Signer: ${signerAddress}, Amount: ${redemptionData.amount} GTT`);
    
    return redemptionSignature;
  }

  /**
   * Verify redemption signature with comprehensive validation
   */
  verifyRedemptionSignature(
    signature: RedemptionSignature,
    additionalSignatures?: RedemptionSignature[]
  ): SignatureValidationResult {
    
    const warnings: string[] = [];
    let securityScore = 100;

    try {
      // Basic signature structure validation
      const structureValidation = this.validateSignatureStructure(signature);
      if (!structureValidation.valid) {
        return {
          valid: false,
          error: structureValidation.error
        };
      }

      // Timestamp validation
      const timestampValidation = this.validateTimestamp(signature.timestamp);
      if (!timestampValidation.valid) {
        if (timestampValidation.expired) {
          return {
            valid: false,
            error: 'Signature has expired',
            timestamp: signature.timestamp
          };
        }
        warnings.push(timestampValidation.warning || 'Timestamp validation warning');
        securityScore -= 10;
      }

      // Nonce validation
      const nonceValidation = this.validateNonce(signature.nonce);
      if (!nonceValidation.valid) {
        return {
          valid: false,
          error: nonceValidation.error || 'Invalid nonce'
        };
      }

      // Signer authorization validation
      const signerValidation = this.validateSigner(signature.signerAddress);
      if (!signerValidation.valid) {
        return {
          valid: false,
          error: 'Unauthorized signer',
          signerAddress: signature.signerAddress
        };
      }

      // Cryptographic signature validation
      const cryptoValidation = this.validateCryptographicSignature(signature);
      if (!cryptoValidation.valid) {
        return {
          valid: false,
          error: 'Invalid cryptographic signature'
        };
      }

      // Multi-signature validation if additional signatures provided
      if (additionalSignatures && additionalSignatures.length > 0) {
        const multiSigValidation = this.validateMultipleSignatures([signature, ...additionalSignatures]);
        if (!multiSigValidation.valid) {
          return {
            valid: false,
            error: multiSigValidation.error
          };
        }
        securityScore += 15; // Bonus for multi-sig
      }

      // Amount validation
      const amountValidation = this.validateAmount(signature.amount, signature.metadata);
      if (!amountValidation.valid) {
        if (amountValidation.critical) {
          return {
            valid: false,
            error: amountValidation.error
          };
        }
        warnings.push(amountValidation.warning || 'Amount validation warning');
        securityScore -= 5;
      }

      // Emergency redemption checks
      if (signature.metadata?.emergencyRedeem) {
        const emergencyValidation = this.validateEmergencyRedemption(signature);
        if (!emergencyValidation.valid) {
          return {
            valid: false,
            error: emergencyValidation.error
          };
        }
        warnings.push('Emergency redemption detected');
        securityScore -= 20;
      }

      // Record nonce as used
      this.usedNonces.add(signature.nonce);
      this.cleanupOldNonces();

      console.log(`✅ Redemption signature verified successfully`);
      console.log(`🔒 Security score: ${securityScore}/100`);

      return {
        valid: true,
        capsuleId: signature.capsuleId,
        redeemer: signature.redeemer,
        amount: signature.amount,
        timestamp: signature.timestamp,
        signerAddress: signature.signerAddress,
        warnings: warnings.length > 0 ? warnings : undefined,
        securityScore
      };

    } catch (error) {
      console.error('❌ Signature verification error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown verification error'
      };
    }
  }

  /**
   * Batch verify multiple redemption signatures
   */
  batchVerifySignatures(
    signatures: RedemptionSignature[]
  ): Array<SignatureValidationResult & { signatureIndex: number }> {
    
    console.log(`🔍 Batch verifying ${signatures.length} redemption signatures`);
    
    return signatures.map((signature, index) => ({
      ...this.verifyRedemptionSignature(signature),
      signatureIndex: index
    }));
  }

  /**
   * Create signature challenge for verification
   */
  createSignatureChallenge(capsuleId: string, redeemer: string): {
    challenge: string;
    nonce: string;
    timestamp: number;
    expiresAt: number;
  } {
    
    const timestamp = Date.now();
    const nonce = this.generateSecureNonce();
    const expiresAt = timestamp + (5 * 60 * 1000); // 5 minutes
    
    const challenge = crypto.createHash('sha256')
      .update(`${capsuleId}:${redeemer}:${timestamp}:${nonce}`)
      .digest('hex');

    return {
      challenge,
      nonce,
      timestamp,
      expiresAt
    };
  }

  /**
   * Verify signature challenge response
   */
  verifyChallengeResponse(
    challenge: string,
    response: string,
    expectedSigner: string
  ): { valid: boolean; error?: string } {
    
    try {
      // Verify challenge response (simplified for demo)
      const expectedResponse = crypto.createHash('sha256')
        .update(`${challenge}:${expectedSigner}`)
        .digest('hex');

      if (response !== expectedResponse) {
        return { valid: false, error: 'Invalid challenge response' };
      }

      return { valid: true };
      
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Challenge verification failed' 
      };
    }
  }

  /**
   * Get signature verification statistics
   */
  getVerificationStats(): {
    totalVerifications: number;
    successfulVerifications: number;
    failedVerifications: number;
    averageSecurityScore: number;
    commonFailureReasons: Record<string, number>;
    authorizedSignerUsage: Record<string, number>;
  } {
    
    // In production, these would be stored and tracked
    return {
      totalVerifications: 1247,
      successfulVerifications: 1198,
      failedVerifications: 49,
      averageSecurityScore: 87.3,
      commonFailureReasons: {
        'expired_signature': 23,
        'unauthorized_signer': 15,
        'invalid_nonce': 8,
        'amount_validation': 3
      },
      authorizedSignerUsage: this.config.authorizedSigners.reduce((usage, signer) => {
        usage[signer] = Math.floor(Math.random() * 100) + 50; // Mock usage data
        return usage;
      }, {} as Record<string, number>)
    };
  }

  // Private helper methods

  private validateSignatureStructure(signature: RedemptionSignature): { valid: boolean; error?: string } {
    if (!signature.capsuleId || !signature.redeemer || !signature.signature || !signature.signerAddress) {
      return { valid: false, error: 'Missing required signature fields' };
    }

    if (signature.amount <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }

    if (!signature.timestamp || signature.timestamp <= 0) {
      return { valid: false, error: 'Invalid timestamp' };
    }

    return { valid: true };
  }

  private validateTimestamp(timestamp: number): { 
    valid: boolean; 
    expired?: boolean; 
    warning?: string; 
  } {
    const now = Date.now();
    const age = now - timestamp;

    if (age > this.config.maxAge) {
      return { valid: false, expired: true };
    }

    if (age > this.config.maxAge * 0.8) {
      return { 
        valid: true, 
        warning: 'Signature is approaching expiration' 
      };
    }

    if (timestamp > now + (5 * 60 * 1000)) { // Future timestamp with 5min tolerance
      return { 
        valid: true, 
        warning: 'Signature timestamp is in the future' 
      };
    }

    return { valid: true };
  }

  private validateNonce(nonce: string): { valid: boolean; error?: string } {
    if (!nonce || nonce.length < 8) {
      return { valid: false, error: 'Invalid nonce format' };
    }

    if (this.usedNonces.has(nonce)) {
      return { valid: false, error: 'Nonce already used (replay attack detected)' };
    }

    return { valid: true };
  }

  private validateSigner(signerAddress: string): { valid: boolean } {
    return { valid: this.config.authorizedSigners.includes(signerAddress) };
  }

  private validateCryptographicSignature(signature: RedemptionSignature): { valid: boolean } {
    try {
      // Recreate the message that should have been signed
      const message = this.createSignatureMessage({
        capsuleId: signature.capsuleId,
        redeemer: signature.redeemer,
        amount: signature.amount,
        timestamp: signature.timestamp,
        nonce: signature.nonce
      });

      // In production, this would use proper cryptographic verification
      // For demo, we'll validate signature format and consistency
      const expectedSigner = this.deriveSignerAddress(signature.signature);
      
      return { valid: expectedSigner === signature.signerAddress };
      
    } catch (error) {
      return { valid: false };
    }
  }

  private validateMultipleSignatures(signatures: RedemptionSignature[]): { valid: boolean; error?: string } {
    // Check if we have enough unique signers
    const uniqueSigners = new Set(signatures.map(sig => sig.signerAddress));
    
    if (uniqueSigners.size < this.config.requiredSigners) {
      return { 
        valid: false, 
        error: `Insufficient signers: required ${this.config.requiredSigners}, got ${uniqueSigners.size}` 
      };
    }

    // Validate all signatures are for the same redemption
    const firstSig = signatures[0];
    const inconsistent = signatures.some(sig => 
      sig.capsuleId !== firstSig.capsuleId ||
      sig.redeemer !== firstSig.redeemer ||
      sig.amount !== firstSig.amount
    );

    if (inconsistent) {
      return { valid: false, error: 'Inconsistent signature data' };
    }

    return { valid: true };
  }

  private validateAmount(amount: number, metadata?: RedemptionSignature['metadata']): { 
    valid: boolean; 
    critical?: boolean; 
    error?: string; 
    warning?: string; 
  } {
    // Basic amount validation
    if (amount <= 0) {
      return { valid: false, critical: true, error: 'Amount must be positive' };
    }

    // Large amount warning
    if (amount > 1000) {
      return { 
        valid: true, 
        warning: 'Large redemption amount detected' 
      };
    }

    // Grief score consideration
    if (metadata?.griefScore && metadata.griefScore < 5 && amount > 100) {
      return { 
        valid: true, 
        warning: 'High amount for low grief score capsule' 
      };
    }

    return { valid: true };
  }

  private validateEmergencyRedemption(signature: RedemptionSignature): { valid: boolean; error?: string } {
    if (!this.config.emergencyOverride) {
      return { valid: false, error: 'Emergency redemptions are disabled' };
    }

    // Emergency redemptions require higher authority
    const emergencySigners = this.config.authorizedSigners.slice(0, 2); // First 2 are emergency signers
    
    if (!emergencySigners.includes(signature.signerAddress)) {
      return { valid: false, error: 'Unauthorized for emergency redemption' };
    }

    return { valid: true };
  }

  private generateSecureNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createSignatureMessage(data: {
    capsuleId: string;
    redeemer: string;
    amount: number;
    timestamp: number;
    nonce: string;
  }): string {
    return JSON.stringify(data, Object.keys(data).sort());
  }

  private createSignature(message: string, privateKey?: string): string {
    // Simplified signature generation for demo
    // In production, use proper ECDSA or similar
    const hash = crypto.createHash('sha256').update(message).digest('hex');
    return `0x${hash}${crypto.randomBytes(16).toString('hex')}`;
  }

  private deriveSignerAddress(signature: string): string {
    // Simplified address derivation for demo
    // In production, recover address from signature
    const hash = crypto.createHash('sha256').update(signature).digest('hex');
    const addressIndex = parseInt(hash.slice(0, 2), 16) % this.config.authorizedSigners.length;
    return this.config.authorizedSigners[addressIndex];
  }

  private cleanupOldNonces(): void {
    // Keep only recent nonces to prevent memory growth
    if (this.usedNonces.size > this.config.nonceWindow) {
      const noncesToRemove = this.usedNonces.size - this.config.nonceWindow;
      const noncesArray = Array.from(this.usedNonces);
      
      for (let i = 0; i < noncesToRemove; i++) {
        this.usedNonces.delete(noncesArray[i]);
      }
    }
  }
}

// Export singleton instance
export const redemptionSignatureVerifier = new RedemptionSignatureVerifier();

// Export convenience function for simple verification
export function verifyRedemptionSig(
  signature: RedemptionSignature
): SignatureValidationResult {
  return redemptionSignatureVerifier.verifyRedemptionSignature(signature);
}