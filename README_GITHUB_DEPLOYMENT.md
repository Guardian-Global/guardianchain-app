# GuardianChain GitHub Pages Deployment Guide

## Overview
This guide will help you deploy GuardianChain to GitHub Pages at `https://guardian-global.github.io/guardianchain_app/`.

## Quick Deployment Steps

### 1. Repository Setup
```bash
# Clone or fork the repository to your GitHub account
git clone https://github.com/your-username/guardianchain_app.git
cd guardianchain_app

# Generate static files
node deploy-static.js
```

### 2. GitHub Pages Configuration
1. Go to your repository on GitHub.com
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select "Deploy from a branch"
4. Choose **main** branch and **/public** folder
5. Click **Save**

### 3. Custom Domain (Optional)
- Add your custom domain in the "Custom domain" field
- Ensure DNS is configured properly

## Files Created for Deployment

### Static Landing Page
- **public/index.html** - Investor-ready landing page with revenue model overview
- **public/GuardianChain_Revenue_Explainer_Deck.pdf** - Complete revenue deck for investors

### CI/CD Workflow
- **.github/workflows/deploy.yml** - Automated GitHub Actions deployment
- **vite.config.js** - Optimized build configuration for static deployment

### Features of Static Landing Page

#### Professional Design
- Clean, Next.js template structure following your preferred design philosophy
- Yellow-400 titles, purple-300 headings, blue-400 links
- White/5 background cards with proper spacing
- Mobile-responsive layout

#### Revenue Model Highlights
- **Capsule Mint**: 70% Creator / 20% DAO / 10% Platform
- **Capsule Unlock**: 50% Creator / 25% Referrer / 25% DAO  
- **Yield Distribution**: 90% Creator / 10% DAO

#### Compliance Framework
- GTT requires active participation, not passive income
- DAO-controlled treasury with public disclosures
- Tiered KYC: view-only, light KYC, full KYC
- Global compliance: US / EU / FATF ready

#### Contact Information
- **Investor Contact**: compliance@guardianchain.app
- **Platform**: guardianchain.app
- Direct PDF download access for revenue deck

## Development Commands

```bash
# Generate static deployment files
node deploy-static.js

# Run development server
npm run dev

# Check TypeScript
npm run check
```

## URL Structure
- **Main Site**: https://guardian-global.github.io/guardianchain_app/
- **Revenue Deck**: https://guardian-global.github.io/guardianchain_app/GuardianChain_Revenue_Explainer_Deck.pdf

## Verification Checklist
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled in settings
- [ ] Source set to "main" branch and "/public" folder  
- [ ] Static files generated and committed
- [ ] Revenue deck accessible via direct URL
- [ ] Landing page displays correctly
- [ ] Contact links working properly
- [ ] Mobile responsiveness verified

## Troubleshooting

### Common Issues
1. **404 Error**: Ensure "main" branch and "/public" folder are selected
2. **CSS Not Loading**: Check file paths in index.html
3. **PDF Not Accessible**: Verify file is in public/ directory
4. **Custom Domain Issues**: Check DNS configuration

### Force Refresh Deployment
```bash
# Make a small change and push to trigger redeployment
git commit --allow-empty -m "Trigger GitHub Pages rebuild"
git push
```

## Integration with Main Platform
The static site serves as an investor-ready landing page while the main platform runs on:
- **Development**: Replit environment
- **Production**: Deployable via suggested infrastructure

This dual approach provides maximum investor accessibility while maintaining the full Web3 platform functionality.