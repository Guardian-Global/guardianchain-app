import express from "express";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const router = express.Router();

// POST /api/playlist/mint - Mint playlist as NFT
router.post("/mint", async (req, res) => {
  try {
    const { playlistId, userWallet, metadata } = req.body;

    if (!playlistId || !userWallet || !metadata) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get playlist details
    const playlistResult = await db.execute(sql`
      SELECT * FROM capsule_playlists WHERE id = ${playlistId}
    `);

    if (!playlistResult.rows || playlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const playlist = playlistResult.rows[0];

    // Create NFT metadata
    const nftMetadata = {
      name: metadata.name || `${playlist.name} Playlist`,
      description: metadata.description || "GuardianChain Capsule Playlist NFT",
      image: metadata.image || "https://guardianchain.app/assets/playlist-nft.png",
      attributes: [
        { trait_type: "Type", value: "Playlist" },
        { trait_type: "Capsules", value: metadata.capsules?.length || 0 },
        { trait_type: "Creator", value: playlist.user_id },
        { trait_type: "Edition", value: "2025 Collection" }
      ],
      ...metadata
    };

    // Generate mock token ID (in production, integrate with actual NFT contract)
    const tokenId = Math.floor(Math.random() * 1000000);

    // Store NFT record
    await db.execute(sql`
      INSERT INTO playlist_nfts (playlist_id, user_id, wallet_address, token_id, metadata, mint_tx)
      VALUES (${playlistId}, ${playlist.user_id}, ${userWallet}, ${tokenId}, ${JSON.stringify(nftMetadata)}, 'mock-tx-hash')
    `);

    res.json({ 
      success: true,
      tokenId,
      metadata: nftMetadata,
      message: 'Playlist NFT minted successfully'
    });
  } catch (error) {
    console.error("Failed to mint playlist NFT:", error);
    res.status(500).json({ error: "Failed to mint playlist NFT" });
  }
});

export default router;