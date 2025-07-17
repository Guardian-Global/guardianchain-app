import type { Express } from "express";
import { storage } from "../storage";

// DocuSign Veritas Seal integration for GuardianChain
export function registerVeritasRoutes(app: Express) {
  // Create Veritas Seal for a capsule
  app.post("/api/veritas/seal/:capsuleId", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.capsuleId);
      const capsule = await storage.getCapsule(capsuleId);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "Capsule not found"
        });
      }

      // Mock DocuSign integration - replace with actual DocuSign API calls
      const mockEnvelopeId = `env_${Date.now()}_${capsuleId}`;
      const mockSealUrl = `https://demo.docusign.com/seals/${mockEnvelopeId}`;
      
      // In production, this would create actual DocuSign envelope
      const docusignPayload = {
        documents: [{
          documentId: "1",
          name: `Truth_Capsule_${capsuleId}.pdf`,
          transformPdfFields: "false"
        }],
        recipients: {
          signers: [{
            email: process.env.DOCUSIGN_SIGNER_EMAIL || "guardian@example.com",
            name: "Guardian Chain Verifier",
            recipientId: "1"
          }]
        },
        status: "sent"
      };

      // Update capsule with DocuSign info
      const updatedCapsule = await storage.updateCapsule(capsuleId, {
        docusignEnvelopeId: mockEnvelopeId,
        veritasSealUrl: mockSealUrl,
        status: "verified"
      });

      res.json({
        success: true,
        data: {
          capsule: updatedCapsule,
          envelopeId: mockEnvelopeId,
          sealUrl: mockSealUrl,
          verificationStatus: "sealed"
        },
        message: "Veritas Seal created successfully"
      });
    } catch (error: any) {
      console.error("Error creating Veritas Seal:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create Veritas Seal"
      });
    }
  });

  // Check seal status
  app.get("/api/veritas/status/:envelopeId", async (req, res) => {
    try {
      const { envelopeId } = req.params;
      
      // Mock status check - replace with actual DocuSign API
      const mockStatus = {
        envelopeId,
        status: "completed",
        signingProgress: 100,
        sealVerified: true,
        legallyBinding: true,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: mockStatus
      });
    } catch (error: any) {
      console.error("Error checking seal status:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to check seal status"
      });
    }
  });

  // Webhook for DocuSign events
  app.post("/api/veritas/webhook", async (req, res) => {
    try {
      const { envelopeId, status, event } = req.body;
      
      console.log("DocuSign webhook received:", { envelopeId, status, event });
      
      // Find capsule by envelope ID and update status
      if (status === "completed" && envelopeId) {
        // In a real implementation, you'd search for the capsule by envelopeId
        // and update its verification status
        console.log(`Veritas Seal completed for envelope: ${envelopeId}`);
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error processing DocuSign webhook:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to process webhook"
      });
    }
  });

  // Get all sealed capsules
  app.get("/api/veritas/sealed", async (req, res) => {
    try {
      const sealedCapsules = await storage.getCapsules({
        status: "verified",
        limit: 50,
        offset: 0
      });

      // Filter for capsules with Veritas Seals
      const veritasSealed = sealedCapsules.filter(capsule => 
        capsule.docusignEnvelopeId && capsule.veritasSealUrl
      );

      res.json({
        success: true,
        data: veritasSealed,
        meta: {
          total: veritasSealed.length,
          verified: veritasSealed.length
        }
      });
    } catch (error: any) {
      console.error("Error fetching sealed capsules:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch sealed capsules"
      });
    }
  });
}