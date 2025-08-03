/**
 * Enhanced Capsule License Verification System
 * Manages licensing, verification, and compliance for truth capsules
 */

import crypto from 'crypto';

export interface CapsuleLicense {
  id: string;
  capsuleId: string;
  author: string;
  authorWallet?: string;
  licensedTo?: string;
  licenseType: 'standard' | 'commercial' | 'exclusive' | 'creative_commons';
  issuedAt: number;
  expiresAt?: number;
  griefScore: number;
  truthConfidence: number;
  licenseHash: string;
  permissions: {
    redistribute: boolean;
    commercialUse: boolean;
    modification: boolean;
    attribution: boolean;
  };
  terms: {
    royaltyRate?: number; // percentage
    exclusivityPeriod?: number; // days
    territorialLimits?: string[];
    usageRestrictions?: string[];
  };
  verification: {
    isVerified: boolean;
    verifiedBy?: string[];
    verificationDate?: number;
    complianceScore: number;
  };
  blockchain: {
    txHash?: string;
    blockNumber?: number;
    contractAddress?: string;
  };
}

export interface LicenseRequest {
  capsuleId: string;
  requestedBy: string;
  licenseType: 'standard' | 'commercial' | 'exclusive' | 'creative_commons';
  intendedUse: string;
  duration?: number; // days
  offerAmount?: number; // GTT
  message?: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export interface LicenseMetrics {
  totalLicenses: number;
  activeLicenses: number;
  revenueGenerated: number;
  averageRoyalty: number;
  topLicensedCapsules: Array<{
    capsuleId: string;
    title: string;
    licenses: number;
    revenue: number;
  }>;
  licenseTypeDistribution: Record<string, number>;
}

export class CapsuleLicenseManager {
  private licenses: Map<string, CapsuleLicense> = new Map();
  private requests: Map<string, LicenseRequest> = new Map();

  /**
   * Generate enhanced capsule license with comprehensive metadata
   */
  generateCapsuleLicense(licenseData: {
    capsuleId: string;
    author: string;
    authorWallet?: string;
    griefScore: number;
    truthConfidence: number;
    licenseType?: 'standard' | 'commercial' | 'exclusive' | 'creative_commons';
    licensedTo?: string;
    duration?: number; // days
    customTerms?: Partial<CapsuleLicense['terms']>;
  }): CapsuleLicense {
    
    const now = Date.now();
    const licenseId = `lic_${now}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate deterministic license hash
    const hashInput = JSON.stringify({
      capsuleId: licenseData.capsuleId,
      author: licenseData.author,
      griefScore: licenseData.griefScore,
      timestamp: now
    });
    
    const licenseHash = crypto.createHash('sha256').update(hashInput).digest('hex');
    
    // Set default permissions based on license type
    const defaultPermissions = this.getDefaultPermissions(licenseData.licenseType || 'standard');
    
    const license: CapsuleLicense = {
      id: licenseId,
      capsuleId: licenseData.capsuleId,
      author: licenseData.author,
      authorWallet: licenseData.authorWallet,
      licensedTo: licenseData.licensedTo,
      licenseType: licenseData.licenseType || 'standard',
      issuedAt: now,
      expiresAt: licenseData.duration ? now + (licenseData.duration * 24 * 60 * 60 * 1000) : undefined,
      griefScore: licenseData.griefScore,
      truthConfidence: licenseData.truthConfidence,
      licenseHash,
      permissions: defaultPermissions,
      terms: {
        royaltyRate: this.getDefaultRoyaltyRate(licenseData.licenseType || 'standard'),
        ...licenseData.customTerms
      },
      verification: {
        isVerified: false,
        complianceScore: this.calculateComplianceScore(licenseData)
      },
      blockchain: {}
    };

    this.licenses.set(licenseId, license);
    console.log(`📜 Generated license ${licenseId} for capsule ${licenseData.capsuleId}`);
    
    return license;
  }

  /**
   * Verify license authenticity and validity
   */
  verifyLicense(licenseId: string, verifierAddress?: string): {
    valid: boolean;
    license?: CapsuleLicense;
    issues?: string[];
    recommendations?: string[];
  } {
    const license = this.licenses.get(licenseId);
    
    if (!license) {
      return {
        valid: false,
        issues: ['License not found']
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check expiration
    if (license.expiresAt && Date.now() > license.expiresAt) {
      issues.push('License has expired');
    }

    // Check verification status
    if (!license.verification.isVerified) {
      recommendations.push('License requires verification for full authenticity');
    }

    // Check compliance score
    if (license.verification.complianceScore < 70) {
      recommendations.push('License has low compliance score, review terms');
    }

    // Verify hash integrity
    const expectedHash = this.calculateLicenseHash(license);
    if (expectedHash !== license.licenseHash) {
      issues.push('License hash verification failed - potential tampering detected');
    }

    // If verifier provided, record verification
    if (verifierAddress && issues.length === 0) {
      license.verification.verifiedBy = license.verification.verifiedBy || [];
      if (!license.verification.verifiedBy.includes(verifierAddress)) {
        license.verification.verifiedBy.push(verifierAddress);
        license.verification.verificationDate = Date.now();
        
        // Update verification status if enough verifiers
        if (license.verification.verifiedBy.length >= 2) {
          license.verification.isVerified = true;
        }
      }
    }

    return {
      valid: issues.length === 0,
      license,
      issues: issues.length > 0 ? issues : undefined,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }

  /**
   * Create license request
   */
  createLicenseRequest(requestData: Omit<LicenseRequest, 'timestamp' | 'status'>): LicenseRequest {
    const request: LicenseRequest = {
      ...requestData,
      timestamp: Date.now(),
      status: 'pending'
    };

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.requests.set(requestId, request);
    
    console.log(`📋 Created license request ${requestId} for capsule ${requestData.capsuleId}`);
    return request;
  }

  /**
   * Process license request (approve/reject)
   */
  processLicenseRequest(
    requestId: string, 
    action: 'approve' | 'reject',
    authorAddress: string
  ): { success: boolean; license?: CapsuleLicense; message: string } {
    const request = this.requests.get(requestId);
    
    if (!request) {
      return { success: false, message: 'License request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: 'Request already processed' };
    }

    if (action === 'approve') {
      // Generate license for approved request
      const license = this.generateCapsuleLicense({
        capsuleId: request.capsuleId,
        author: authorAddress,
        griefScore: 8, // Default for approved licenses
        truthConfidence: 90, // Default for approved licenses
        licenseType: request.licenseType,
        licensedTo: request.requestedBy,
        duration: request.duration
      });

      request.status = 'approved';
      
      return {
        success: true,
        license,
        message: `License approved and generated: ${license.id}`
      };
    } else {
      request.status = 'rejected';
      return {
        success: true,
        message: 'License request rejected'
      };
    }
  }

  /**
   * Get license analytics and metrics
   */
  getLicenseMetrics(): LicenseMetrics {
    const allLicenses = Array.from(this.licenses.values());
    const now = Date.now();
    
    const activeLicenses = allLicenses.filter(license => 
      !license.expiresAt || license.expiresAt > now
    );

    const revenueGenerated = allLicenses.reduce((total, license) => {
      if (license.terms.royaltyRate) {
        return total + (license.terms.royaltyRate * 10); // Mock revenue calculation
      }
      return total;
    }, 0);

    const licenseTypeDistribution = allLicenses.reduce((dist, license) => {
      dist[license.licenseType] = (dist[license.licenseType] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    // Mock top licensed capsules
    const capsuleStats = new Map<string, { licenses: number; revenue: number; title: string }>();
    
    allLicenses.forEach(license => {
      const current = capsuleStats.get(license.capsuleId) || {
        licenses: 0,
        revenue: 0,
        title: `Capsule ${license.capsuleId.slice(0, 8)}...`
      };
      
      current.licenses++;
      current.revenue += license.terms.royaltyRate || 0;
      
      capsuleStats.set(license.capsuleId, current);
    });

    const topLicensedCapsules = Array.from(capsuleStats.entries())
      .map(([capsuleId, stats]) => ({ capsuleId, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalLicenses: allLicenses.length,
      activeLicenses: activeLicenses.length,
      revenueGenerated,
      averageRoyalty: allLicenses.length > 0 
        ? allLicenses.reduce((sum, l) => sum + (l.terms.royaltyRate || 0), 0) / allLicenses.length 
        : 0,
      topLicensedCapsules,
      licenseTypeDistribution
    };
  }

  /**
   * Get licenses for a specific capsule
   */
  getCapsuleLicenses(capsuleId: string): CapsuleLicense[] {
    return Array.from(this.licenses.values())
      .filter(license => license.capsuleId === capsuleId);
  }

  /**
   * Get user's licenses (as licensee)
   */
  getUserLicenses(userAddress: string): CapsuleLicense[] {
    return Array.from(this.licenses.values())
      .filter(license => license.licensedTo === userAddress);
  }

  /**
   * Check if user has valid license for capsule
   */
  hasValidLicense(capsuleId: string, userAddress: string): boolean {
    const userLicenses = this.getUserLicenses(userAddress);
    const capsuleLicense = userLicenses.find(license => 
      license.capsuleId === capsuleId && 
      (!license.expiresAt || license.expiresAt > Date.now())
    );
    
    return !!capsuleLicense;
  }

  // Private helper methods

  private getDefaultPermissions(licenseType: string): CapsuleLicense['permissions'] {
    const permissionPresets = {
      'standard': {
        redistribute: false,
        commercialUse: false,
        modification: false,
        attribution: true
      },
      'commercial': {
        redistribute: true,
        commercialUse: true,
        modification: false,
        attribution: true
      },
      'exclusive': {
        redistribute: true,
        commercialUse: true,
        modification: true,
        attribution: true
      },
      'creative_commons': {
        redistribute: true,
        commercialUse: false,
        modification: true,
        attribution: true
      }
    };

    return permissionPresets[licenseType as keyof typeof permissionPresets] || permissionPresets.standard;
  }

  private getDefaultRoyaltyRate(licenseType: string): number {
    const royaltyRates = {
      'standard': 5,
      'commercial': 15,
      'exclusive': 25,
      'creative_commons': 0
    };

    return royaltyRates[licenseType as keyof typeof royaltyRates] || 5;
  }

  private calculateComplianceScore(licenseData: any): number {
    let score = 50; // Base score

    // Higher grief score increases compliance
    if (licenseData.griefScore >= 8) score += 30;
    else if (licenseData.griefScore >= 6) score += 20;
    else if (licenseData.griefScore >= 4) score += 10;

    // Higher truth confidence increases compliance
    if (licenseData.truthConfidence >= 90) score += 20;
    else if (licenseData.truthConfidence >= 70) score += 10;

    return Math.min(100, score);
  }

  private calculateLicenseHash(license: CapsuleLicense): string {
    const hashInput = JSON.stringify({
      capsuleId: license.capsuleId,
      author: license.author,
      griefScore: license.griefScore,
      timestamp: license.issuedAt
    });
    
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }
}

// Export singleton instance
export const capsuleLicenseManager = new CapsuleLicenseManager();

// Export convenience function for simple license generation
export function generateCapsuleLicense(licenseData: {
  capsuleId: string;
  author: string;
  griefScore: number;
  truthConfidence?: number;
}): CapsuleLicense {
  return capsuleLicenseManager.generateCapsuleLicense({
    ...licenseData,
    truthConfidence: licenseData.truthConfidence || 85
  });
}