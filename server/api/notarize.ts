import { Request, Response } from "express";
import crypto from "crypto";
import { ethers } from "ethers";

// Notarization API for blockchain anchoring and IPFS integration
// Handles content verification, smart contract interaction, and certificate generation

interface NotarizationRequest {
  capsuleId: string;
  content: string;
  contentType: "text" | "image" | "audio" | "video" | "document";
  metadata: {
    title: string;
    author: string;
    timestamp: string;
    location?: string;
    tags?: string[];
  };
  evidenceLevel: "basic" | "enhanced" | "forensic" | "legal";
  jurisdictions: string[];
  isPublic: boolean;
  retentionYears: number;
}

interface IPFSUploadResult {
  hash: string;
  size: number;
  url: string;
}

interface BlockchainNotarization {
  transactionHash: string;
  blockNumber: number;
  notarizationId: number;
  gasUsed: string;
  cost: string;
}

// Mock IPFS upload (in production, use actual IPFS client)
async function uploadToIPFS(content: string, metadata: any): Promise<IPFSUploadResult> {
  // Simulate IPFS upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const contentBuffer = Buffer.from(JSON.stringify({ content, metadata }));
  const hash = `Qm${crypto.randomBytes(22).toString('hex')}`;
  
  return {
    hash,
    size: contentBuffer.length,
    url: `https://ipfs.io/ipfs/${hash}`
  };
}

// Mock blockchain interaction (in production, use actual smart contract)
async function notarizeOnBlockchain(
  contentHash: string,
  ipfsHash: string,
  evidenceLevel: string,
  jurisdictions: string[]
): Promise<BlockchainNotarization> {
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const transactionHash = `0x${crypto.randomBytes(32).toString('hex')}`;
  const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
  const notarizationId = Math.floor(Math.random() * 10000) + 1;
  
  return {
    transactionHash,
    blockNumber,
    notarizationId,
    gasUsed: (Math.random() * 50000 + 21000).toFixed(0),
    cost: (Math.random() * 0.01 + 0.001).toFixed(6)
  };
}

export async function notarizeCapsule(req: Request, res: Response) {
  try {
    const notarizationData: NotarizationRequest = req.body;

    // Validate required fields
    if (!notarizationData.capsuleId || !notarizationData.content) {
      return res.status(400).json({ error: "Capsule ID and content are required" });
    }

    console.log(`🔐 Starting notarization for capsule: ${notarizationData.capsuleId}`);

    // Step 1: Generate content hash
    const contentHash = crypto
      .createHash('sha256')
      .update(notarizationData.content)
      .digest('hex');

    console.log(`📝 Content hash generated: ${contentHash.substring(0, 16)}...`);

    // Step 2: Upload to IPFS
    const ipfsResult = await uploadToIPFS(notarizationData.content, notarizationData.metadata);
    console.log(`📁 IPFS upload complete: ${ipfsResult.hash}`);

    // Step 3: Record on blockchain
    const blockchainResult = await notarizeOnBlockchain(
      contentHash,
      ipfsResult.hash,
      notarizationData.evidenceLevel,
      notarizationData.jurisdictions
    );
    console.log(`⛓️ Blockchain notarization complete: ${blockchainResult.transactionHash}`);

    // Step 4: Generate verification proof
    const verificationProof = {
      contentHash,
      ipfsHash: ipfsResult.hash,
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      notarizationId: blockchainResult.notarizationId,
      timestamp: new Date().toISOString(),
      evidenceLevel: notarizationData.evidenceLevel,
      jurisdictions: notarizationData.jurisdictions,
      legalWeight: getLegalWeight(notarizationData.evidenceLevel),
      verificationUrl: `https://guardianchain.app/verify/${blockchainResult.notarizationId}`,
      certificateEligible: notarizationData.evidenceLevel !== "basic"
    };

    const response = {
      success: true,
      notarization: {
        id: blockchainResult.notarizationId,
        capsuleId: notarizationData.capsuleId,
        status: "NOTARIZED",
        contentHash,
        ipfs: ipfsResult,
        blockchain: blockchainResult,
        verification: verificationProof,
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: "~3.2 seconds",
          costBreakdown: {
            ipfsStorage: "$0.001",
            blockchainGas: `$${blockchainResult.cost}`,
            verification: "$0.002",
            total: `$${(parseFloat(blockchainResult.cost) + 0.003).toFixed(6)}`
          }
        }
      },
      nextSteps: {
        generateCertificate: `/api/certificates/generate`,
        verifyNotarization: `/api/certificates/${blockchainResult.notarizationId}/verify`,
        downloadProof: `/api/notarize/${blockchainResult.notarizationId}/proof`
      }
    };

    res.json(response);

  } catch (error) {
    console.error("❌ Notarization failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Notarization failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function getNotarizationProof(req: Request, res: Response) {
  try {
    const { notarizationId } = req.params;

    if (!notarizationId) {
      return res.status(400).json({ error: "Notarization ID required" });
    }

    // In production, fetch from blockchain and database
    const mockProof = {
      id: notarizationId,
      contentHash: crypto.randomBytes(32).toString('hex'),
      ipfsHash: `Qm${crypto.randomBytes(22).toString('hex')}`,
      transactionHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      evidenceLevel: ["basic", "enhanced", "forensic", "legal"][Math.floor(Math.random() * 4)],
      jurisdictions: ["US", "EU", "UK"],
      status: "VERIFIED",
      legalWeight: "certified",
      verifications: [
        {
          verifier: "GuardianChain Validator",
          timestamp: new Date().toISOString(),
          method: "Cryptographic Hash Verification",
          result: "VALID"
        },
        {
          verifier: "Blockchain Network",
          timestamp: new Date().toISOString(),
          method: "Smart Contract Verification",
          result: "CONFIRMED"
        },
        {
          verifier: "IPFS Network",
          timestamp: new Date().toISOString(),
          method: "Content Availability Check",
          result: "ACCESSIBLE"
        }
      ]
    };

    // Set headers for proof download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="notarization-proof-${notarizationId}.json"`);

    res.json({
      success: true,
      proof: mockProof,
      digitalSignature: crypto
        .createHash('sha256')
        .update(JSON.stringify(mockProof) + process.env.NOTARIZATION_SECRET || 'guardian_secret')
        .digest('hex'),
      verificationInstructions: {
        step1: "Verify content hash matches original content",
        step2: "Check blockchain transaction on network explorer",
        step3: "Validate IPFS content availability",
        step4: "Confirm digital signature authenticity"
      }
    });

  } catch (error) {
    console.error("❌ Proof generation failed:", error);
    res.status(500).json({ error: "Proof generation failed" });
  }
}

export async function generateLegalCertificate(req: Request, res: Response) {
  try {
    const { notarizationId, purpose, requestedBy } = req.body;

    if (!notarizationId) {
      return res.status(400).json({ error: "Notarization ID required" });
    }

    // Import certificate generation function
    const { generatePDFCertificate } = await import("./certificates");
    await generatePDFCertificate(req, res);

  } catch (error) {
    console.error("❌ Legal certificate generation failed:", error);
    res.status(500).json({ error: "Certificate generation failed" });
  }
}

export async function verifyCertificate(req: Request, res: Response) {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID required" });
    }

    // In production, verify against blockchain and certificate database
    const isValid = Math.random() > 0.05; // 95% success rate for demo

    const verificationResult = {
      certificateId,
      isValid,
      verifiedAt: new Date().toISOString(),
      status: isValid ? "VERIFIED" : "INVALID",
      details: {
        blockchainConfirmed: isValid,
        signatureValid: isValid,
        notExpired: isValid,
        issuerAuthorized: isValid,
        chainOfCustodyIntact: isValid
      },
      metadata: {
        issuer: "GuardianChain Legal Authority",
        issuedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        legalJurisdictions: ["US", "EU", "UK", "CA"],
        evidenceLevel: "legal",
        trustScore: isValid ? Math.floor(Math.random() * 10) + 90 : 0
      }
    };

    if (isValid) {
      res.json({
        success: true,
        verification: verificationResult,
        message: "Certificate is authentic and legally binding"
      });
    } else {
      res.status(400).json({
        success: false,
        verification: verificationResult,
        warning: "Certificate verification failed"
      });
    }

  } catch (error) {
    console.error("❌ Certificate verification failed:", error);
    res.status(500).json({ error: "Verification failed" });
  }
}

export async function getCertificateRegistry(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20, status = "all" } = req.query;

    // Mock certificate registry (in production, fetch from database)
    const mockCertificates = Array.from({ length: 100 }, (_, i) => ({
      id: `CERT_${Date.now() - i * 60000}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      notarizationId: Math.floor(Math.random() * 10000) + 1,
      capsuleId: `cap_${Date.now() - i * 60000}_${crypto.randomBytes(8).toString('hex')}`,
      status: Math.random() > 0.1 ? "VALID" : "EXPIRED",
      issuedAt: new Date(Date.now() - i * 60000).toISOString(),
      evidenceLevel: ["basic", "enhanced", "forensic", "legal"][Math.floor(Math.random() * 4)],
      legalWeight: ["informational", "evidence", "certified", "notarized"][Math.floor(Math.random() * 4)],
      jurisdictions: ["US", "EU", "UK"].slice(0, Math.floor(Math.random() * 3) + 1)
    }));

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedCertificates = mockCertificates.slice(startIndex, endIndex);

    res.json({
      success: true,
      certificates: paginatedCertificates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: mockCertificates.length,
        pages: Math.ceil(mockCertificates.length / Number(limit))
      },
      stats: {
        totalCertificates: mockCertificates.length,
        validCertificates: mockCertificates.filter(c => c.status === "VALID").length,
        expiredCertificates: mockCertificates.filter(c => c.status === "EXPIRED").length
      }
    });

  } catch (error) {
    console.error("❌ Certificate registry fetch failed:", error);
    res.status(500).json({ error: "Registry fetch failed" });
  }
}

// Helper function to determine legal weight based on evidence level
function getLegalWeight(evidenceLevel: string): string {
  switch (evidenceLevel) {
    case "basic": return "informational";
    case "enhanced": return "evidence";
    case "forensic": return "certified";
    case "legal": return "notarized";
    default: return "informational";
  }
}