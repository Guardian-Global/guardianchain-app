import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

// Enhanced Security Headers for 100% Compliance
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "*.supabase.co"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      connectSrc: [
        "'self'",
        "https:",
        "wss:",
        "ws:",
        "*.replit.dev",
        "*.replit.app",
        "*.supabase.co",
      ],
      frameSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false, // Allow Coinbase Wallet popup communication
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

// Enhanced Rate Limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Limit auth attempts
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
});

// Production Environment Headers
export const productionHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Force HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    req.header("x-forwarded-proto") !== "https"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
    return;
  }

  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
};

// CORS Configuration for Production
export const corsConfig = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://guardianchain.replit.app", "https://*.replit.app"]
      : true,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Content Validation Middleware
export const validateContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate JSON payloads
  if (req.headers["content-type"]?.includes("application/json")) {
    try {
      if (req.body && typeof req.body === "string") {
        req.body = JSON.parse(req.body);
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
  }

  // Input sanitization
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }

  next();
};

// Input sanitization helper
function sanitizeInput(obj: any): any {
  if (typeof obj === "string") {
    return obj.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
  }
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = sanitizeInput(obj[key]);
    }
  }
  return obj;
}
