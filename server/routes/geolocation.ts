// server/routes/geolocation.ts
// Geolocation logging (city, device, login history)

import express from 'express';
import { consolidatedAuth } from '../auth/authConsolidation';
import { storage } from '../storage';

const router = express.Router();

// Helper function to get geolocation data
async function getGeolocationData(ip: string) {
  try {
    // Use ipapi.co for geolocation (free tier: 30,000 requests/month)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }
    
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'UN',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude?.toString() || '0',
      longitude: data.longitude?.toString() || '0',
      timezone: data.timezone || 'UTC',
      isp: data.org || 'Unknown'
    };
  } catch (error) {
    console.warn('Geolocation lookup failed:', error);
    return {
      country: 'Unknown',
      countryCode: 'UN',
      region: 'Unknown', 
      city: 'Unknown',
      latitude: '0',
      longitude: '0',
      timezone: 'UTC',
      isp: 'Unknown'
    };
  }
}

// Helper function to parse User-Agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent || '';
  
  // Basic device detection
  let device = 'Desktop';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    device = 'Mobile';
  } else if (/Tablet|iPad/.test(ua)) {
    device = 'Tablet';
  }
  
  // Basic browser detection
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  // Basic OS detection
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return { device, browser, os };
}

// Calculate risk score based on various factors
function calculateRiskScore(loginHistory: any[], currentLogin: any) {
  let risk = 0;
  
  if (loginHistory.length === 0) {
    // First login gets moderate risk
    risk += 30;
  } else {
    const recentLogins = loginHistory.slice(0, 10); // Last 10 logins
    
    // Check for new location
    const knownLocations = new Set(recentLogins.map(l => `${l.city},${l.country}`));
    if (!knownLocations.has(`${currentLogin.city},${currentLogin.country}`)) {
      risk += 40;
    }
    
    // Check for new device/browser
    const knownDevices = new Set(recentLogins.map(l => `${l.device}-${l.browser}`));
    if (!knownDevices.has(`${currentLogin.device}-${currentLogin.browser}`)) {
      risk += 25;
    }
    
    // Check for rapid successive logins (potential brute force)
    const lastLogin = recentLogins[0];
    if (lastLogin && new Date(currentLogin.loginTime).getTime() - new Date(lastLogin.loginTime).getTime() < 60000) {
      risk += 50;
    }
  }
  
  return Math.min(100, Math.max(0, risk));
}

// Middleware to log login attempts
export async function logLoginAttempt(req: any, userId: string, success: boolean) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || '';
    
    const geoData = await getGeolocationData(ip);
    const { device, browser, os } = parseUserAgent(userAgent);
    
    const loginData = {
      userId,
      ip: ip.replace('::ffff:', ''), // Clean IPv4-mapped IPv6 addresses
      userAgent,
      success,
      country: geoData.country,
      region: geoData.region,
      city: geoData.city,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      device,
      browser,
      os,
      isp: geoData.isp,
      loginTime: new Date()
    };
    
    // Get recent login history for risk calculation
    if (success) {
      const loginHistory = await storage.getUserLoginHistory(userId, 10);
      loginData.riskScore = calculateRiskScore(loginHistory, loginData);
      
      // Also create/update session log
      const sessionData = {
        userId,
        sessionToken: req.cookies?.guardian_session_token || 'pending',
        ip: loginData.ip,
        userAgent,
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
        device,
        browser,
        os,
        riskScore: loginData.riskScore,
        isActive: true
      };
      
      await storage.createSessionLog(sessionData);
    }
    
    await storage.createLoginHistory(loginData);
    
    console.log(`🌍 Login ${success ? 'success' : 'failed'} logged: ${geoData.city}, ${geoData.country} (Risk: ${loginData.riskScore || 0})`);
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
}

// Get user's login history
router.get('/login-history', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const loginHistory = await storage.getUserLoginHistory(userId, limit);
    
    res.json(loginHistory);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Failed to fetch login history' });
  }
});

// Get current session geolocation info
router.get('/current-location', consolidatedAuth, async (req: any, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || '';
    
    const geoData = await getGeolocationData(ip);
    const { device, browser, os } = parseUserAgent(userAgent);
    
    res.json({
      ip: ip.replace('::ffff:', ''),
      ...geoData,
      device,
      browser,
      os
    });
  } catch (error) {
    console.error('Error getting current location:', error);
    res.status(500).json({ error: 'Failed to get location data' });
  }
});

// Admin endpoint - get all login activity
router.get('/admin/login-activity', async (req, res) => {
  try {
    // Check admin authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const limit = parseInt(req.query.limit as string) || 100;
    const onlySuccessful = req.query.success === 'true';
    
    const activity = await storage.getAllLoginActivity(limit, onlySuccessful);
    
    res.json(activity);
  } catch (error) {
    console.error('Error fetching login activity:', error);
    res.status(500).json({ error: 'Failed to fetch login activity' });
  }
});

// Get login statistics
router.get('/stats', consolidatedAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await storage.getUserLoginStats(userId);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching login stats:', error);
    res.status(500).json({ error: 'Failed to fetch login stats' });
  }
});

export { router as geolocationRoutes, logLoginAttempt };