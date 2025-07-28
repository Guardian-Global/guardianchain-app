// Supabase health check and repair endpoints
import { Router } from "express";
import {
  getSupabaseClient,
  checkSupabaseHealth,
  isSupabaseConfigured,
} from "../../lib/supabase/client";

const router = Router();

// Supabase health check endpoint
router.get("/api/supabase/health", async (req, res) => {
  try {
    const health = await checkSupabaseHealth();

    res.json({
      success: true,
      data: {
        configured: health.configured,
        connected: health.connected,
        status: health.connected ? "healthy" : "disconnected",
        error: health.error || null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Health check failed",
      details: error.message,
    });
  }
});

// Supabase configuration status
router.get("/api/supabase/config", async (req, res) => {
  try {
    const configured = isSupabaseConfigured();

    res.json({
      success: true,
      data: {
        configured,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        environment: process.env.NODE_ENV || "development",
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Configuration check failed",
      details: error.message,
    });
  }
});

// Test Supabase connection and storage
router.post("/api/supabase/test", async (req, res) => {
  try {
    const client = getSupabaseClient();

    if (!client) {
      return res.status(400).json({
        success: false,
        error: "Supabase not configured",
      });
    }

    const results = {
      database: false,
      storage: false,
      auth: false,
      errors: [] as string[],
    };

    // Test database connection
    try {
      const { error: dbError } = await client
        .from("sessions")
        .select("count")
        .limit(1);

      results.database = !dbError || dbError.message.includes("relation");
      if (dbError && !dbError.message.includes("relation")) {
        results.errors.push(`Database: ${dbError.message}`);
      }
    } catch (error: any) {
      results.errors.push(`Database: ${error.message}`);
    }

    // Test storage
    try {
      const { data: buckets, error: storageError } =
        await client.storage.listBuckets();
      results.storage = !storageError;
      if (storageError) {
        results.errors.push(`Storage: ${storageError.message}`);
      }
    } catch (error: any) {
      results.errors.push(`Storage: ${error.message}`);
    }

    // Test auth (admin functions)
    try {
      const { data: users, error: authError } =
        await client.auth.admin.listUsers(0, 1);
      results.auth = !authError;
      if (authError) {
        results.errors.push(`Auth: ${authError.message}`);
      }
    } catch (error: any) {
      results.errors.push(`Auth: ${error.message}`);
    }

    res.json({
      success: true,
      data: {
        ...results,
        overall: results.database && results.storage,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Connection test failed",
      details: error.message,
    });
  }
});

export default router;
