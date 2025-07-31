import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticateToken } from "../unified-auth-routes";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'file') {
      const fileType = req.body.type;
      if (fileType === 'picture') {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed for profile pictures'));
        }
      } else if (fileType === 'video') {
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only video files are allowed for introduction videos'));
        }
      } else {
        cb(new Error('Invalid file type specified'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});

// Profile media upload endpoint
router.post("/profile-media", authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    const fileType = req.body.type;

    // Here you could save the file URL to the user's profile in the database
    // await storage.updateUser(req.userId, { 
    //   [fileType === 'picture' ? 'profileImageUrl' : 'profileVideoUrl']: fileUrl 
    // });

    res.json({
      success: true,
      url: fileUrl,
      type: fileType,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file"
    });
  }
});

export default router;