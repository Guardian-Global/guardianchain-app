import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const router = Router();

// Master admin credentials
const MASTER_CREDENTIALS = {
  email: 'master@guardianchain.org',
  password: 'masterkey123',
  role: 'MASTER_ADMIN'
};

// Enhanced authentication middleware
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, agreedToTerms } = req.body;

    if (!agreedToTerms) {
      return res.status(400).json({ message: 'Must agree to terms' });
    }

    // Check if user exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      tier: 'EXPLORER',
      role: 'USER',
      emailVerified: false,
      agreedToTerms: true,
      gttStakeAmount: 0
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, tier: user.tier, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set session
    req.session.user = { id: user.id, email: user.email, tier: user.tier, role: user.role };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        role: user.role,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, tier: user.tier, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set session
    req.session.user = { id: user.id, email: user.email, tier: user.tier, role: user.role };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        role: user.role,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Master login endpoint
router.post('/master-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check master credentials
    if (email === MASTER_CREDENTIALS.email && password === MASTER_CREDENTIALS.password) {
      // Check if master user exists in database
      let masterUser = await storage.getUserByEmail(email);
      
      if (!masterUser) {
        // Create master user
        const hashedPassword = await bcrypt.hash(password, 10);
        masterUser = await storage.createUser({
          email,
          password: hashedPassword,
          firstName: 'Master',
          lastName: 'Admin',
          tier: 'SOVEREIGN',
          role: 'MASTER_ADMIN',
          emailVerified: true,
          agreedToTerms: true,
          gttStakeAmount: 1000000
        });
      }

      // Generate token
      const token = jwt.sign(
        { userId: masterUser.id, email: masterUser.email, tier: masterUser.tier, role: masterUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Set session
      req.session.user = { 
        id: masterUser.id, 
        email: masterUser.email, 
        tier: masterUser.tier, 
        role: masterUser.role 
      };

      res.json({
        user: {
          id: masterUser.id,
          email: masterUser.email,
          firstName: masterUser.firstName,
          lastName: masterUser.lastName,
          tier: masterUser.tier,
          role: masterUser.role,
          emailVerified: masterUser.emailVerified
        },
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid master credentials' });
    }
  } catch (error) {
    console.error('Master login error:', error);
    res.status(500).json({ message: 'Master login failed' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await storage.getUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.tier,
      role: user.role,
      emailVerified: user.emailVerified,
      gttStakeAmount: user.gttStakeAmount,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await storage.updateUser(req.user.userId, updates);

    res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        tier: updatedUser.tier,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;