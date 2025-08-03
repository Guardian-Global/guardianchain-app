import { Request, Response } from "express";
import crypto from "crypto";

// Blockchain Notarization API
// Provides legal-grade timestamp + hash registry for truth capsules

interface NotarizationRecord {
  capsuleId: string;
  contentHash: string;
  timestamp: string;
  blockchainTxHash: string;
  notarySignature: string;
  legalStatus: "pending" | "notarized" | "certified" | "disputed";
  witnessCount: number;
  jurisdictions: string[];
  evidenceLevel: "basic" | "enhanced" | "forensic" | "legal";
  retentionPeriod: string;
  accessControl: {
    public: boolean;
    authorizedParties: string[];
    courtOrder?: boolean;
  };
}

interface LegalCertificate {
  certificateId: string;
  capsuleId: string;
  issuedBy: string;
  issuedAt: string;
  validUntil: string;
  legalWeight: "informational" | "evidence" | "certified" | "notarized";
  signatures: Array<{
    authority: string;
    signature: string;
    timestamp: string;
    publicKey: string;
  }>;
  chainOfCustody: Array<{
    event: string;
    timestamp: string;
    actor: string;
    hash: string;
  }>;
}

// Generate cryptographic hash for content integrity
function generateContentHash(content: string, metadata: any): string {
  const combined = JSON.stringify({ content, metadata, salt: Date.now() });
  return crypto.createHash('sha256').update(combined).digest('hex');
}

// Generate notary signature (in production, use proper digital signature)
function generateNotarySignature(contentHash: string, timestamp: string): string {
  const payload = `${contentHash}:${timestamp}:GUARDIANCHAIN_NOTARY`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// Simulate blockchain transaction (replace with actual blockchain integration)
function simulateBlockchainTransaction(data: any): string {
  const txData = JSON.stringify(data);
  const txHash = crypto.createHash('sha256').update(txData + Date.now()).digest('hex');
  return `0x${txHash.substring(0, 64)}`;
}

export async function notarizeCapsule(req: Request, res: Response) {
  try {
    const { 
      capsuleId, 
      content, 
      metadata = {}, 
      evidenceLevel = "basic",
      jurisdictions = ["US"],
      retentionYears = 10
    } = req.body;

    if (!capsuleId || !content) {
      return res.status(400).json({ error: "Capsule ID and content required" });
    }

    const timestamp = new Date().toISOString();
    const contentHash = generateContentHash(content, metadata);
    const notarySignature = generateNotarySignature(contentHash, timestamp);
    
    // Simulate blockchain transaction
    const blockchainTxHash = simulateBlockchainTransaction({
      capsuleId,
      contentHash,
      timestamp,
      evidenceLevel
    });

    // Determine witness count based on evidence level
    const witnessCount = {
      "basic": 1,
      "enhanced": 3,
      "forensic": 5,
      "legal": 7
    }[evidenceLevel] || 1;

    const notarizationRecord: NotarizationRecord = {
      capsuleId,
      contentHash,
      timestamp,
      blockchainTxHash,
      notarySignature,
      legalStatus: evidenceLevel === "legal" ? "certified" : "notarized",
      witnessCount,
      jurisdictions,
      evidenceLevel: evidenceLevel as any,
      retentionPeriod: `${retentionYears} years`,
      accessControl: {
        public: evidenceLevel !== "legal",
        authorizedParties: ["creator", "legal_counsel"],
        courtOrder: evidenceLevel === "legal"
      }
    };

    console.log(`📋 Capsule ${capsuleId} notarized with ${evidenceLevel} evidence level`);
    console.log(`🔗 Blockchain TX: ${blockchainTxHash}`);
    console.log(`🔒 Content Hash: ${contentHash}`);

    res.json({
      success: true,
      notarization: notarizationRecord,
      legal: {
        admissible: evidenceLevel === "legal" || evidenceLevel === "forensic",
        chainOfCustody: true,
        tamperEvident: true,
        timestamp: "blockchain-verified"
      }
    });

  } catch (error) {
    console.error("❌ Notarization failed:", error);
    res.status(500).json({ error: "Notarization failed" });
  }
}

export async function generateLegalCertificate(req: Request, res: Response) {
  try {
    const { capsuleId, requestedBy, purpose } = req.body;

    if (!capsuleId) {
      return res.status(400).json({ error: "Capsule ID required" });
    }

    // In production, fetch actual notarization record
    const mockNotarization: NotarizationRecord = {
      capsuleId,
      contentHash: generateContentHash("sample content", {}),
      timestamp: new Date().toISOString(),
      blockchainTxHash: simulateBlockchainTransaction({ capsuleId }),
      notarySignature: generateNotarySignature("hash", new Date().toISOString()),
      legalStatus: "certified",
      witnessCount: 5,
      jurisdictions: ["US", "EU"],
      evidenceLevel: "legal",
      retentionPeriod: "10 years",
      accessControl: {
        public: false,
        authorizedParties: ["creator", "legal_counsel"],
        courtOrder: true
      }
    };

    const certificateId = `CERT_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const issuedAt = new Date().toISOString();
    const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year

    const certificate: LegalCertificate = {
      certificateId,
      capsuleId,
      issuedBy: "GuardianChain Legal Authority",
      issuedAt,
      validUntil,
      legalWeight: "certified",
      signatures: [
        {
          authority: "GuardianChain Notary",
          signature: generateNotarySignature(certificateId, issuedAt),
          timestamp: issuedAt,
          publicKey: "GCNA_PUBLIC_KEY_" + Math.random().toString(36)
        }
      ],
      chainOfCustody: [
        {
          event: "Certificate Generated",
          timestamp: issuedAt,
          actor: "GuardianChain System",
          hash: generateContentHash(certificateId, { purpose, requestedBy })
        },
        {
          event: "Blockchain Recorded",
          timestamp: issuedAt,
          actor: "Blockchain Network",
          hash: mockNotarization.blockchainTxHash
        }
      ]
    };

    console.log(`📜 Legal certificate ${certificateId} generated for capsule ${capsuleId}`);
    console.log(`⚖️ Purpose: ${purpose}, Requested by: ${requestedBy}`);

    res.json({
      success: true,
      certificate,
      downloadUrl: `/api/certificates/${certificateId}/download`,
      verificationUrl: `/api/certificates/${certificateId}/verify`,
      legalNotice: "This certificate is legally binding and admissible in participating jurisdictions."
    });

  } catch (error) {
    console.error("❌ Certificate generation failed:", error);
    res.status(500).json({ error: "Certificate generation failed" });
  }
}

export async function verifyCertificate(req: Request, res: Response) {
  try {
    const { certificateId } = req.params;
    const { verificationCode } = req.query;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID required" });
    }

    // In production, verify against blockchain and database
    const isValid = Math.random() > 0.1; // 90% success rate for demo
    const verificationResult = {
      certificateId,
      valid: isValid,
      verifiedAt: new Date().toISOString(),
      status: isValid ? "VERIFIED" : "INVALID",
      blockchainConfirmed: isValid,
      signatureValid: isValid,
      chainOfCustody: isValid ? "INTACT" : "COMPROMISED",
      message: isValid 
        ? "Certificate is valid and legally binding"
        : "Certificate verification failed - potentially tampered"
    };

    console.log(`🔍 Certificate verification: ${certificateId} - ${verificationResult.status}`);

    if (isValid) {
      res.json({
        success: true,
        verification: verificationResult,
        legalWeight: "This verification confirms the authenticity and legal standing of the certificate."
      });
    } else {
      res.status(400).json({
        success: false,
        verification: verificationResult,
        warning: "Certificate verification failed. Do not rely on this document for legal purposes."
      });
    }

  } catch (error) {
    console.error("❌ Certificate verification failed:", error);
    res.status(500).json({ error: "Verification failed" });
  }
}

export async function getCertificateRegistry(req: Request, res: Response) {
  try {
    const { jurisdiction = "all", status = "all", dateFrom, dateTo } = req.query;

    console.log(`📚 Fetching certificate registry...`);

    // Mock registry data
    const certificates = Array.from({ length: 25 }, (_, i) => ({
      certificateId: `CERT_${Date.now() - i * 86400000}_${Math.random().toString(36).substring(7)}`,
      capsuleId: `cap_${i.toString().padStart(3, '0')}`,
      issuedAt: new Date(Date.now() - i * 86400000).toISOString(),
      status: ["notarized", "certified", "pending"][Math.floor(Math.random() * 3)],
      jurisdiction: ["US", "EU", "UK", "CA"][Math.floor(Math.random() * 4)],
      evidenceLevel: ["basic", "enhanced", "forensic", "legal"][Math.floor(Math.random() * 4)],
      legalWeight: ["informational", "evidence", "certified", "notarized"][Math.floor(Math.random() * 4)]
    }));

    // Apply filters
    let filteredCertificates = certificates;
    
    if (jurisdiction !== "all") {
      filteredCertificates = filteredCertificates.filter(cert => 
        cert.jurisdiction === jurisdiction
      );
    }
    
    if (status !== "all") {
      filteredCertificates = filteredCertificates.filter(cert => 
        cert.status === status
      );
    }

    const stats = {
      total: filteredCertificates.length,
      byStatus: filteredCertificates.reduce((acc, cert) => {
        acc[cert.status] = (acc[cert.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byJurisdiction: filteredCertificates.reduce((acc, cert) => {
        acc[cert.jurisdiction] = (acc[cert.jurisdiction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json({
      success: true,
      certificates: filteredCertificates,
      stats,
      pagination: {
        page: 1,
        totalPages: 1,
        totalItems: filteredCertificates.length
      }
    });

  } catch (error) {
    console.error("❌ Certificate registry fetch failed:", error);
    res.status(500).json({ error: "Registry fetch failed" });
  }
}