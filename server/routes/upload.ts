import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { consolidatedAuth } from '../auth/authConsolidation';
import { pool } from '../db';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload avatar endpoint
router.post('/api/upload/avatar', consolidatedAuth, upload.single('avatar'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const avatarUrl = `/uploads/${req.file.filename}`;

    // Update user's avatar in database
    const client = await pool.connect();
    const result = await client.query(`
      UPDATE users 
      SET 
        avatar = $2,
        profile_image_url = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, avatar, profile_image_url
    `, [userId, avatarUrl]);
    client.release();

    if (result.rows && result.rows.length > 0) {
      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatarUrl: avatarUrl,
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } else {
      // Clean up uploaded file if database update failed
      fs.unlinkSync(req.file.path);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Avatar upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload avatar',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// General file upload endpoint
router.post('/api/upload/file', consolidatedAuth, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Log file upload to database
    const client = await pool.connect();
    await client.query(`
      INSERT INTO assets (
        id, user_id, filename, original_name, mime_type, size, url, uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      fileUrl
    ]);
    client.release();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;