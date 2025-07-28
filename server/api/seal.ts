import type { Express } from "express";
import { storage } from "../storage";

// DocuSign Veritas Seal integration
interface VeritasSealRequest {
  capsuleId: number;
  content: string;
  creatorId: number;
  metadata?: {
    title?: string;
    tags?: string[];
    timestamp?: string;
  };
}

interface VeritasSealResponse {
  sealId: string;
  envelopeId: string;
  status: "created" | "sent" | "completed" | "failed";
  veritasUrl?: string;
  certificateUrl?: string;
  expiresAt?: string;
}

/**
 * Mock DocuSign Veritas Seal API call
 * In production, this would integrate with actual DocuSign API
 */
async function createVeritasSeal(
  request: VeritasSealRequest
): Promise<VeritasSealResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock seal ID (in production this would come from DocuSign)
  const sealId = `VS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const envelopeId = `ENV-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Mock successful response
  return {
    sealId,
    envelopeId,
    status: "completed",
    veritasUrl: `https://seal.docusign.com/veritas/${sealId}`,
    certificateUrl: `https://seal.docusign.com/certificate/${sealId}.pdf`,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
  };
}

/**
 * Register seal API routes
 */
export function registerSealRoutes(app: Express) {
  // Create Veritas Seal for a capsule
  app.post("/api/seal", async (req, res) => {
    try {
      const { capsuleId, content, creatorId, metadata } = req.body;

      if (!capsuleId || !content) {
        return res.status(400).json({
          error: "Missing required fields: capsuleId and content",
        });
      }

      // Get capsule from storage to verify ownership and status
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({
          error: "Capsule not found",
        });
      }

      // Verify the user owns this capsule or has permission to seal it
      if (req.user && capsule.creatorId !== req.user.id) {
        return res.status(403).json({
          error: "You can only seal your own capsules",
        });
      }

      // Check if capsule is already sealed
      if (capsule.veritasSealUrl) {
        return res.status(400).json({
          error: "Capsule is already sealed",
          existingSeal: {
            sealId: capsule.veritasSealId,
            url: capsule.veritasSealUrl,
          },
        });
      }

      // Create Veritas Seal
      const sealRequest: VeritasSealRequest = {
        capsuleId: parseInt(capsuleId),
        content,
        creatorId: creatorId || req.user?.id,
        metadata: {
          title: metadata?.title || capsule.title,
          tags: metadata?.tags || capsule.tags,
          timestamp: new Date().toISOString(),
        },
      };

      const sealResponse = await createVeritasSeal(sealRequest);

      // Update capsule with seal information
      const updatedCapsule = await storage.updateCapsule(capsuleId, {
        veritasSealId: sealResponse.sealId,
        veritasSealUrl: sealResponse.veritasUrl,
        isSealed: true,
        sealedAt: new Date().toISOString(),
        verificationStatus: "sealed",
      });

      res.status(200).json({
        success: true,
        seal: sealResponse,
        capsule: updatedCapsule,
      });
    } catch (error: any) {
      console.error("Veritas seal error:", error);
      res.status(500).json({
        error: "Failed to create Veritas seal",
        details: error.message,
      });
    }
  });

  // Get seal status
  app.get("/api/seal/:sealId", async (req, res) => {
    try {
      const { sealId } = req.params;

      // In production, this would query DocuSign API for seal status
      // For now, return mock status
      const mockStatus = {
        sealId,
        status: "completed",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        veritasUrl: `https://seal.docusign.com/veritas/${sealId}`,
        certificateUrl: `https://seal.docusign.com/certificate/${sealId}.pdf`,
      };

      res.status(200).json(mockStatus);
    } catch (error: any) {
      console.error("Seal status error:", error);
      res.status(500).json({
        error: "Failed to get seal status",
        details: error.message,
      });
    }
  });

  // Verify seal integrity
  app.post("/api/seal/verify", async (req, res) => {
    try {
      const { sealId, content } = req.body;

      if (!sealId || !content) {
        return res.status(400).json({
          error: "Missing required fields: sealId and content",
        });
      }

      // In production, this would verify the seal against DocuSign's verification API
      // For now, return mock verification
      const verificationResult = {
        isValid: true,
        sealId,
        verifiedAt: new Date().toISOString(),
        integrity: "intact",
        tamperEvidence: false,
        originalContent: content,
        certificateChain: [
          {
            issuer: "DocuSign Veritas CA",
            subject: `Veritas Seal ${sealId}`,
            validFrom: new Date().toISOString(),
            validUntil: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ],
      };

      res.status(200).json(verificationResult);
    } catch (error: any) {
      console.error("Seal verification error:", error);
      res.status(500).json({
        error: "Failed to verify seal",
        details: error.message,
      });
    }
  });
}
