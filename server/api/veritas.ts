// /server/api/veritas.ts

import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/seal", async (req, res) => {
  try {
    const { userEmail, capsuleId } = req.body;

    const response = await axios.post(
      process.env.DOCUSIGN_BASE_URL + "/v2.1/accounts/" + process.env.DOCUSIGN_USER_ID + "/envelopes",
      {
        emailSubject: "Veritas Capsule Seal",
        recipients: {
          signers: [
            {
              email: userEmail,
              name: "GuardianChain Capsule Owner",
              recipientId: "1",
              routingOrder: "1",
            },
          ],
        },
        documents: [
          {
            documentBase64: Buffer.from("Capsule ID: " + capsuleId).toString("base64"),
            name: "Veritas_Seal.pdf",
            fileExtension: "pdf",
            documentId: "1",
          },
        ],
        status: "sent",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ envelopeId: response.data.envelopeId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;