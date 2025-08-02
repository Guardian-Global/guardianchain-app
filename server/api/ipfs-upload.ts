import type { Request, Response } from "express";
import multer from "multer";
import axios from "axios";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export async function uploadToIPFS(req: Request, res: Response) {
  try {
    // Handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "File upload failed", details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Check if IPFS credentials are configured
      if (!projectId || !projectSecret) {
        return res.status(500).json({
          error: "IPFS credentials not configured",
          message:
            "Please set IPFS_PROJECT_ID and IPFS_SECRET environment variables",
        });
      }

      try {
        // Create form data for IPFS upload
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append("file", blob, req.file.originalname);

        // Upload to IPFS via Infura
        const ipfsResponse = await axios.post(
          "https://ipfs.infura.io:5001/api/v0/add",
          formData,
          {
            headers: {
              Authorization: auth,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const ipfsHash = ipfsResponse.data.Hash;
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

        res.status(200).json({
          hash: ipfsHash,
          url: ipfsUrl,
          size: req.file.size,
          type: req.file.mimetype,
        });
      } catch (ipfsError) {
        console.error("IPFS upload error:", ipfsError);
        res.status(500).json({
          error: "IPFS upload failed",
          details:
            ipfsError instanceof Error ? ipfsError.message : "Unknown error",
        });
      }
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function uploadJSONToIPFS(req: Request, res: Response) {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "No data provided" });
    }

    // Check if IPFS credentials are configured
    if (!projectId || !projectSecret) {
      return res.status(500).json({
        error: "IPFS credentials not configured",
        message:
          "Please set IPFS_PROJECT_ID and IPFS_SECRET environment variables",
      });
    }

    // Create JSON blob
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: "application/json" });

    const formData = new FormData();
    formData.append("file", blob, "metadata.json");

    // Upload to IPFS
    const ipfsResponse = await axios.post(
      "https://ipfs.infura.io:5001/api/v0/add",
      formData,
      {
        headers: {
          Authorization: auth,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const ipfsHash = ipfsResponse.data.Hash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    res.status(200).json({
      hash: ipfsHash,
      url: ipfsUrl,
      size: jsonString.length,
    });
  } catch (error) {
    console.error("JSON upload error:", error);
    res.status(500).json({
      error: "JSON upload failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
