import type { Express } from "express";

export function registerMetadataRoutes(app: Express) {
  // NFT metadata endpoint for CapsuleNFT tokens
  app.get('/api/metadata/:tokenId', async (req, res) => {
    try {
      const tokenId = req.params.tokenId;
      const baseUrl = req.get('host') || 'guardianchain.app';
      const protocol = req.secure ? 'https' : 'http';

      // In production, this would fetch capsule data from database
      // For now, we'll generate standardized metadata
      const metadata = {
        name: `Guardian Capsule #${tokenId}`,
        description: "A sealed capsule of memory and truth preserved on GuardianChain - the sovereign Web3 infrastructure for time-locked proof and grief-score yield.",
        image: `${protocol}://${baseUrl}/api/capsule-image/${tokenId}`,
        external_url: `${protocol}://${baseUrl}/capsules/${tokenId}`,
        attributes: [
          { trait_type: "Chain", value: "Polygon" },
          { trait_type: "Category", value: "Veritas Capsule" },
          { trait_type: "Platform", value: "GuardianChain" },
          { display_type: "number", trait_type: "Token ID", value: parseInt(tokenId) },
          { display_type: "date", trait_type: "Minted", value: Math.floor(Date.now() / 1000) }
        ],
        properties: {
          files: [
            {
              uri: `${protocol}://${baseUrl}/api/capsule-image/${tokenId}`,
              type: "image/png"
            }
          ],
          category: "image"
        }
      };

      // Set appropriate headers for NFT metadata
      res.set({
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      });

      console.log(`📋 NFT metadata requested for token ${tokenId}`);
      res.status(200).json(metadata);
    } catch (error) {
      console.error('❌ Metadata generation failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate capsule preview image (SVG)
  app.get('/api/capsule-image/:tokenId', async (req, res) => {
    try {
      const tokenId = req.params.tokenId;
      
      // Generate SVG preview for the capsule NFT
      const svg = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Background -->
          <rect width="400" height="400" fill="url(#grad1)"/>
          
          <!-- Capsule Shape -->
          <ellipse cx="200" cy="150" rx="120" ry="80" fill="#ffffff" opacity="0.9" filter="url(#glow)"/>
          <ellipse cx="200" cy="250" rx="120" ry="80" fill="#ffffff" opacity="0.9" filter="url(#glow)"/>
          <rect x="80" y="150" width="240" height="100" fill="#ffffff" opacity="0.9"/>
          
          <!-- Inner Glow -->
          <ellipse cx="200" cy="200" rx="80" ry="60" fill="#f0f4ff" opacity="0.7"/>
          
          <!-- Title -->
          <text x="200" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
                text-anchor="middle" fill="#ffffff" filter="url(#glow)">
            GUARDIAN CAPSULE
          </text>
          
          <!-- Token ID -->
          <text x="200" y="350" font-family="Arial, sans-serif" font-size="16" 
                text-anchor="middle" fill="#ffffff" opacity="0.8">
            #${tokenId}
          </text>
          
          <!-- Seal Symbol -->
          <circle cx="200" cy="200" r="25" fill="none" stroke="#667eea" stroke-width="3" opacity="0.6"/>
          <circle cx="200" cy="200" r="15" fill="#667eea" opacity="0.4"/>
          <circle cx="200" cy="200" r="8" fill="#ffffff"/>
        </svg>
      `;

      res.set({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      });

      res.status(200).send(svg);
    } catch (error) {
      console.error('❌ Capsule image generation failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate capsule image',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}