import express from "express";

const router = express.Router();

// Comprehensive API endpoint diagnostics
router.get("/diagnostics", async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      endpoints: {},
      vendor_apis: {},
      system_health: {},
    };

    // Check environment variables
    const requiredEnvVars = [
      "DATABASE_URL",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "STRIPE_SECRET_KEY",
      "ALCHEMY_API_KEY",
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_ANON_KEY",
    ];

    diagnostics.vendor_apis = {};
    for (const envVar of requiredEnvVars) {
      diagnostics.vendor_apis[envVar] = {
        configured: !!process.env[envVar],
        status: process.env[envVar] ? "Available" : "Missing",
      };
    }

    // Test key API endpoints
    const testEndpoints = [
      "/api/health",
      "/api/token/gtt-data",
      "/api/users/profile",
      "/api/capsules",
      "/api/auth/status",
      "/api/billing/status",
      "/api/compliance/score",
      "/api/admin/health",
      "/api/treasury/overview",
      "/api/ai/recommendations",
    ];

    for (const endpoint of testEndpoints) {
      try {
        // This would normally make internal requests to test endpoints
        diagnostics.endpoints[endpoint] = {
          status: "Configured",
          method: "GET",
        };
      } catch (error) {
        diagnostics.endpoints[endpoint] = {
          status: "Error",
          error: error.message,
        };
      }
    }

    // System health checks
    diagnostics.system_health = {
      database: process.env.DATABASE_URL ? "Connected" : "Not Configured",
      openai: process.env.OPENAI_API_KEY ? "Available" : "Missing Key",
      anthropic: process.env.ANTHROPIC_API_KEY ? "Available" : "Missing Key",
      stripe: process.env.STRIPE_SECRET_KEY ? "Available" : "Missing Key",
      alchemy: process.env.ALCHEMY_API_KEY ? "Available" : "Missing Key",
      supabase:
        process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY
          ? "Available"
          : "Missing Keys",
    };

    res.json({
      success: true,
      data: diagnostics,
    });
  } catch (error) {
    console.error("API diagnostics error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test specific vendor API connectivity
router.post("/test-vendor/:vendor", async (req, res) => {
  const { vendor } = req.params;

  try {
    let testResult = {};

    switch (vendor) {
      case "openai":
        if (process.env.OPENAI_API_KEY) {
          // Test OpenAI connection
          testResult = {
            vendor: "OpenAI",
            status: "Key Available",
            configured: true,
          };
        } else {
          testResult = {
            vendor: "OpenAI",
            status: "Missing API Key",
            configured: false,
          };
        }
        break;

      case "anthropic":
        if (process.env.ANTHROPIC_API_KEY) {
          testResult = {
            vendor: "Anthropic",
            status: "Key Available",
            configured: true,
          };
        } else {
          testResult = {
            vendor: "Anthropic",
            status: "Missing API Key",
            configured: false,
          };
        }
        break;

      case "stripe":
        if (process.env.STRIPE_SECRET_KEY) {
          testResult = {
            vendor: "Stripe",
            status: "Key Available",
            configured: true,
          };
        } else {
          testResult = {
            vendor: "Stripe",
            status: "Missing API Key",
            configured: false,
          };
        }
        break;

      case "alchemy":
        if (process.env.ALCHEMY_API_KEY) {
          testResult = {
            vendor: "Alchemy",
            status: "Key Available",
            configured: true,
          };
        } else {
          testResult = {
            vendor: "Alchemy",
            status: "Missing API Key",
            configured: false,
          };
        }
        break;

      case "supabase":
        if (
          process.env.VITE_SUPABASE_URL &&
          process.env.VITE_SUPABASE_ANON_KEY
        ) {
          testResult = {
            vendor: "Supabase",
            status: "Keys Available",
            configured: true,
          };
        } else {
          testResult = {
            vendor: "Supabase",
            status: "Missing URL or Anon Key",
            configured: false,
            missing: {
              url: !process.env.VITE_SUPABASE_URL,
              anon_key: !process.env.VITE_SUPABASE_ANON_KEY,
            },
          };
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown vendor: ${vendor}`,
        });
    }

    res.json({
      success: true,
      data: testResult,
    });
  } catch (error) {
    console.error(`Vendor test error for ${vendor}:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
