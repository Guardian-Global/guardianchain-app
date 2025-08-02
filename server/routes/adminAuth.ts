import type { Express } from "express";
import { storage } from "../storage";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  requireAuth,
  requireRole,
  initializeMasterAdmin,
} from "../auth/adminAuth";

export function registerAdminAuthRoutes(app: Express) {
  // Initialize master admin on startup
  initializeMasterAdmin().catch(console.error);

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is deactivated" });
      }

      // Verify password
      if (!user.passwordHash) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = generateToken(user.id, user.roles);

      // Update last login
      await storage.updateUserRoles(user.id, user.roles); // This will update the timestamp

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get current admin user
  app.get("/api/admin/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      });
    } catch (error) {
      console.error("Get admin user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new admin user (Master Admin only)
  app.post(
    "/api/admin/users",
    requireAuth,
    requireRole("MASTER_ADMIN"),
    async (req: any, res) => {
      try {
        const { email, firstName, lastName, roles, password } = req.body;

        if (!email || !firstName || !lastName || !roles || !password) {
          return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin user
        const newUser = await storage.createAdminUser({
          email,
          firstName,
          lastName,
          roles,
          isActive: true,
          passwordHash,
        });

        res.json({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            roles: newUser.roles,
            isActive: newUser.isActive,
          },
        });
      } catch (error) {
        console.error("Create admin user error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Update user roles (Admin+ only)
  app.patch(
    "/api/admin/users/:userId/roles",
    requireAuth,
    requireRole("ADMIN"),
    async (req: any, res) => {
      try {
        const { userId } = req.params;
        const { roles } = req.body;

        if (!roles || !Array.isArray(roles)) {
          return res.status(400).json({ error: "Valid roles array required" });
        }

        const updatedUser = await storage.updateUserRoles(userId, roles);

        res.json({
          success: true,
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            roles: updatedUser.roles,
            isActive: updatedUser.isActive,
          },
        });
      } catch (error) {
        console.error("Update user roles error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Admin dashboard stats (Moderator+ only)
  app.get(
    "/api/admin/stats",
    requireAuth,
    requireRole("MODERATOR"),
    async (req: any, res) => {
      try {
        const stats = await storage.getStats();

        res.json({
          success: true,
          stats: {
            ...stats,
            adminUsers: 1, // Mock count for now
            activeAdmins: 1,
            lastActivity: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("Get admin stats error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
}
