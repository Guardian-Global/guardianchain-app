import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { consolidatedAuth } from "../auth/authConsolidation";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/capsules";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const fileId = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    cb(null, `capsule_${fileId}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB max
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, audio, and documents
    const allowedTypes = [
      "image/",
      "video/",
      "audio/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/",
    ];

    const isAllowed = allowedTypes.some((type) =>
      file.mimetype.startsWith(type),
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"));
    }
  },
});

// Encryption helper
function encryptFile(buffer: Buffer, key: string): Buffer {
  const algorithm = "aes-256-gcm";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine IV, authTag, and encrypted data
  return Buffer.concat([iv, authTag, encrypted]);
}

// Generate file hash for integrity verification
function generateFileHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Secure capsule upload endpoint
router.post("/upload-secure", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { storageSize, userId } = req.body;
    const file = req.file;

    // Generate capsule metadata
    const capsuleId = crypto.randomUUID();
    const encryptionKey = crypto.randomBytes(32).toString("hex");
    const fileHash = generateFileHash(fs.readFileSync(file.path));

    // Read and encrypt file
    const fileBuffer = fs.readFileSync(file.path);
    const encryptedBuffer = encryptFile(fileBuffer, encryptionKey);

    // Save encrypted file
    const encryptedPath = `uploads/capsules/encrypted_${capsuleId}.bin`;
    fs.writeFileSync(encryptedPath, encryptedBuffer);

    // Clean up original file
    fs.unlinkSync(file.path);

    // Create capsule metadata
    const capsuleMetadata = {
      id: capsuleId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storageSize,
      userId: userId || "anonymous",
      fileHash,
      encryptedPath,
      createdAt: new Date().toISOString(),
      status: "sealed",
      // Store encryption key securely (in production, use proper key management)
      encryptionKey: encryptionKey, // WARNING: Store this securely in production!
    };

    // Save metadata (in production, store in database)
    const metadataPath = `uploads/capsules/metadata_${capsuleId}.json`;
    fs.writeFileSync(metadataPath, JSON.stringify(capsuleMetadata, null, 2));

    // Generate IPFS-like content identifier (CID)
    const cid = `bafybei${crypto.randomBytes(20).toString("hex")}`;

    res.json({
      success: true,
      capsuleId,
      cid,
      fileHash,
      message: "Capsule sealed successfully",
      metadata: {
        originalName: file.originalname,
        size: file.size,
        storageSize,
        createdAt: capsuleMetadata.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
});

// Get capsule info (for public viewing)
router.get("/capsule/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = `uploads/capsules/metadata_${id}.json`;

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({
        success: false,
        message: "Capsule not found",
      });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    // Return public metadata only (no encryption key)
    const publicMetadata = {
      id: metadata.id,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      size: metadata.size,
      storageSize: metadata.storageSize,
      fileHash: metadata.fileHash,
      createdAt: metadata.createdAt,
      status: metadata.status,
      // Generate thumbnail URL for images
      thumbnailUrl: metadata.mimeType.startsWith("image/")
        ? `/api/upload/thumbnail/${id}`
        : null,
    };

    res.json({
      success: true,
      capsule: publicMetadata,
    });
  } catch (error) {
    console.error("Get capsule error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve capsule",
    });
  }
});

// Generate secure thumbnail for images
router.get("/thumbnail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = `uploads/capsules/metadata_${id}.json`;

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    if (!metadata.mimeType.startsWith("image/")) {
      return res.status(400).json({ message: "Not an image capsule" });
    }

    // In production, generate and cache thumbnails
    // For now, return a placeholder
    res.json({
      success: true,
      thumbnailUrl: "/api/placeholder-thumbnail.jpg",
      message: "Thumbnail generation not implemented yet",
    });
  } catch (error) {
    console.error("Thumbnail error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate thumbnail",
    });
  }
});

// Avatar upload configuration
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename with user ID if available
    const fileId = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    cb(null, `avatar_${fileId}${extension}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for avatars
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files for avatars
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for avatars"));
    }
  },
});

// Avatar upload endpoint
router.post("/avatar", consolidatedAuth, avatarUpload.single("avatar"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar file provided",
      });
    }

    const file = req.file;
    const userId = req.user?.id || "anonymous";

    // Generate avatar metadata
    const avatarId = crypto.randomUUID();
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    // In production, you would save this to your database
    const avatarMetadata = {
      id: avatarId,
      userId,
      originalName: file.originalname,
      filename: file.filename,
      url: avatarUrl,
      mimeType: file.mimetype,
      size: file.size,
      createdAt: new Date().toISOString(),
    };

    console.log(`✅ Avatar uploaded for user ${userId}:`, avatarMetadata);

    res.json({
      success: true,
      url: avatarUrl,
      metadata: avatarMetadata,
      message: "Avatar uploaded successfully",
    });
  } catch (error: any) {
    console.error("Avatar upload error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Avatar upload failed",
    });
  }
});

export default router;
