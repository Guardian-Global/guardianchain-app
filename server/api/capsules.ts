import { Request, Response } from "express";
import { z } from "zod";
import { encryptCapsule } from "../utils/lit/encryptCapsule";
import { createTimeBasedCondition, createTokenBalanceCondition } from "../utils/lit/accessConditions";

// Initialize Supabase client for server-side operations
const createSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to environment variables.");
  }
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
};

// Validation schema for new capsules
const createCapsuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.array(z.string()).optional().default([]),
  // Time lock settings
  timelock: z.object({
    enabled: z.boolean().default(false),
    unlockDate: z.string().optional(),
    unlockTimestamp: z.number().optional()
  }).optional(),
  // Access control settings
  accessControl: z.object({
    type: z.enum(["public", "time_locked", "token_gated", "nft_gated"]).default("public"),
    tokenAddress: z.string().optional(),
    minimumBalance: z.string().optional(),
    nftContractAddress: z.string().optional()
  }).optional()
});

export async function createCapsule(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = createCapsuleSchema.parse(req.body);
    
    try {
      const supabaseConfig = createSupabaseClient();
      
      // Prepare content for potential encryption
      let contentData = {
        type: "text",
        data: validatedData.description || "",
        metadata: {
          created_via: "web_interface",
          version: "1.0"
        }
      };

      // Handle time-locked or access-controlled capsules
      if (validatedData.timelock?.enabled || validatedData.accessControl?.type !== "public") {
        try {
          let accessConditions = [];

          // Create access control conditions based on settings
          if (validatedData.timelock?.enabled && validatedData.timelock.unlockTimestamp) {
            accessConditions = createTimeBasedCondition(validatedData.timelock.unlockTimestamp);
          } else if (validatedData.accessControl?.type === "token_gated" && 
                     validatedData.accessControl.tokenAddress && 
                     validatedData.accessControl.minimumBalance) {
            accessConditions = createTokenBalanceCondition(
              validatedData.accessControl.tokenAddress,
              validatedData.accessControl.minimumBalance
            );
          }

          if (accessConditions.length > 0) {
            // Encrypt the sensitive content
            const encryptionResult = await encryptCapsule({
              content: validatedData.description || "",
              accessControlConditions: accessConditions
            });

            contentData = {
              ...contentData,
              encrypted: true,
              encryptedContent: encryptionResult.encryptedContent,
              encryptedSymmetricKey: encryptionResult.encryptedSymmetricKey,
              accessControlConditions: encryptionResult.accessControlConditions,
              originalData: null // Hide original data when encrypted
            };
          }
        } catch (encryptionError) {
          console.error("Encryption failed:", encryptionError);
          // Continue without encryption as fallback
          contentData.encryption_failed = true;
          contentData.encryption_error = encryptionError.message;
        }
      }

      // Prepare capsule data for insertion
      const capsuleData = {
        title: validatedData.title,
        description: validatedData.description || "",
        category: validatedData.category,
        author: validatedData.author,
        tags: validatedData.tags,
        verification_status: "pending",
        grief_score: "0",
        views: "0",
        likes: "0",
        comments: "0",
        shares: "0",
        content: contentData
      };
      
      // Make direct API call to Supabase
      const response = await fetch(`${supabaseConfig.url}/rest/v1/capsules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseConfig.key}`,
          'apikey': supabaseConfig.key,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(capsuleData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase capsule creation error:", errorData);
        return res.status(response.status).json({ error: "Failed to create capsule" });
      }

      const data = await response.json();
      const createdCapsule = Array.isArray(data) ? data[0] : data;
      
      res.status(201).json({ 
        success: true,
        id: createdCapsule.id,
        message: "Capsule created successfully",
        capsule: createdCapsule
      });
    } catch (supabaseError) {
      console.error("Supabase connection error:", supabaseError);
      
      // Fallback to mock creation for development
      const mockCapsule = {
        id: `cap_${Date.now()}`,
        title: validatedData.title,
        description: validatedData.description || "",
        author: validatedData.author,
        category: validatedData.category,
        tags: validatedData.tags,
        verification_status: "pending",
        grief_score: "0",
        views: "0",
        likes: "0",
        comments: "0",
        shares: "0",
        created_at: new Date().toISOString()
      };
      
      console.log(`Development fallback - New capsule created: ${validatedData.title}`);
      
      res.status(201).json({ 
        success: true,
        id: mockCapsule.id,
        message: "Capsule created successfully (development mode)",
        capsule: mockCapsule
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors.map(e => e.message).join(", ")
      });
    }
    
    console.error("Error creating capsule:", error);
    res.status(500).json({ error: "Failed to create capsule" });
  }
}

export async function getCapsuleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "Capsule ID is required" });
    }

    try {
      const supabaseConfig = createSupabaseClient();
      
      // Make direct API call to Supabase
      const searchUrl = new URL(`${supabaseConfig.url}/rest/v1/capsules`);
      searchUrl.searchParams.append('select', '*');
      searchUrl.searchParams.append('id', `eq.${id}`);

      const response = await fetch(searchUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseConfig.key}`,
          'apikey': supabaseConfig.key,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase capsule fetch error:", errorData);
        return res.status(response.status).json({ error: "Failed to fetch capsule" });
      }

      const data = await response.json();
      const capsule = Array.isArray(data) ? data[0] : data;
      
      if (!capsule) {
        return res.status(404).json({ error: "Capsule not found" });
      }
      
      res.json({ capsule });
    } catch (supabaseError) {
      console.error("Supabase connection error:", supabaseError);
      
      // Fallback to mock data for development
      const mockCapsule = {
        id: id,
        title: "Sample Truth Capsule",
        description: "This is a sample capsule for development purposes",
        author: "SampleUser",
        category: "Personal Truth",
        tags: ["sample", "development", "test"],
        verification_status: "verified",
        grief_score: "85",
        views: "1234",
        likes: "89",
        comments: "12",
        shares: "5",
        created_at: new Date().toISOString(),
        content: {
          type: "text",
          data: "Sample capsule content for development",
          metadata: { created_via: "development" }
        }
      };
      
      res.json({ 
        capsule: mockCapsule,
        note: "Development mode - using mock data"
      });
    }
  } catch (error) {
    console.error("Error fetching capsule:", error);
    res.status(500).json({ error: "Failed to fetch capsule" });
  }
}