#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Create a static version for GitHub Pages
console.log('Building static version for GitHub Pages...');

// Copy essential files to public directory
const copyFile = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${src} to ${dest}`);
    }
  } catch (error) {
    console.log(`⚠ Warning: Could not copy ${src}: ${error.message}`);
  }
};

// Ensure public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Create index.html for GitHub Pages
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GuardianChain | Sovereign Web3 Truth Platform</title>
    <meta name="description" content="Blockchain-powered capsule preservation and verification platform with GTT token yield and DAO governance.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
            color: #f1f5f9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.6;
        }
        .container { max-width: 800px; padding: 2rem; text-align: center; }
        .logo { display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .shield { width: 64px; height: 64px; margin-right: 1rem; }
        h1 { 
            font-size: 3rem; 
            font-weight: bold;
            background: linear-gradient(to right, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .subtitle { font-size: 1.25rem; color: #cbd5e1; margin-bottom: 2rem; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .feature { 
            background: rgba(255, 255, 255, 0.05); 
            padding: 1.5rem; 
            border-radius: 12px; 
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .feature h3 { color: #a78bfa; margin-bottom: 0.5rem; }
        .buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin: 2rem 0; }
        .btn { 
            padding: 12px 24px; 
            border-radius: 8px; 
            text-decoration: none; 
            font-weight: 600;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.9; }
        .btn-primary { 
            background: linear-gradient(to right, #06b6d4, #8b5cf6); 
            color: white; 
        }
        .btn-secondary { 
            background: rgba(255, 255, 255, 0.1); 
            color: white; 
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .contact { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .contact a { color: #60a5fa; text-decoration: none; }
        .contact a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <svg class="shield" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
            </svg>
            <h1>GuardianChain</h1>
        </div>
        
        <p class="subtitle">Sovereign Web3 Truth Platform</p>
        <p>Blockchain-powered capsule preservation and verification with GTT token yield and DAO governance</p>
        
        <div class="buttons">
            <a href="https://guardianchain.app" class="btn btn-primary">Launch Platform</a>
            <a href="./GuardianChain_Revenue_Explainer_Deck.pdf" class="btn btn-secondary">Revenue Deck</a>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>GTT Token</h3>
                <p>Yield-generating token for capsule creation, verification, and DAO governance with transparent revenue distribution.</p>
            </div>
            <div class="feature">
                <h3>Truth DAO</h3>
                <p>Decentralized governance for platform development, grant distribution, and community-driven verification systems.</p>
            </div>
            <div class="feature">
                <h3>Global Network</h3>
                <p>Worldwide validator network ensuring truth preservation with multi-chain support and institutional compliance.</p>
            </div>
        </div>
        
        <div class="contact">
            <h3 style="color: #a78bfa; margin-bottom: 1rem;">Partner with GuardianChain</h3>
            <p>For investors, grants, and partnership opportunities</p>
            <p style="margin-top: 1rem;">
                <a href="mailto:compliance@guardianchain.app">compliance@guardianchain.app</a> | 
                <a href="https://guardianchain.app">guardianchain.app</a>
            </p>
        </div>
    </div>
</body>
</html>`;

// Write the index.html file
fs.writeFileSync('public/index.html', indexHtml);
console.log('✓ Created public/index.html for GitHub Pages');

console.log('\n🚀 Static deployment files created successfully!');
console.log('\nTo deploy to GitHub Pages:');
console.log('1. Push this repository to GitHub');
console.log('2. Enable GitHub Pages in repository settings');
console.log('3. Set source to "Deploy from a branch"');
console.log('4. Select "main" branch and "/public" folder');
console.log('5. Your site will be available at: https://guardian-global.github.io/guardianchain_app/');