/**
 * Enhanced Capsule Backup System
 * Provides comprehensive backup, restore, and archival capabilities for GuardianChain capsules
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface CapsuleBackup {
  id: string;
  title: string;
  content: string;
  griefScore: number;
  author: string;
  timestamp: number;
  type: string;
  metadata: {
    ipfsHash?: string;
    emotionalResonance?: number;
    truthConfidence?: number;
    encrypted?: boolean;
    backupVersion?: string;
  };
  verification?: {
    signature?: string;
    witnessCount?: number;
    validatorApprovals?: string[];
  };
  lineage?: {
    parentCapsule?: string;
    childCapsules?: string[];
    influenceScore?: number;
  };
}

export interface BackupManifest {
  version: string;
  timestamp: number;
  totalCapsules: number;
  backupType: 'full' | 'incremental' | 'selective';
  compressionUsed: boolean;
  encryptionUsed: boolean;
  checksums: {
    manifest: string;
    data: string;
    combined: string;
  };
  metadata: {
    source: string;
    creator: string;
    description?: string;
    tags?: string[];
  };
}

export interface BackupOptions {
  outputPath?: string;
  compress?: boolean;
  encrypt?: boolean;
  encryptionKey?: string;
  includeMetadata?: boolean;
  filterByType?: string[];
  filterByGriefScore?: { min?: number; max?: number };
  filterByDateRange?: { start?: number; end?: number };
  batchSize?: number;
  createManifest?: boolean;
}

export class CapsuleBackupManager {
  private readonly DEFAULT_BACKUP_DIR = "./backups";
  private readonly BACKUP_VERSION = "2.1.0";

  /**
   * Create comprehensive backup of capsules
   */
  async backupCapsules(
    capsules: CapsuleBackup[], 
    options: BackupOptions = {}
  ): Promise<{ success: boolean; backupPath?: string; manifest?: BackupManifest; error?: string }> {
    try {
      // Set default options
      const opts: Required<BackupOptions> = {
        outputPath: options.outputPath || this.generateBackupPath(),
        compress: options.compress ?? true,
        encrypt: options.encrypt ?? false,
        encryptionKey: options.encryptionKey || this.generateEncryptionKey(),
        includeMetadata: options.includeMetadata ?? true,
        filterByType: options.filterByType || [],
        filterByGriefScore: options.filterByGriefScore || {},
        filterByDateRange: options.filterByDateRange || {},
        batchSize: options.batchSize || 1000,
        createManifest: options.createManifest ?? true
      };

      // Ensure backup directory exists
      const backupDir = path.dirname(opts.outputPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Filter capsules based on options
      const filteredCapsules = this.filterCapsules(capsules, opts);
      
      if (filteredCapsules.length === 0) {
        return { success: false, error: "No capsules match the specified filters" };
      }

      // Prepare backup data
      const backupData = this.prepareBackupData(filteredCapsules, opts);
      
      // Create checksums
      const dataChecksum = this.createChecksum(JSON.stringify(backupData));
      
      // Create manifest
      const manifest: BackupManifest = {
        version: this.BACKUP_VERSION,
        timestamp: Date.now(),
        totalCapsules: filteredCapsules.length,
        backupType: this.determineBackupType(filteredCapsules, capsules),
        compressionUsed: opts.compress,
        encryptionUsed: opts.encrypt,
        checksums: {
          manifest: '',
          data: dataChecksum,
          combined: ''
        },
        metadata: {
          source: 'GuardianChain',
          creator: 'CapsuleBackupManager',
          description: `Backup of ${filteredCapsules.length} capsules`,
          tags: this.generateBackupTags(filteredCapsules)
        }
      };

      const manifestChecksum = this.createChecksum(JSON.stringify(manifest));
      manifest.checksums.manifest = manifestChecksum;
      manifest.checksums.combined = this.createChecksum(manifestChecksum + dataChecksum);

      // Prepare final backup package
      const backupPackage = {
        manifest,
        data: backupData,
        metadata: opts.includeMetadata ? this.generateBackupMetadata(filteredCapsules) : null
      };

      // Apply compression if requested
      let finalData = JSON.stringify(backupPackage, null, 2);
      if (opts.compress) {
        finalData = this.compressData(finalData);
      }

      // Apply encryption if requested
      if (opts.encrypt) {
        finalData = this.encryptData(finalData, opts.encryptionKey);
      }

      // Write backup to file
      fs.writeFileSync(opts.outputPath, finalData);

      console.log(`✅ Capsule backup completed successfully`);
      console.log(`📁 Backup saved to: ${opts.outputPath}`);
      console.log(`📊 Total capsules: ${filteredCapsules.length}`);
      console.log(`🗜️ Compression: ${opts.compress ? 'enabled' : 'disabled'}`);
      console.log(`🔐 Encryption: ${opts.encrypt ? 'enabled' : 'disabled'}`);

      return {
        success: true,
        backupPath: opts.outputPath,
        manifest
      };

    } catch (error) {
      console.error('❌ Backup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown backup error'
      };
    }
  }

  /**
   * Restore capsules from backup
   */
  async restoreCapsules(
    backupPath: string,
    options: { decryptionKey?: string; validateChecksums?: boolean } = {}
  ): Promise<{ success: boolean; capsules?: CapsuleBackup[]; manifest?: BackupManifest; error?: string }> {
    try {
      if (!fs.existsSync(backupPath)) {
        return { success: false, error: "Backup file not found" };
      }

      // Read backup file
      let backupData = fs.readFileSync(backupPath, 'utf8');

      // Try to decrypt if needed
      if (options.decryptionKey) {
        try {
          backupData = this.decryptData(backupData, options.decryptionKey);
        } catch (error) {
          return { success: false, error: "Failed to decrypt backup - invalid key" };
        }
      }

      // Try to decompress if needed
      try {
        backupData = this.decompressData(backupData);
      } catch {
        // Data might not be compressed, continue with original
      }

      // Parse backup package
      const backupPackage = JSON.parse(backupData);
      const { manifest, data: capsules } = backupPackage;

      // Validate checksums if requested
      if (options.validateChecksums && manifest.checksums) {
        const dataChecksum = this.createChecksum(JSON.stringify(capsules));
        if (dataChecksum !== manifest.checksums.data) {
          return { success: false, error: "Backup data integrity check failed" };
        }
      }

      console.log(`✅ Backup restored successfully`);
      console.log(`📊 Restored capsules: ${capsules.length}`);
      console.log(`📅 Backup created: ${new Date(manifest.timestamp).toLocaleString()}`);
      console.log(`🔢 Backup version: ${manifest.version}`);

      return {
        success: true,
        capsules,
        manifest
      };

    } catch (error) {
      console.error('❌ Restore failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown restore error'
      };
    }
  }

  /**
   * Create incremental backup based on timestamp
   */
  async createIncrementalBackup(
    allCapsules: CapsuleBackup[],
    lastBackupTimestamp: number,
    outputPath?: string
  ): Promise<{ success: boolean; backupPath?: string; newCapsules?: number }> {
    const newCapsules = allCapsules.filter(capsule => capsule.timestamp > lastBackupTimestamp);
    
    if (newCapsules.length === 0) {
      console.log('ℹ️  No new capsules to backup');
      return { success: true, newCapsules: 0 };
    }

    const result = await this.backupCapsules(newCapsules, {
      outputPath: outputPath || this.generateIncrementalBackupPath(lastBackupTimestamp),
      compress: true,
      includeMetadata: true
    });

    return {
      ...result,
      newCapsules: newCapsules.length
    };
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupPath: string): Promise<{
    valid: boolean;
    details: {
      fileExists: boolean;
      validJson: boolean;
      hasManifest: boolean;
      checksumMatch: boolean;
      versionSupported: boolean;
    };
    error?: string;
  }> {
    const details = {
      fileExists: false,
      validJson: false,
      hasManifest: false,
      checksumMatch: false,
      versionSupported: false
    };

    try {
      // Check if file exists
      details.fileExists = fs.existsSync(backupPath);
      if (!details.fileExists) {
        return { valid: false, details, error: "Backup file not found" };
      }

      // Try to parse JSON
      const backupData = fs.readFileSync(backupPath, 'utf8');
      let backupPackage;
      
      try {
        // Try decompression first
        const decompressed = this.decompressData(backupData);
        backupPackage = JSON.parse(decompressed);
      } catch {
        try {
          backupPackage = JSON.parse(backupData);
        } catch {
          return { valid: false, details, error: "Invalid JSON format" };
        }
      }
      
      details.validJson = true;

      // Check for manifest
      details.hasManifest = !!backupPackage.manifest;
      if (!details.hasManifest) {
        return { valid: false, details, error: "Missing backup manifest" };
      }

      // Check version compatibility
      const manifest = backupPackage.manifest;
      details.versionSupported = this.isVersionSupported(manifest.version);
      
      // Verify checksums
      if (manifest.checksums && backupPackage.data) {
        const dataChecksum = this.createChecksum(JSON.stringify(backupPackage.data));
        details.checksumMatch = dataChecksum === manifest.checksums.data;
      }

      const valid = Object.values(details).every(Boolean);
      return { valid, details };

    } catch (error) {
      return {
        valid: false,
        details,
        error: error instanceof Error ? error.message : 'Unknown verification error'
      };
    }
  }

  /**
   * Generate backup statistics
   */
  generateBackupStats(capsules: CapsuleBackup[]): {
    total: number;
    byType: Record<string, number>;
    byGriefScore: Record<string, number>;
    averageGriefScore: number;
    dateRange: { earliest: number; latest: number };
    sizeEstimate: string;
  } {
    const byType: Record<string, number> = {};
    const byGriefScore: Record<string, number> = {};
    let totalGriefScore = 0;
    let earliest = Number.MAX_SAFE_INTEGER;
    let latest = 0;

    capsules.forEach(capsule => {
      // Count by type
      byType[capsule.type] = (byType[capsule.type] || 0) + 1;
      
      // Count by grief score range
      const scoreRange = `${Math.floor(capsule.griefScore)}-${Math.floor(capsule.griefScore) + 1}`;
      byGriefScore[scoreRange] = (byGriefScore[scoreRange] || 0) + 1;
      
      totalGriefScore += capsule.griefScore;
      
      if (capsule.timestamp < earliest) earliest = capsule.timestamp;
      if (capsule.timestamp > latest) latest = capsule.timestamp;
    });

    const sizeEstimate = this.estimateBackupSize(capsules);

    return {
      total: capsules.length,
      byType,
      byGriefScore,
      averageGriefScore: capsules.length > 0 ? totalGriefScore / capsules.length : 0,
      dateRange: { earliest, latest },
      sizeEstimate
    };
  }

  // Private helper methods

  private filterCapsules(capsules: CapsuleBackup[], options: Required<BackupOptions>): CapsuleBackup[] {
    return capsules.filter(capsule => {
      // Filter by type
      if (options.filterByType.length > 0 && !options.filterByType.includes(capsule.type)) {
        return false;
      }

      // Filter by grief score
      if (options.filterByGriefScore.min !== undefined && capsule.griefScore < options.filterByGriefScore.min) {
        return false;
      }
      if (options.filterByGriefScore.max !== undefined && capsule.griefScore > options.filterByGriefScore.max) {
        return false;
      }

      // Filter by date range
      if (options.filterByDateRange.start !== undefined && capsule.timestamp < options.filterByDateRange.start) {
        return false;
      }
      if (options.filterByDateRange.end !== undefined && capsule.timestamp > options.filterByDateRange.end) {
        return false;
      }

      return true;
    });
  }

  private prepareBackupData(capsules: CapsuleBackup[], options: Required<BackupOptions>): CapsuleBackup[] {
    return capsules.map(capsule => ({
      ...capsule,
      metadata: {
        ...capsule.metadata,
        backupVersion: this.BACKUP_VERSION
      }
    }));
  }

  private generateBackupPath(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.DEFAULT_BACKUP_DIR, `capsule-backup-${timestamp}.json`);
  }

  private generateIncrementalBackupPath(lastBackupTimestamp: number): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const lastDate = new Date(lastBackupTimestamp).toISOString().split('T')[0];
    return path.join(this.DEFAULT_BACKUP_DIR, `capsule-incremental-${lastDate}-to-${timestamp}.json`);
  }

  private createChecksum(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private compressData(data: string): string {
    // Simple compression placeholder - in production, use actual compression library
    return Buffer.from(data).toString('base64');
  }

  private decompressData(data: string): string {
    try {
      return Buffer.from(data, 'base64').toString('utf8');
    } catch {
      return data; // Return original if not compressed
    }
  }

  private encryptData(data: string, key: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptData(data: string, key: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private determineBackupType(filtered: CapsuleBackup[], all: CapsuleBackup[]): 'full' | 'incremental' | 'selective' {
    if (filtered.length === all.length) return 'full';
    if (filtered.length < all.length * 0.5) return 'selective';
    return 'incremental';
  }

  private generateBackupTags(capsules: CapsuleBackup[]): string[] {
    const types = Array.from(new Set(capsules.map(c => c.type)));
    const hasHighGrief = capsules.some(c => c.griefScore >= 8);
    const hasRecent = capsules.some(c => Date.now() - c.timestamp < 7 * 24 * 60 * 60 * 1000);
    
    const tags = [...types];
    if (hasHighGrief) tags.push('high-grief');
    if (hasRecent) tags.push('recent');
    
    return tags;
  }

  private generateBackupMetadata(capsules: CapsuleBackup[]) {
    return {
      createdAt: new Date().toISOString(),
      totalSize: this.estimateBackupSize(capsules),
      statistics: this.generateBackupStats(capsules)
    };
  }

  private estimateBackupSize(capsules: CapsuleBackup[]): string {
    const avgCapsuleSize = 2048; // Estimated average size per capsule in bytes
    const totalBytes = capsules.length * avgCapsuleSize;
    
    if (totalBytes < 1024) return `${totalBytes} bytes`;
    if (totalBytes < 1024 * 1024) return `${Math.round(totalBytes / 1024)} KB`;
    return `${Math.round(totalBytes / (1024 * 1024))} MB`;
  }

  private isVersionSupported(version: string): boolean {
    // Simple version check - in production, implement proper semver comparison
    const supportedVersions = ['2.0.0', '2.1.0'];
    return supportedVersions.includes(version);
  }
}

// Export singleton instance
export const capsuleBackup = new CapsuleBackupManager();

// Export convenience function for simple backups
export function backupCapsules(
  capsules: CapsuleBackup[], 
  outputPath: string = `./capsule-backup-${Date.now()}.json`
): void {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "2.1.0",
      capsules: capsules
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(backupData, null, 2));
    console.log("✅ Capsule backup saved to", outputPath);
    console.log(`📊 Backed up ${capsules.length} capsules`);
  } catch (error) {
    console.error("❌ Backup failed:", error);
    throw error;
  }
}