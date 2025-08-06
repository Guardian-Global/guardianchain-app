import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️ Supabase configuration missing - asset routes will be limited",
  );
}

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Get all assets from all buckets
router.get("/discover", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase not configured",
        assets: [],
      });
    }

    // Get list of all storage buckets
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    const allAssets = [];

    // Scan each bucket for assets
    for (const bucket of buckets || []) {
      try {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list("", {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (filesError) {
          console.warn(
            `Error listing files in bucket ${bucket.name}:`,
            filesError,
          );
          continue;
        }

        for (const file of files || []) {
          if (file.name && !file.name.endsWith("/")) {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from(bucket.name)
              .getPublicUrl(file.name);

            // Determine asset type and value
            const assetInfo = categorizeAsset(file.name, file.metadata);

            allAssets.push({
              id: `${bucket.name}/${file.name}`,
              name: file.name,
              bucket: bucket.name,
              url: urlData.publicUrl,
              size: file.metadata?.size || 0,
              lastModified: file.updated_at,
              type: assetInfo.type,
              category: assetInfo.category,
              value: assetInfo.value,
              recommendedUsage: assetInfo.recommendedUsage,
              metadata: file.metadata,
            });
          }
        }
      } catch (error) {
        console.warn(`Error processing bucket ${bucket.name}:`, error);
      }
    }

    // Sort by value (highest first)
    allAssets.sort((a, b) => b.value - a.value);

    res.json({
      success: true,
      totalAssets: allAssets.length,
      buckets: buckets?.length || 0,
      assets: allAssets,
      recommendations: generateRecommendations(allAssets),
    });
  } catch (error) {
    console.error("Asset discovery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to discover assets",
      error: error.message,
    });
  }
});

// Get optimized asset URLs for specific usage
router.get("/optimized/:bucket/:filename", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase not configured",
      });
    }

    const { bucket, filename } = req.params;
    const { width, height, quality = 80, format } = req.query;

    // Get base URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    let optimizedUrl = urlData.publicUrl;

    // Add transformation parameters if supported
    if (width || height || format) {
      const params = new URLSearchParams();
      if (width) params.set("width", width.toString());
      if (height) params.set("height", height.toString());
      if (quality) params.set("quality", quality.toString());
      if (format) params.set("format", format.toString());

      optimizedUrl += `?${params.toString()}`;
    }

    res.json({
      success: true,
      url: optimizedUrl,
      original: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Asset optimization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to optimize asset",
      error: error.message,
    });
  }
});

// Asset categorization and value assessment
function categorizeAsset(
  filename: string,
  metadata: any,
): {
  type: string;
  category: string;
  value: number;
  recommendedUsage: string[];
} {
  const ext = filename.toLowerCase().split(".").pop() || ";
  const name = filename.toLowerCase();

  let type = "unknown";
  let category = "misc";
  let value = 1;
  let recommendedUsage: string[] = [];

  // Determine file type
  if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext)) {
    type = "image";
  } else if (["mp4", "webm", "mov", "avi"].includes(ext)) {
    type = "video";
  } else if (["pdf", "doc", "docx"].includes(ext)) {
    type = "document";
  } else if (["mp3", "wav", "ogg"].includes(ext)) {
    type = "audio";
  }

  // Categorize and assign value based on content
  if (name.includes("logo") || name.includes("brand")) {
    category = "branding";
    value = 10;
    recommendedUsage = ["header", "footer", "navigation", "auth-pages"];
  } else if (name.includes("hero") || name.includes("banner")) {
    category = "hero";
    value = 9;
    recommendedUsage = ["homepage", "landing-pages", "hero-sections"];
  } else if (name.includes("guardian") || name.includes("gtt")) {
    category = "product";
    value = 8;
    recommendedUsage = ["product-pages", "token-pages", "dashboards"];
  } else if (name.includes("background") || name.includes("bg")) {
    category = "background";
    value = 7;
    recommendedUsage = ["page-backgrounds", "section-backgrounds"];
  } else if (name.includes("icon") || name.includes("symbol")) {
    category = "icons";
    value = 6;
    recommendedUsage = ["navigation", "features", "ui-elements"];
  } else if (name.includes("team") || name.includes("founder")) {
    category = "team";
    value = 5;
    recommendedUsage = ["about-page", "team-section", "founder-dashboard"];
  } else if (name.includes("demo") || name.includes("screenshot")) {
    category = "showcase";
    value = 4;
    recommendedUsage = ["feature-showcase", "demo-pages"];
  }

  // Boost value for high-quality assets
  const size = metadata?.size || 0;
  if (size > 100000) value += 1; // Large files likely higher quality
  if (ext === "svg") value += 2; // Vector graphics are versatile
  if (ext === "webp") value += 1; // Modern format

  return { type, category, value, recommendedUsage };
}

// Generate placement recommendations
function generateRecommendations(assets: any[]) {
  const recommendations = {
    branding: assets.filter((a) => a.category === "branding").slice(0, 3),
    hero: assets.filter((a) => a.category === "hero").slice(0, 2),
    backgrounds: assets.filter((a) => a.category === "background").slice(0, 5),
    icons: assets.filter((a) => a.category === "icons").slice(0, 10),
    showcase: assets.filter((a) => a.category === "showcase").slice(0, 8),
  };

  return {
    immediate: [
      {
        location: "Navigation Header",
        asset: recommendations.branding[0],
        priority: "high",
      },
      {
        location: "Homepage Hero",
        asset: recommendations.hero[0],
        priority: "high",
      },
      {
        location: "Login Page Background",
        asset: recommendations.backgrounds[0],
        priority: "medium",
      },
    ],
    categories: recommendations,
  };
}

export default router;
