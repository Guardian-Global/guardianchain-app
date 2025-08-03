import type { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export interface ClusteringRequest {
  includePersonal?: boolean;
  includeProfessional?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  minClusterSize?: number;
  maxClusters?: number;
}

export interface ClusterAnalysis {
  clustering_summary: {
    total_capsules: number;
    n_clusters: number;
    clustering_algorithm: string;
    embedding_model: string;
    analysis_timestamp: string;
  };
  cluster_themes: {
    [key: number]: {
      theme_name: string;
      size: number;
      avg_emotional_score: number;
      avg_grief_score: number;
      common_tags: string[];
      era_range: string;
      sample_titles: string[];
    };
  };
  visualization_data: {
    x_coordinates: number[];
    y_coordinates: number[];
    cluster_labels: number[];
    capsule_ids: string[];
    titles: string[];
  };
}

/**
 * Advanced AI-powered capsule clustering analysis
 * Groups truth capsules by emotional patterns, themes, and temporal characteristics
 */
export async function runCapsuleClustering(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const options: ClusteringRequest = req.body;

  console.log("🔬 Starting capsule clustering analysis...");
  console.log("📊 Options:", options);

  try {
    // Prepare Python script execution - try main script first, fallback if OpenAI fails
    const mainScriptPath = path.join(__dirname, "../ai/capsule-clustering.py");
    const fallbackScriptPath = path.join(__dirname, "../ai/fallback-clustering.py");
    const outputPath = path.join(process.cwd(), "clustered_capsules_analysis.json");

    // Check if Python scripts exist
    const useMainScript = fs.existsSync(mainScriptPath) && process.env.OPENAI_API_KEY;
    const scriptToUse = useMainScript ? mainScriptPath : fallbackScriptPath;
    
    if (!fs.existsSync(scriptToUse)) {
      return res.status(500).json({
        error: "Clustering script not found",
        details: "Python clustering pipeline is not properly installed"
      });
    }

    console.log(`🐍 Executing ${useMainScript ? 'OpenAI' : 'TF-IDF fallback'} clustering pipeline...`);

    // Execute Python clustering script
    const pythonProcess = spawn("python3", [scriptToUse], {
      env: {
        ...process.env,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
      }
    });

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(output);
      outputData += output;
    });

    pythonProcess.stderr.on("data", (data) => {
      const error = data.toString();
      console.error("Python Error:", error);
      errorData += error;
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Python clustering completed successfully");
        
        // Read results file
        try {
          if (fs.existsSync(outputPath)) {
            const results = JSON.parse(fs.readFileSync(outputPath, "utf8"));
            
            // Clean up temporary file
            fs.unlinkSync(outputPath);
            
            return res.status(200).json({
              success: true,
              analysis: results,
              message: "Capsule clustering analysis completed successfully"
            });
          } else {
            return res.status(500).json({
              error: "Results file not generated",
              details: "Python script completed but no output file found"
            });
          }
        } catch (parseError) {
          console.error("Error reading results:", parseError);
          return res.status(500).json({
            error: "Failed to parse clustering results",
            details: parseError instanceof Error ? parseError.message : "Unknown parsing error"
          });
        }
      } else {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({
          error: "Clustering analysis failed",
          details: errorData || `Process exited with code ${code}`,
          output: outputData
        });
      }
    });

    // Set timeout for long-running analysis
    setTimeout(() => {
      pythonProcess.kill();
      return res.status(408).json({
        error: "Analysis timeout",
        details: "Clustering analysis took too long to complete"
      });
    }, 120000); // 2 minute timeout

  } catch (error) {
    console.error("💥 Clustering error:", error);
    
    return res.status(500).json({
      error: "Failed to execute clustering analysis",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Get cached clustering results
 */
export async function getCachedClusteringResults(req: Request, res: Response) {
  try {
    const cacheFile = path.join(process.cwd(), "cached_clustering_results.json");
    
    if (fs.existsSync(cacheFile)) {
      const cachedResults = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      
      return res.status(200).json({
        success: true,
        cached: true,
        analysis: cachedResults,
        message: "Retrieved cached clustering results"
      });
    } else {
      return res.status(404).json({
        error: "No cached results available",
        message: "Run clustering analysis first to generate results"
      });
    }
  } catch (error) {
    console.error("Error retrieving cached results:", error);
    
    return res.status(500).json({
      error: "Failed to retrieve cached results",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Generate cluster insights and recommendations
 */
export async function generateClusterInsights(req: Request, res: Response) {
  try {
    const { clusterId, userId } = req.params;
    
    // Mock insights generation - in production this would use actual cluster analysis
    const insights = {
      cluster_id: parseInt(clusterId),
      user_id: userId,
      insights: {
        dominant_emotions: ["nostalgia", "gratitude", "reflection"],
        recommended_actions: [
          "Consider creating a family legacy capsule",
          "Document more milestone memories",
          "Share story with family members"
        ],
        similar_users: [
          { id: "user_123", name: "Sarah M.", similarity: 0.87 },
          { id: "user_456", name: "Michael K.", similarity: 0.82 }
        ],
        temporal_patterns: {
          most_active_period: "2020-2023",
          emotional_trend: "increasingly positive",
          common_timeframes: ["holidays", "anniversaries", "birthdays"]
        }
      },
      generated_at: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      insights,
      message: "Cluster insights generated successfully"
    });

  } catch (error) {
    console.error("Error generating insights:", error);
    
    return res.status(500).json({
      error: "Failed to generate cluster insights",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}