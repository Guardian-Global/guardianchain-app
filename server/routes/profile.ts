import { Router } from 'express';
import { pool } from '../db';
import { consolidatedAuth } from '../auth/authConsolidation';

const router = Router();

// Get user profile
router.get('/api/profile', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        username,
        bio,
        avatar,
        profile_image_url,
        wallet_address,
        tier,
        gtt_balance,
        total_capsules,
        verified_capsules,
        social_links,
        is_verified,
        created_at,
        updated_at
      FROM users 
      WHERE id = $1
    `, [userId]);
    client.release();

    if (result.rows && result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar || user.profile_image_url,
          walletAddress: user.wallet_address,
          tier: user.tier,
          gttBalance: user.gtt_balance || 0,
          totalCapsules: user.total_capsules || 0,
          verifiedCapsules: user.verified_capsules || 0,
          socialLinks: user.social_links || {},
          isVerified: user.is_verified || false,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/api/profile', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      username,
      bio,
      walletAddress,
      socialLinks
    } = req.body;

    const client = await pool.connect();
    const result = await client.query(`
      UPDATE users 
      SET 
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        username = COALESCE($4, username),
        bio = COALESCE($5, bio),
        wallet_address = COALESCE($6, wallet_address),
        social_links = COALESCE($7, social_links),
        updated_at = NOW()
      WHERE id = $1
      RETURNING 
        id, email, first_name, last_name, username, bio, 
        avatar, profile_image_url, wallet_address, tier,
        gtt_balance, total_capsules, verified_capsules, 
        social_links, is_verified, created_at, updated_at
    `, [
      userId,
      firstName,
      lastName,
      username,
      bio,
      walletAddress,
      socialLinks ? JSON.stringify(socialLinks) : null
    ]);
    client.release();

    if (result.rows && result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar || user.profile_image_url,
          walletAddress: user.wallet_address,
          tier: user.tier,
          gttBalance: user.gtt_balance || 0,
          totalCapsules: user.total_capsules || 0,
          verifiedCapsules: user.verified_capsules || 0,
          socialLinks: user.social_links || {},
          isVerified: user.is_verified || false,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Update profile avatar
router.patch('/api/profile/avatar', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ success: false, message: 'Avatar URL is required' });
    }

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
      const user = result.rows[0];
      res.json({
        success: true,
        message: 'Avatar updated successfully',
        avatar: user.avatar || user.profile_image_url
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update avatar' });
  }
});

export default router;