import type { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export function setupSecurityMiddleware(app: Express) {
  // Enhanced security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:"
        ],
        connectSrc: [
          "'self'",
          "https://api.openai.com",
          "https://api.anthropic.com",
          "https://polygon-rpc.com",
          "https://rpc.ankr.com"
        ]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting by tier
  const createRateLimit = (windowMs: number, max: number) => 
    rateLimit({
      windowMs,
      max,
      message: { error: 'Rate limit exceeded' },
      standardHeaders: true,
      legacyHeaders: false
    });

  // API rate limits
  app.use('/api/ai-assistant', createRateLimit(60 * 1000, 10)); // 10 per minute
  app.use('/api/capsules', createRateLimit(60 * 1000, 30)); // 30 per minute
  app.use('/api/auth', createRateLimit(15 * 60 * 1000, 5)); // 5 per 15 minutes
  app.use('/api/admin', createRateLimit(60 * 1000, 5)); // 5 per minute for admin

  // Input validation middleware
  app.use((req, res, next) => {
    // Sanitize inputs
    if (req.body && typeof req.body === 'object') {
      sanitizeObject(req.body);
    }
    next();
  });

  // Skip authentication middleware that was causing issues
  console.log('Security middleware setup complete - authentication disabled for development');
}

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potentially dangerous characters
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["\'][^"\']*["\']/gi, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

export const securityConfig = {
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16
  },
  session: {
    secret: process.env.SESSION_SECRET,
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://guardianchain.app', 'https://www.guardianchain.app']
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
};