// Set development environment
process.env.NODE_ENV = 'development';

import express from "express";
import type { Request, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import enhancedBlockchainRoutes from "./routes/enhanced-blockchain";
import { setupVite, serveStatic, log } from "./vite";
// Temporarily disabled middleware imports to fix startup
// import {
//   securityHeaders,
//   apiRateLimit,
//   productionHeaders,
//   validateContent,
// } from "./middleware/security";
// import { complianceMiddleware } from "./middleware/compliance";
// import { assetMiddleware } from "./middleware/assets";

const app = express();

// Trust proxy for Replit environment
app.set("trust proxy", true);

// Basic security middleware without rate limiting for now
// app.use(securityHeaders);
// app.use(productionHeaders);
// app.use(apiRateLimit);
// app.use(validateContent);
// app.use(complianceMiddleware);
// app.use(assetMiddleware);

// Session configuration for authentication
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "guardianchain-session-secret-change-in-production",
    resave: false,
    saveUninitialized: true, // Allow sessions to be created
    rolling: true, // Reset expiry on activity
    cookie: {
      secure: false, // Allow non-HTTPS in development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax", // Allow cross-site requests in development
    },
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Add cookie parser for working authentication
app.use(cookieParser());

// Serve static assets with proper MIME types
app.use(
  "/assets",
  express.static("public/assets", {
    setHeaders: (res, path) => {
      if (path.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
      } else if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      }
    },
  }),
);

// Demo authentication route (bypasses all other auth)
app.post("/api/auth/demo-login", (req, res) => {
  console.log("DEMO AUTH HIT:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const user = {
    id: `demo-${Date.now()}`,
    email,
    firstName: email.split("@")[0] || "Demo",
    lastName: "User",
    tier: "EXPLORER",
    role: "USER",
  };

  const token = `demo-token-${Date.now()}`;
  const session = {
    user,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  console.log("DEMO LOGIN SUCCESS:", email);
  res.json({
    success: true,
    message: "Demo login successful",
    session,
  });
});

// Authentication routes are handled in registerRoutes()

// Replit Auth Integration
const REPLIT_DOMAINS = process.env.REPLIT_DOMAINS || "localhost:5000";
const REPL_ID = process.env.REPL_ID || "guardianchain-nft";

// Simplified login route - redirect to frontend
app.get("/api/login", (req, res) => {
  // Always redirect to frontend login page
  res.redirect("/");
});

// Callback route for Replit Auth (simplified)
app.get("/api/callback", async (req, res) => {
  // Always redirect to frontend
  res.redirect("/");
});

// Logout route
app.get("/api/logout", (req, res) => {
  // Clear session and redirect
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// AI Routes for enhanced capsule experience
import aiRoutes from "./routes/ai.js";
app.use("/api/ai", aiRoutes);

// Capsule stats routes for engagement analytics
import capsuleStatsRoutes from "./routes/capsule/stats.js";
app.use("/api/capsule", capsuleStatsRoutes);

// Advanced capsule analytics routes
import capsuleAnalyticsRoutes from "./routes/capsule/analytics.js";
app.use("/api/capsule/analytics", capsuleAnalyticsRoutes);

// Stripe checkout routes
import checkoutRoutes from "./routes/checkout.js";
app.use("/api/checkout", checkoutRoutes);

// Secure upload routes
import uploadRoutes from "./routes/upload.js";
app.use("/api/upload", uploadRoutes);

// Web3 testing routes
import web3Routes from "./routes/web3.js";
app.use("/api/web3", web3Routes);

// Enhanced blockchain routes with Alchemy integration
app.use("/api/blockchain", enhancedBlockchainRoutes);

// Search routes
import searchRoutes from "./api/search.js";
app.use("/api/search", searchRoutes);

// Capsule vote routes
import capsuleVoteRouter from "./api/capsule-vote.js";
app.use("/api/capsules", capsuleVoteRouter);

// Capsule routes are integrated directly in routes.ts

// New comprehensive API routes
import capsulesRouter from "./routes/api/capsules.js";
app.use("/api/capsules", capsulesRouter);

import uploadRouter from "./routes/api/upload.js";
app.use("/api/upload", uploadRouter);

import adminRouter from "./routes/api/admin.js";
app.use("/api/admin", adminRouter);

import veritasRouter from "./routes/api/veritas.js";
app.use("/api/veritas", veritasRouter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
