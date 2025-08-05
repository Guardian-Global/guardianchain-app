import rateLimit from "express-rate-limit";

// Authentication rate limiter - prevents brute force attacks
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: "Too many login attempts from this IP. Please try again in 15 minutes.",
    code: "RATE_LIMITED"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: {
    error: "Too many API requests. Please slow down.",
    code: "API_RATE_LIMITED"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin panel rate limiter - stricter limits
export const adminRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 admin requests per 5 minutes
  message: {
    error: "Too many admin requests. Access temporarily restricted.",
    code: "ADMIN_RATE_LIMITED"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mint endpoint rate limiter - prevent spam minting
export const mintRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 mint attempts per 10 minutes
  message: {
    error: "Too many minting attempts. Please wait before trying again.",
    code: "MINT_RATE_LIMITED"
  },
  standardHeaders: true,
  legacyHeaders: false,
});