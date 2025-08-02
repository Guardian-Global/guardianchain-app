import { Router } from "express";
import { isAuthenticated } from "../auth/middleware";

const router = Router();

// Mock configuration data - in production this would come from database
const configItems = [
  {
    key: "projectName",
    value: "GuardianChain",
    type: "string" as const,
    editable: false,
  },
  {
    key: "defaultTier",
    value: "guest",
    type: "string" as const,
    editable: true,
  },
  {
    key: "projectStatus",
    value: "production",
    type: "string" as const,
    editable: true,
  },
  {
    key: "veritasSealRequired",
    value: "true",
    type: "boolean" as const,
    editable: true,
  },
  {
    key: "stripeEnabled",
    value: "true",
    type: "boolean" as const,
    editable: true,
  },
  {
    key: "capsuleReplayFee",
    value: "2.50",
    type: "number" as const,
    editable: true,
  },
  {
    key: "griefScoreEnabled",
    value: "true",
    type: "boolean" as const,
    editable: true,
  },
  {
    key: "aiModeration",
    value: "on",
    type: "string" as const,
    editable: true,
  },
  {
    key: "ipfsPinning",
    value: "pinata",
    type: "string" as const,
    editable: true,
  },
  {
    key: "network",
    value: "polygon-mainnet",
    type: "string" as const,
    editable: false,
  },
];

// Store for dynamic config changes (in production, use database)
let runtimeConfig = new Map(configItems.map((item) => [item.key, item.value]));

// Middleware to check admin access
const requireAdmin = (req: any, res: any, next: any) => {
  const user = req.user;
  const isAdmin =
    user?.email === "admin@guardianchain.app" ||
    user?.tier === "ADMIN" ||
    user?.tier === "DAO_OWNER";

  if (!isAdmin) {
    return res.status(403).json({
      error: "Admin access required",
      userTier: user?.tier || "guest",
    });
  }

  next();
};

// Get configuration
router.get("/config", isAuthenticated, requireAdmin, (req, res) => {
  try {
    const enrichedConfig = configItems.map((item) => ({
      ...item,
      value: runtimeConfig.get(item.key) || item.value,
    }));

    res.json({
      config: enrichedConfig,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching admin config:", error);
    res.status(500).json({ error: "Failed to fetch configuration" });
  }
});

// Update configuration
router.post("/config", isAuthenticated, requireAdmin, (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid updates format" });
    }

    // Validate and apply updates
    const appliedUpdates: string[] = [];
    const errors: string[] = [];

    for (const [key, value] of Object.entries(updates)) {
      const configItem = configItems.find((item) => item.key === key);

      if (!configItem) {
        errors.push(`Unknown config key: ${key}`);
        continue;
      }

      if (!configItem.editable) {
        errors.push(`Config key '${key}' is read-only`);
        continue;
      }

      // Type validation
      if (configItem.type === "boolean") {
        if (value !== "true" && value !== "false") {
          errors.push(`Config key '${key}' must be 'true' or 'false'`);
          continue;
        }
      } else if (configItem.type === "number") {
        if (isNaN(Number(value))) {
          errors.push(`Config key '${key}' must be a valid number`);
          continue;
        }
      }

      // Apply update
      runtimeConfig.set(key, value as string);
      appliedUpdates.push(key);
    }

    res.json({
      success: true,
      appliedUpdates,
      errors,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating admin config:", error);
    res.status(500).json({ error: "Failed to update configuration" });
  }
});

// Get current configuration as JSON (public endpoint for fallback)
router.get("/config/public", (req, res) => {
  try {
    const publicConfig = Object.fromEntries(runtimeConfig.entries());
    res.json(publicConfig);
  } catch (error) {
    console.error("Error fetching public config:", error);
    res.status(500).json({ error: "Failed to fetch configuration" });
  }
});

export default router;
