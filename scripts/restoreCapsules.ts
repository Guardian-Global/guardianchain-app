/**
 * Enhanced Capsule Restore System
 * Provides restoration capabilities with validation and recovery options
 */

import { capsuleBackup, type CapsuleBackup, type BackupManifest } from "./backupCapsules";

export interface RestoreOptions {
  backupPath: string;
  decryptionKey?: string;
  validateChecksums?: boolean;
  targetDirectory?: string;
  overwriteExisting?: boolean;
  selectiveRestore?: {
    capsuleIds?: string[];
    types?: string[];
    griefScoreRange?: { min?: number; max?: number };
    dateRange?: { start?: number; end?: number };
  };
  createRecoveryPoint?: boolean;
  dryRun?: boolean;
}

export interface RestoreResult {
  success: boolean;
  restoredCount?: number;
  skippedCount?: number;
  errorCount?: number;
  capsules?: CapsuleBackup[];
  manifest?: BackupManifest;
  errors?: string[];
  warnings?: string[];
  recoveryPointPath?: string;
}

export class CapsuleRestoreManager {
  /**
   * Restore capsules from backup with advanced options
   */
  async restoreCapsules(options: RestoreOptions): Promise<RestoreResult> {
    try {
      console.log(`🔄 Starting capsule restoration from: ${options.backupPath}`);
      
      // Validate backup file exists
      if (!require('fs').existsSync(options.backupPath)) {
        return {
          success: false,
          errors: [`Backup file not found: ${options.backupPath}`]
        };
      }

      // Create recovery point if requested
      let recoveryPointPath: string | undefined;
      if (options.createRecoveryPoint) {
        recoveryPointPath = await this.createRecoveryPoint();
        console.log(`📝 Recovery point created: ${recoveryPointPath}`);
      }

      // Restore from backup
      const restoreResult = await capsuleBackup.restoreCapsules(options.backupPath, {
        decryptionKey: options.decryptionKey,
        validateChecksums: options.validateChecksums ?? true
      });

      if (!restoreResult.success) {
        return {
          success: false,
          errors: [restoreResult.error || "Restore operation failed"],
          recoveryPointPath
        };
      }

      const { capsules, manifest } = restoreResult;
      if (!capsules) {
        return {
          success: false,
          errors: ["No capsules found in backup"],
          recoveryPointPath
        };
      }

      // Apply selective restore filters if specified
      const filteredCapsules = this.applySelectiveFilters(capsules, options.selectiveRestore);
      
      // Handle dry run
      if (options.dryRun) {
        console.log(`🔍 Dry run completed. Would restore ${filteredCapsules.length} capsules`);
        return {
          success: true,
          restoredCount: 0,
          capsules: filteredCapsules,
          manifest,
          warnings: [`Dry run: ${filteredCapsules.length} capsules would be restored`],
          recoveryPointPath
        };
      }

      // Process restoration
      const processResult = await this.processCapsuleRestoration(
        filteredCapsules,
        options
      );

      console.log(`✅ Restoration completed successfully`);
      console.log(`📊 Restored: ${processResult.restoredCount}, Skipped: ${processResult.skippedCount}, Errors: ${processResult.errorCount}`);

      return {
        success: true,
        ...processResult,
        capsules: filteredCapsules,
        manifest,
        recoveryPointPath
      };

    } catch (error) {
      console.error('❌ Restore operation failed:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown restore error']
      };
    }
  }

  /**
   * Verify backup before restoration
   */
  async verifyBackup(backupPath: string): Promise<{
    valid: boolean;
    manifest?: BackupManifest;
    capsuleCount?: number;
    issues?: string[];
    recommendations?: string[];
  }> {
    try {
      const verification = await capsuleBackup.verifyBackup(backupPath);
      
      if (!verification.valid) {
        return {
          valid: false,
          issues: [verification.error || "Backup verification failed"]
        };
      }

      // Try to read manifest and capsule data
      const restoreResult = await capsuleBackup.restoreCapsules(backupPath, {
        validateChecksums: false // Don't validate checksums during verification
      });

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for potential issues
      if (restoreResult.capsules) {
        const capsules = restoreResult.capsules;
        
        // Check for very old capsules
        const oldCapsules = capsules.filter(c => 
          Date.now() - c.timestamp > 365 * 24 * 60 * 60 * 1000 // Older than 1 year
        );
        
        if (oldCapsules.length > 0) {
          recommendations.push(`${oldCapsules.length} capsules are over 1 year old`);
        }

        // Check for missing metadata
        const missingMetadata = capsules.filter(c => !c.metadata);
        if (missingMetadata.length > 0) {
          issues.push(`${missingMetadata.length} capsules missing metadata`);
        }

        // Check grief score distribution
        const lowGriefCapsules = capsules.filter(c => c.griefScore < 5);
        if (lowGriefCapsules.length > capsules.length * 0.5) {
          recommendations.push("More than 50% of capsules have low grief scores");
        }
      }

      return {
        valid: true,
        manifest: restoreResult.manifest,
        capsuleCount: restoreResult.capsules?.length || 0,
        issues: issues.length > 0 ? issues : undefined,
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };

    } catch (error) {
      return {
        valid: false,
        issues: [error instanceof Error ? error.message : 'Verification failed']
      };
    }
  }

  /**
   * Create incremental restore (only restore new/modified capsules)
   */
  async incrementalRestore(
    backupPath: string,
    lastRestoreTimestamp: number,
    options: Omit<RestoreOptions, 'backupPath'> = {}
  ): Promise<RestoreResult> {
    const incrementalOptions: RestoreOptions = {
      ...options,
      backupPath,
      selectiveRestore: {
        ...options.selectiveRestore,
        dateRange: {
          start: lastRestoreTimestamp,
          ...options.selectiveRestore?.dateRange
        }
      }
    };

    return this.restoreCapsules(incrementalOptions);
  }

  /**
   * Merge multiple backups during restoration
   */
  async mergeBackups(
    backupPaths: string[],
    outputOptions: Omit<RestoreOptions, 'backupPath'> = {}
  ): Promise<RestoreResult> {
    try {
      console.log(`🔄 Merging ${backupPaths.length} backups`);
      
      const allCapsules: CapsuleBackup[] = [];
      const manifests: BackupManifest[] = [];
      const errors: string[] = [];

      // Restore from each backup
      for (const backupPath of backupPaths) {
        try {
          const result = await capsuleBackup.restoreCapsules(backupPath);
          if (result.success && result.capsules && result.manifest) {
            allCapsules.push(...result.capsules);
            manifests.push(result.manifest);
          } else {
            errors.push(`Failed to restore from ${backupPath}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Error processing ${backupPath}: ${error}`);
        }
      }

      if (allCapsules.length === 0) {
        return {
          success: false,
          errors: ["No capsules found in any backup", ...errors]
        };
      }

      // Remove duplicates based on capsule ID
      const uniqueCapsules = this.removeDuplicateCapsules(allCapsules);
      console.log(`📊 Merged ${allCapsules.length} capsules, ${uniqueCapsules.length} unique`);

      // Process the merged capsules
      const processResult = await this.processCapsuleRestoration(
        uniqueCapsules,
        { ...outputOptions, backupPath: 'merged' }
      );

      return {
        success: true,
        ...processResult,
        capsules: uniqueCapsules,
        warnings: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Merge operation failed']
      };
    }
  }

  // Private helper methods

  private applySelectiveFilters(
    capsules: CapsuleBackup[],
    filters?: RestoreOptions['selectiveRestore']
  ): CapsuleBackup[] {
    if (!filters) return capsules;

    return capsules.filter(capsule => {
      // Filter by capsule IDs
      if (filters.capsuleIds && filters.capsuleIds.length > 0) {
        if (!filters.capsuleIds.includes(capsule.id)) return false;
      }

      // Filter by types
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(capsule.type)) return false;
      }

      // Filter by grief score range
      if (filters.griefScoreRange) {
        if (filters.griefScoreRange.min !== undefined && 
            capsule.griefScore < filters.griefScoreRange.min) return false;
        if (filters.griefScoreRange.max !== undefined && 
            capsule.griefScore > filters.griefScoreRange.max) return false;
      }

      // Filter by date range
      if (filters.dateRange) {
        if (filters.dateRange.start !== undefined && 
            capsule.timestamp < filters.dateRange.start) return false;
        if (filters.dateRange.end !== undefined && 
            capsule.timestamp > filters.dateRange.end) return false;
      }

      return true;
    });
  }

  private async processCapsuleRestoration(
    capsules: CapsuleBackup[],
    options: RestoreOptions
  ): Promise<{
    restoredCount: number;
    skippedCount: number;
    errorCount: number;
    errors?: string[];
  }> {
    let restoredCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const capsule of capsules) {
      try {
        // Check if capsule already exists (in production, query database)
        const exists = await this.capsuleExists(capsule.id);
        
        if (exists && !options.overwriteExisting) {
          skippedCount++;
          continue;
        }

        // Restore the capsule (in production, insert into database)
        await this.restoreCapsule(capsule);
        restoredCount++;

      } catch (error) {
        errorCount++;
        errors.push(`Failed to restore capsule ${capsule.id}: ${error}`);
      }
    }

    return {
      restoredCount,
      skippedCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async createRecoveryPoint(): Promise<string> {
    // In production, this would create a backup of current state
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const recoveryPath = `./recovery-point-${timestamp}.json`;
    
    // Mock recovery point creation
    require('fs').writeFileSync(recoveryPath, JSON.stringify({
      type: 'recovery_point',
      timestamp: Date.now(),
      created_before_restore: true,
      note: 'Auto-generated recovery point before restore operation'
    }, null, 2));

    return recoveryPath;
  }

  private removeDuplicateCapsules(capsules: CapsuleBackup[]): CapsuleBackup[] {
    const seen = new Set<string>();
    const unique: CapsuleBackup[] = [];

    // Sort by timestamp (newest first) to prefer more recent versions
    const sorted = [...capsules].sort((a, b) => b.timestamp - a.timestamp);

    for (const capsule of sorted) {
      if (!seen.has(capsule.id)) {
        seen.add(capsule.id);
        unique.push(capsule);
      }
    }

    return unique;
  }

  private async capsuleExists(capsuleId: string): Promise<boolean> {
    // Mock existence check - in production, query database
    return false; // Always restore for development
  }

  private async restoreCapsule(capsule: CapsuleBackup): Promise<void> {
    // Mock capsule restoration - in production, insert into database
    console.log(`💾 Restoring capsule: ${capsule.title} (${capsule.id})`);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

// Export singleton instance
export const capsuleRestore = new CapsuleRestoreManager();

// Export convenience function for simple restore
export async function restoreCapsules(
  backupPath: string,
  options: Omit<RestoreOptions, 'backupPath'> = {}
): Promise<RestoreResult> {
  return capsuleRestore.restoreCapsules({
    ...options,
    backupPath
  });
}