/**
 * Archive Certificate Generation System
 * Creates official certificates for archived truth capsules with blockchain verification
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import crypto from 'crypto';
import { createCanvas } from 'canvas';

export interface ArchiveCertificateData {
  capsuleId: string;
  title: string;
  author: string;
  archivalDate: number;
  griefScore: number;
  truthConfidence: number;
  validatorSignatures: string[];
  ipfsHash?: string;
  blockchainTxHash?: string;
  certificationLevel: 'standard' | 'premium' | 'sovereign';
  metadata?: {
    category: string;
    emotionalResonance?: number;
    witnessCount?: number;
    expertEndorsements?: string[];
    legalStatus?: string;
  };
}

export interface CertificateOptions {
  format: 'pdf' | 'png' | 'svg';
  template: 'standard' | 'premium' | 'legal' | 'commemorative';
  includePlatformBranding: boolean;
  includeQRCode: boolean;
  customWatermark?: string;
  language: string;
  colorScheme: 'light' | 'dark' | 'quantum';
}

export class ArchiveCertificateGenerator {
  private readonly CERT_VERSION = "2.1.0";
  private readonly DEFAULT_OPTIONS: CertificateOptions = {
    format: 'pdf',
    template: 'standard',
    includePlatformBranding: true,
    includeQRCode: true,
    language: 'en',
    colorScheme: 'quantum'
  };

  /**
   * Generate archive certificate for a truth capsule
   */
  async generateCertificate(
    data: ArchiveCertificateData,
    options: Partial<CertificateOptions> = {}
  ): Promise<{
    success: boolean;
    certificatePath?: string;
    certificateHash?: string;
    verificationUrl?: string;
    error?: string;
  }> {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options };
      
      console.log(`📜 Generating ${opts.template} archive certificate for capsule: ${data.capsuleId}`);
      
      // Generate certificate hash for verification
      const certHash = this.generateCertificateHash(data);
      
      // Create certificate based on format
      const certificatePath = await this.createCertificate(data, opts, certHash);
      
      // Generate verification URL
      const verificationUrl = this.generateVerificationUrl(certHash, data.capsuleId);
      
      console.log(`✅ Archive certificate generated successfully`);
      console.log(`📁 Certificate path: ${certificatePath}`);
      console.log(`🔗 Verification URL: ${verificationUrl}`);
      
      return {
        success: true,
        certificatePath,
        certificateHash: certHash,
        verificationUrl
      };
      
    } catch (error) {
      console.error('❌ Certificate generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown certificate generation error'
      };
    }
  }

  /**
   * Generate batch certificates for multiple capsules
   */
  async generateBatchCertificates(
    capsules: ArchiveCertificateData[],
    options: Partial<CertificateOptions> = {}
  ): Promise<{
    success: boolean;
    certificates?: Array<{
      capsuleId: string;
      certificatePath: string;
      certificateHash: string;
    }>;
    errors?: Array<{
      capsuleId: string;
      error: string;
    }>;
  }> {
    const certificates: Array<{
      capsuleId: string;
      certificatePath: string;
      certificateHash: string;
    }> = [];
    
    const errors: Array<{
      capsuleId: string;
      error: string;
    }> = [];

    console.log(`📜 Generating batch certificates for ${capsules.length} capsules`);

    for (const capsule of capsules) {
      try {
        const result = await this.generateCertificate(capsule, options);
        
        if (result.success && result.certificatePath && result.certificateHash) {
          certificates.push({
            capsuleId: capsule.capsuleId,
            certificatePath: result.certificatePath,
            certificateHash: result.certificateHash
          });
        } else {
          errors.push({
            capsuleId: capsule.capsuleId,
            error: result.error || 'Certificate generation failed'
          });
        }
      } catch (error) {
        errors.push({
          capsuleId: capsule.capsuleId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`✅ Batch processing completed: ${certificates.length} successful, ${errors.length} errors`);

    return {
      success: certificates.length > 0,
      certificates: certificates.length > 0 ? certificates : undefined,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Verify certificate authenticity
   */
  async verifyCertificate(
    certificateHash: string,
    capsuleId: string
  ): Promise<{
    valid: boolean;
    details?: {
      capsuleId: string;
      issuedDate: number;
      verificationLevel: string;
      blockchainRecord?: string;
    };
    error?: string;
  }> {
    try {
      // In production, this would verify against blockchain records
      console.log(`🔍 Verifying certificate: ${certificateHash} for capsule: ${capsuleId}`);
      
      // Mock verification - in production, check blockchain and database
      const mockVerification = {
        valid: true,
        details: {
          capsuleId,
          issuedDate: Date.now() - 86400000, // 1 day ago
          verificationLevel: 'blockchain_verified',
          blockchainRecord: `0x${certificateHash.slice(0, 40)}`
        }
      };

      return mockVerification;
      
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  // Private helper methods

  private async createCertificate(
    data: ArchiveCertificateData,
    options: CertificateOptions,
    certHash: string
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `archive-cert-${data.capsuleId}-${timestamp}.${options.format}`;
    const outputPath = `./certificates/${filename}`;

    // Ensure certificates directory exists
    if (!fs.existsSync('./certificates')) {
      fs.mkdirSync('./certificates', { recursive: true });
    }

    switch (options.format) {
      case 'pdf':
        return this.createPDFCertificate(data, options, certHash, outputPath);
      case 'png':
        return this.createImageCertificate(data, options, certHash, outputPath);
      case 'svg':
        return this.createSVGCertificate(data, options, certHash, outputPath);
      default:
        throw new Error(`Unsupported certificate format: ${options.format}`);
    }
  }

  private async createPDFCertificate(
    data: ArchiveCertificateData,
    options: CertificateOptions,
    certHash: string,
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ 
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Apply color scheme
      const colors = this.getColorScheme(options.colorScheme);

      // Header
      doc.fontSize(28)
         .fillColor(colors.primary)
         .text('GuardianChain Archive Certificate', 0, 80, { align: 'center' });

      // Subtitle
      doc.fontSize(16)
         .fillColor(colors.secondary)
         .text('Official Truth Capsule Archival Certification', 0, 120, { align: 'center' });

      // Certificate level badge
      const levelText = data.certificationLevel.toUpperCase();
      doc.fontSize(12)
         .fillColor(colors.accent)
         .text(`${levelText} CERTIFICATION`, 0, 150, { align: 'center' });

      // Main content area with border
      const contentY = 200;
      doc.strokeColor(colors.border)
         .lineWidth(2)
         .rect(60, contentY, 680, 300)
         .stroke();

      // Capsule details
      doc.fontSize(14)
         .fillColor(colors.text)
         .text('Certified Truth Capsule Details:', 80, contentY + 30);

      const detailsY = contentY + 60;
      const lineHeight = 25;

      doc.fontSize(12)
         .text(`Capsule ID: ${data.capsuleId}`, 80, detailsY);
      
      doc.text(`Title: ${data.title}`, 80, detailsY + lineHeight);
      
      doc.text(`Author: ${data.author}`, 80, detailsY + lineHeight * 2);
      
      doc.text(`Archival Date: ${new Date(data.archivalDate).toLocaleDateString()}`, 80, detailsY + lineHeight * 3);
      
      doc.text(`Grief Score: ${data.griefScore}/10`, 80, detailsY + lineHeight * 4);
      
      doc.text(`Truth Confidence: ${data.truthConfidence}%`, 80, detailsY + lineHeight * 5);

      // Validation section
      doc.text(`Validator Signatures: ${data.validatorSignatures.length}`, 80, detailsY + lineHeight * 6);

      if (data.ipfsHash) {
        doc.text(`IPFS Hash: ${data.ipfsHash.slice(0, 46)}...`, 80, detailsY + lineHeight * 7);
      }

      if (data.blockchainTxHash) {
        doc.text(`Blockchain TX: ${data.blockchainTxHash.slice(0, 42)}...`, 80, detailsY + lineHeight * 8);
      }

      // Right column - metadata
      if (data.metadata) {
        doc.text('Additional Information:', 420, detailsY);
        doc.text(`Category: ${data.metadata.category}`, 420, detailsY + lineHeight);
        
        if (data.metadata.emotionalResonance) {
          doc.text(`Emotional Resonance: ${data.metadata.emotionalResonance}%`, 420, detailsY + lineHeight * 2);
        }
        
        if (data.metadata.witnessCount) {
          doc.text(`Witness Count: ${data.metadata.witnessCount}`, 420, detailsY + lineHeight * 3);
        }
        
        if (data.metadata.legalStatus) {
          doc.text(`Legal Status: ${data.metadata.legalStatus}`, 420, detailsY + lineHeight * 4);
        }
      }

      // QR Code placeholder (in production, generate actual QR code)
      if (options.includeQRCode) {
        const qrY = detailsY + lineHeight * 6;
        doc.strokeColor(colors.border)
           .rect(580, qrY, 80, 80)
           .stroke();
        
        doc.fontSize(8)
           .text('QR Code', 605, qrY + 85, { align: 'center', width: 30 });
      }

      // Footer
      const footerY = 550;
      doc.fontSize(10)
         .fillColor(colors.secondary)
         .text(`Certificate Hash: ${certHash}`, 80, footerY);
      
      doc.text(`Generated: ${new Date().toLocaleString()}`, 80, footerY + 15);
      
      doc.text(`Version: ${this.CERT_VERSION}`, 80, footerY + 30);

      // Platform branding
      if (options.includePlatformBranding) {
        doc.fontSize(8)
           .fillColor(colors.muted)
           .text('Powered by GuardianChain Truth Vault Protocol', 0, footerY + 50, { align: 'center' });
      }

      // Watermark
      if (options.customWatermark) {
        doc.fontSize(60)
           .fillColor(colors.watermark, 0.1)
           .text(options.customWatermark, 0, 300, { 
             align: 'center',
             rotate: -45
           });
      }

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async createImageCertificate(
    data: ArchiveCertificateData,
    options: CertificateOptions,
    certHash: string,
    outputPath: string
  ): Promise<string> {
    // Create canvas for certificate image
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    const colors = this.getColorScheme(options.colorScheme);

    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 1160, 760);

    // Header
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GuardianChain Archive Certificate', 600, 100);

    // Subtitle
    ctx.fillStyle = colors.secondary;
    ctx.font = '20px Arial';
    ctx.fillText('Official Truth Capsule Archival Certification', 600, 140);

    // Main content
    ctx.textAlign = 'left';
    ctx.fillStyle = colors.text;
    ctx.font = '16px Arial';
    
    const startY = 200;
    ctx.fillText(`Capsule ID: ${data.capsuleId}`, 80, startY);
    ctx.fillText(`Title: ${data.title}`, 80, startY + 40);
    ctx.fillText(`Author: ${data.author}`, 80, startY + 80);
    ctx.fillText(`Archival Date: ${new Date(data.archivalDate).toLocaleDateString()}`, 80, startY + 120);
    ctx.fillText(`Grief Score: ${data.griefScore}/10`, 80, startY + 160);
    ctx.fillText(`Truth Confidence: ${data.truthConfidence}%`, 80, startY + 200);

    // Certificate hash
    ctx.fillStyle = colors.muted;
    ctx.font = '12px Arial';
    ctx.fillText(`Certificate Hash: ${certHash}`, 80, 720);

    // Save canvas as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  }

  private async createSVGCertificate(
    data: ArchiveCertificateData,
    options: CertificateOptions,
    certHash: string,
    outputPath: string
  ): Promise<string> {
    const colors = this.getColorScheme(options.colorScheme);
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font: bold 36px Arial; fill: ${colors.primary}; text-anchor: middle; }
      .subtitle { font: 20px Arial; fill: ${colors.secondary}; text-anchor: middle; }
      .content { font: 16px Arial; fill: ${colors.text}; }
      .hash { font: 12px Arial; fill: ${colors.muted}; }
    </style>
  </defs>
  
  <rect x="20" y="20" width="1160" height="760" fill="${colors.background}" stroke="${colors.border}" stroke-width="4"/>
  
  <text x="600" y="100" class="title">GuardianChain Archive Certificate</text>
  <text x="600" y="140" class="subtitle">Official Truth Capsule Archival Certification</text>
  
  <text x="80" y="200" class="content">Capsule ID: ${data.capsuleId}</text>
  <text x="80" y="240" class="content">Title: ${data.title}</text>
  <text x="80" y="280" class="content">Author: ${data.author}</text>
  <text x="80" y="320" class="content">Archival Date: ${new Date(data.archivalDate).toLocaleDateString()}</text>
  <text x="80" y="360" class="content">Grief Score: ${data.griefScore}/10</text>
  <text x="80" y="400" class="content">Truth Confidence: ${data.truthConfidence}%</text>
  
  <text x="80" y="720" class="hash">Certificate Hash: ${certHash}</text>
</svg>`;

    fs.writeFileSync(outputPath, svgContent);
    return outputPath;
  }

  private generateCertificateHash(data: ArchiveCertificateData): string {
    const hashInput = JSON.stringify({
      capsuleId: data.capsuleId,
      title: data.title,
      author: data.author,
      archivalDate: data.archivalDate,
      griefScore: data.griefScore,
      truthConfidence: data.truthConfidence,
      timestamp: Date.now()
    });

    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  private generateVerificationUrl(certHash: string, capsuleId: string): string {
    return `https://verify.guardianchain.app/certificate/${certHash}?capsule=${capsuleId}`;
  }

  private getColorScheme(scheme: string): Record<string, string> {
    const schemes = {
      light: {
        background: '#ffffff',
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#3182ce',
        text: '#2d3748',
        muted: '#718096',
        border: '#cbd5e0',
        watermark: '#e2e8f0'
      },
      dark: {
        background: '#1a202c',
        primary: '#63b3ed',
        secondary: '#a0aec0',
        accent: '#4299e1',
        text: '#e2e8f0',
        muted: '#718096',
        border: '#4a5568',
        watermark: '#2d3748'
      },
      quantum: {
        background: '#0f0f23',
        primary: '#00d4ff',
        secondary: '#a855f7',
        accent: '#fbbf24',
        text: '#f1f5f9',
        muted: '#64748b',
        border: '#3b82f6',
        watermark: '#1e293b'
      }
    };

    return schemes[scheme as keyof typeof schemes] || schemes.quantum;
  }
}

// Export singleton instance
export const archiveCertificateGenerator = new ArchiveCertificateGenerator();

// Export convenience function
export async function generateArchiveCertificate(
  data: ArchiveCertificateData,
  options: Partial<CertificateOptions> = {}
): Promise<{
  success: boolean;
  certificatePath?: string;
  certificateHash?: string;
  verificationUrl?: string;
  error?: string;
}> {
  return archiveCertificateGenerator.generateCertificate(data, options);
}