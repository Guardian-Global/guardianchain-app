/**
 * CSV Export Utility for GuardianChain Audit Reports
 * Generates comprehensive audit reports in CSV format for compliance and analysis
 */

import fs from "fs";
import path from "path";

export interface AuditRecord {
  capsuleId: string;
  title: string;
  griefScore: number;
  chain: string;
  unlocked: boolean;
  zkValid?: boolean;
  confidenceScore?: number;
  boostType?: string;
  timeReduction?: number;
  timestamp: string;
  errors?: string[];
  [key: string]: any; // Allow additional fields
}

export interface ExportOptions {
  outputPath?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  encoding?: BufferEncoding;
  formatNumbers?: boolean;
}

/**
 * Convert audit data to CSV format
 * @param auditData - Array of audit records
 * @param options - Export options
 * @returns CSV string
 */
function convertToCSV(auditData: AuditRecord[], options: ExportOptions = {}): string {
  const {
    includeHeaders = true,
    delimiter = ',',
    formatNumbers = true
  } = options;

  if (auditData.length === 0) {
    return includeHeaders ? 'No data available\n' : '';
  }

  // Define standard fields and their order
  const standardFields = [
    'capsuleId',
    'title', 
    'griefScore',
    'chain',
    'unlocked',
    'zkValid',
    'confidenceScore',
    'boostType',
    'timeReduction',
    'timestamp',
    'errors'
  ];

  // Get all unique fields from the data
  const allFields = new Set<string>();
  auditData.forEach(record => {
    Object.keys(record).forEach(key => allFields.add(key));
  });

  // Combine standard fields with any additional fields
  const orderedFields = [
    ...standardFields.filter(field => allFields.has(field)),
    ...Array.from(allFields).filter(field => !standardFields.includes(field))
  ];

  const lines: string[] = [];

  // Add headers if requested
  if (includeHeaders) {
    const headers = orderedFields.map(field => 
      field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
    );
    lines.push(headers.join(delimiter));
  }

  // Process each record
  auditData.forEach(record => {
    const values = orderedFields.map(field => {
      const value = record[field];
      
      if (value === null || value === undefined) {
        return '';
      }

      // Handle arrays (like errors)
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }

      // Handle objects
      if (typeof value === 'object') {
        return `"${JSON.stringify(value)}"`;
      }

      // Handle booleans
      if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
      }

      // Handle numbers
      if (typeof value === 'number') {
        if (formatNumbers) {
          // Format confidence scores as percentages
          if (field === 'confidenceScore') {
            return `${value.toFixed(1)}%`;
          }
          // Format time reductions in readable format
          if (field === 'timeReduction' && value > 0) {
            return formatTimeReduction(value);
          }
          // Round grief scores to 1 decimal
          if (field === 'griefScore') {
            return value.toFixed(1);
          }
        }
        return value.toString();
      }

      // Handle strings - escape quotes and wrap in quotes if contains delimiter
      const stringValue = value.toString();
      if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });

    lines.push(values.join(delimiter));
  });

  return lines.join('\n') + '\n';
}

/**
 * Format time reduction for human readability
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
function formatTimeReduction(milliseconds: number): string {
  if (milliseconds <= 0) return '0s';
  
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Generate audit summary statistics
 * @param auditData - Array of audit records
 * @returns Summary object
 */
function generateSummaryStats(auditData: AuditRecord[]): {
  totalRecords: number;
  unlockedCount: number;
  zkValidCount: number;
  averageGriefScore: number;
  averageConfidence: number;
  chainBreakdown: { [chain: string]: number };
  boostTypeBreakdown: { [boostType: string]: number };
  errorSummary: { [error: string]: number };
} {
  const stats = {
    totalRecords: auditData.length,
    unlockedCount: 0,
    zkValidCount: 0,
    averageGriefScore: 0,
    averageConfidence: 0,
    chainBreakdown: {} as { [chain: string]: number },
    boostTypeBreakdown: {} as { [boostType: string]: number },
    errorSummary: {} as { [error: string]: number }
  };

  if (auditData.length === 0) return stats;

  let totalGriefScore = 0;
  let totalConfidence = 0;
  let confidenceCount = 0;

  auditData.forEach(record => {
    // Count unlocked capsules
    if (record.unlocked) stats.unlockedCount++;
    
    // Count ZK valid capsules
    if (record.zkValid) stats.zkValidCount++;
    
    // Accumulate grief scores
    totalGriefScore += record.griefScore || 0;
    
    // Accumulate confidence scores
    if (typeof record.confidenceScore === 'number') {
      totalConfidence += record.confidenceScore;
      confidenceCount++;
    }
    
    // Chain breakdown
    const chain = record.chain || 'unknown';
    stats.chainBreakdown[chain] = (stats.chainBreakdown[chain] || 0) + 1;
    
    // Boost type breakdown
    if (record.boostType) {
      stats.boostTypeBreakdown[record.boostType] = (stats.boostTypeBreakdown[record.boostType] || 0) + 1;
    }
    
    // Error summary
    if (record.errors && Array.isArray(record.errors)) {
      record.errors.forEach(error => {
        stats.errorSummary[error] = (stats.errorSummary[error] || 0) + 1;
      });
    }
  });

  stats.averageGriefScore = totalGriefScore / auditData.length;
  stats.averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

  return stats;
}

/**
 * Export audit data to CSV file with comprehensive reporting
 * @param auditData - Array of audit records to export
 * @param outputPath - Optional output file path
 * @param options - Export options
 */
export function exportAuditToCSV(
  auditData: AuditRecord[], 
  outputPath: string = "./capsule-audit.csv",
  options: ExportOptions = {}
): void {
  try {
    const {
      includeHeaders = true,
      delimiter = ',',
      encoding = 'utf8',
      formatNumbers = true
    } = options;

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate CSV content
    const csvContent = convertToCSV(auditData, {
      includeHeaders,
      delimiter,
      formatNumbers
    });

    // Write to file
    fs.writeFileSync(outputPath, csvContent, encoding);

    // Generate summary statistics
    const stats = generateSummaryStats(auditData);

    // Create summary report file
    const summaryPath = outputPath.replace('.csv', '-summary.txt');
    const summaryContent = generateSummaryReport(stats, auditData.length > 0 ? auditData[0].timestamp : new Date().toISOString());
    fs.writeFileSync(summaryPath, summaryContent, encoding);

    console.log(`✅ Audit CSV exported: ${outputPath}`);
    console.log(`📊 Summary report: ${summaryPath}`);
    console.log(`📈 Records processed: ${auditData.length}`);
    
    if (stats.unlockedCount > 0) {
      console.log(`🔓 Unlocked capsules: ${stats.unlockedCount}/${stats.totalRecords} (${Math.round(stats.unlockedCount/stats.totalRecords*100)}%)`);
    }

  } catch (error) {
    console.error(`❌ Failed to export audit CSV: ${error}`);
    throw error;
  }
}

/**
 * Generate human-readable summary report
 * @param stats - Summary statistics
 * @param timestamp - Report timestamp
 * @returns Formatted summary text
 */
function generateSummaryReport(stats: any, timestamp: string): string {
  const report = [
    'GuardianChain Capsule Audit Summary Report',
    '=' .repeat(50),
    `Generated: ${new Date(timestamp).toLocaleString()}`,
    '',
    'OVERVIEW',
    '-' .repeat(20),
    `Total Capsules: ${stats.totalRecords}`,
    `Unlocked Capsules: ${stats.unlockedCount} (${Math.round(stats.unlockedCount/stats.totalRecords*100)}%)`,
    `ZK Valid Capsules: ${stats.zkValidCount} (${Math.round(stats.zkValidCount/stats.totalRecords*100)}%)`,
    `Average Grief Score: ${stats.averageGriefScore.toFixed(2)}/10`,
    `Average Confidence: ${stats.averageConfidence.toFixed(1)}%`,
    '',
    'CHAIN BREAKDOWN',
    '-' .repeat(20)
  ];

  Object.entries(stats.chainBreakdown).forEach(([chain, count]) => {
    const percentage = Math.round(((count as number) / stats.totalRecords) * 100);
    report.push(`${chain.toUpperCase()}: ${count} capsules (${percentage}%)`);
  });

  if (Object.keys(stats.boostTypeBreakdown).length > 0) {
    report.push('', 'BOOST TYPE BREAKDOWN', '-' .repeat(20));
    Object.entries(stats.boostTypeBreakdown).forEach(([boost, count]) => {
      const percentage = Math.round(((count as number) / stats.totalRecords) * 100);
      report.push(`${boost}: ${count} capsules (${percentage}%)`);
    });
  }

  if (Object.keys(stats.errorSummary).length > 0) {
    report.push('', 'ERROR SUMMARY', '-' .repeat(20));
    Object.entries(stats.errorSummary).forEach(([error, count]) => {
      report.push(`${error}: ${count} occurrences`);
    });
  }

  report.push('', 'End of Report');

  return report.join('\n');
}

/**
 * Export audit data in multiple formats
 * @param auditData - Audit data to export
 * @param basePath - Base path for output files (without extension)
 * @param formats - Array of formats to export ('csv', 'json', 'txt')
 */
export function exportMultipleFormats(
  auditData: AuditRecord[], 
  basePath: string = "./capsule-audit",
  formats: string[] = ['csv']
): void {
  formats.forEach(format => {
    const outputPath = `${basePath}.${format}`;
    
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          exportAuditToCSV(auditData, outputPath);
          break;
        case 'json':
          fs.writeFileSync(outputPath, JSON.stringify(auditData, null, 2), 'utf8');
          console.log(`✅ JSON exported: ${outputPath}`);
          break;
        case 'txt':
          const textContent = auditData.map(record => 
            `${record.capsuleId}: ${record.title} (${record.chain}) - ${record.unlocked ? 'UNLOCKED' : 'LOCKED'}`
          ).join('\n');
          fs.writeFileSync(outputPath, textContent, 'utf8');
          console.log(`✅ Text exported: ${outputPath}`);
          break;
        default:
          console.warn(`⚠️  Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error(`❌ Failed to export ${format}: ${error}`);
    }
  });
}