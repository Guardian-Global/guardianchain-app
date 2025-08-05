import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { capsules } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Extend Request type to include capsule
declare global {
  namespace Express {
    interface Request {
      capsule?: {
        id: string;
        daoCertified: boolean;
        author: string;
        [key: string]: any;
      };
    }
  }
}

export async function requireCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { capsuleId } = req.body;
    
    if (!capsuleId) {
      return res.status(400).json({ 
        error: 'Capsule ID required for certification check',
        code: 'MISSING_CAPSULE_ID' 
      });
    }

    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (!capsule) {
      return res.status(404).json({ 
        error: 'Capsule not found',
        code: 'CAPSULE_NOT_FOUND' 
      });
    }

    if (!capsule.daoCertified) {
      return res.status(403).json({ 
        error: 'Capsule must be DAO-certified before minting',
        code: 'DAO_CERTIFICATION_REQUIRED',
        capsuleId,
        certificationStatus: 'pending'
      });
    }

    // Add capsule to request for downstream middleware
    req.capsule = {
      id: capsule.id,
      daoCertified: capsule.daoCertified,
      author: capsule.author,
      title: capsule.title,
      createdAt: capsule.createdAt
    };

    console.log(`✅ DAO certification verified for capsule: ${capsuleId}`);
    next();
  } catch (error) {
    console.error('DAO certification check error:', error);
    res.status(500).json({ 
      error: 'Failed to verify DAO certification',
      code: 'CERTIFICATION_CHECK_ERROR' 
    });
  }
}

export async function requireCertificationForViewing(req: Request, res: Response, next: NextFunction) {
  // Optional middleware for viewing restricted content
  try {
    const { capsuleId } = req.params;
    
    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (capsule && capsule.restrictedContent && !capsule.daoCertified) {
      return res.status(403).json({ 
        error: 'This capsule contains restricted content requiring DAO certification',
        code: 'RESTRICTED_CONTENT_ACCESS_DENIED' 
      });
    }

    next();
  } catch (error) {
    console.error('Content restriction check error:', error);
    next(); // Continue on error to avoid breaking legitimate requests
  }
}