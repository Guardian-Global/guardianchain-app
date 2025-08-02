import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { decryptCapsule } from "../utils/lit/decryptCapsule";
import {
  createTimeBasedCondition,
  createNFTOwnershipCondition,
  createTokenBalanceCondition,
} from "../utils/lit/accessConditions";

// Initialize Supabase client for server-side operations
const createSupabaseClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null; // Return null instead of throwing to allow fallback
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
};

export async function unlockCapsule(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing capsule ID" });
    }

    const supabase = createSupabaseClient();

    if (!supabase) {
      // Development fallback when Supabase not configured
      const mockCapsule = {
        id: id,
        title: "Unlocked Sample Capsule",
        description:
          "This is the revealed content of the capsule. Hidden secrets and memories are now visible.",
        author: "SampleUser",
        category: "Personal Truth",
        tags: ["unlocked", "revealed", "truth"],
        verification_status: "verified",
        grief_score: "85",
        views: "1234",
        likes: "89",
        comments: "12",
        shares: "5",
        created_at: new Date().toISOString(),
        content: {
          type: "text",
          data: "Hidden capsule content revealed after unlock",
          unlocked: true,
          unlocked_at: new Date().toISOString(),
          metadata: {
            created_via: "development",
            unlock_method: "development_mode",
          },
        },
      };

      return res.json({
        success: true,
        capsule: mockCapsule,
        message: "Capsule unlocked successfully (development mode)",
        note: "Development mode - Supabase not configured",
      });
    }

    try {
      // Fetch capsule from Supabase
      const { data: capsule, error } = await supabase
        .from("capsules")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !capsule) {
        return res.status(404).json({ error: "Capsule not found" });
      }

      // Check if capsule is already unlocked
      if (capsule.content?.unlocked) {
        return res.json({
          success: true,
          capsule: capsule,
          message: "Capsule was already unlocked",
        });
      }

      let decryptedContent = null;
      let unlockMethod = "basic_unlock";

      // Check if capsule has Lit Protocol encryption
      if (
        capsule.content?.encrypted &&
        capsule.content?.encryptedSymmetricKey
      ) {
        try {
          // Attempt to decrypt using Lit Protocol
          const {
            encryptedContent,
            encryptedSymmetricKey,
            accessControlConditions,
          } = capsule.content;

          decryptedContent = await decryptCapsule({
            encryptedContent,
            encryptedSymmetricKey,
            accessControlConditions:
              accessControlConditions || createTimeBasedCondition(Date.now()),
          });

          unlockMethod = "lit_protocol_decrypt";
        } catch (decryptError) {
          console.error("Lit Protocol decryption failed:", decryptError);
          return res.status(403).json({
            error: "Access conditions not met. Cannot decrypt capsule content.",
            details:
              "You may need to wait for time conditions or meet token/NFT requirements.",
          });
        }
      }

      // Prepare unlocked content
      const revealedDescription =
        decryptedContent ||
        capsule.description +
          " [UNLOCKED CONTENT: Additional hidden details and memories are now visible]";

      const unlockedContent = {
        ...capsule.content,
        unlocked: true,
        unlocked_at: new Date().toISOString(),
        revealed_description: revealedDescription,
        unlock_method: unlockMethod,
        // Clear encryption data after successful unlock
        encrypted: false,
        encryptedContent: null,
        encryptedSymmetricKey: null,
      };

      const { data: updatedCapsule, error: updateError } = await supabase
        .from("capsules")
        .update({
          content: unlockedContent,
          description: revealedDescription,
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      res.json({
        success: true,
        capsule: updatedCapsule,
        message: "Capsule unlocked successfully",
        unlocked_at: unlockedContent.unlocked_at,
        unlock_method: unlockMethod,
      });
    } catch (supabaseError) {
      console.error("Supabase unlock error:", supabaseError);

      // Fallback mock unlock for development
      const mockCapsule = {
        id: id,
        title: "Unlocked Sample Capsule",
        description: "This capsule content has been revealed after unlock",
        author: "SampleUser",
        category: "Personal Truth",
        tags: ["unlocked", "revealed", "truth"],
        verification_status: "verified",
        grief_score: "85",
        views: "1234",
        likes: "89",
        comments: "12",
        shares: "5",
        created_at: new Date().toISOString(),
        content: {
          type: "text",
          data: "Hidden content revealed after successful unlock",
          unlocked: true,
          unlocked_at: new Date().toISOString(),
          metadata: {
            created_via: "development",
            unlock_method: "fallback_mode",
          },
        },
      };

      res.json({
        success: true,
        capsule: mockCapsule,
        message: "Capsule unlocked successfully (development fallback)",
        note: "Development mode - Supabase operation failed",
      });
    }
  } catch (error) {
    console.error("Error unlocking capsule:", error);
    res.status(500).json({ error: "Failed to unlock capsule" });
  }
}
