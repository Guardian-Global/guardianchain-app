#!/bin/bash

# GuardianChain Professional File Tree Cleanup Script
# This script removes legacy, duplicate, and unused files while preserving working functionality

set -e

echo "🧹 GuardianChain Professional Cleanup Tool"
echo "============================================="

# Project Analysis (Based on user requirements)
PROJECT_NAME="GuardianChain"
PROJECT_DESC="Web3 platform for time-locked proof verification and decentralized governance"
TECH_STACK="Node.js + TypeScript + Express + Vite + Tailwind CSS + PostgreSQL + Blockchain"
TARGET_PLATFORM="Web (PWA capable)"
ENVIRONMENT="Online with offline PWA support"
HOSTING="Replit with deployment capabilities"
INTERFACE="Web interface with cyberpunk theme, dark mode"

# Files/Folders to ALWAYS PRESERVE
PRESERVE_DIRS=(
  "client/src"
  "server"
  "shared"
  "contracts"
  "lib"
  "config"
  "node_modules"
  "abis"
  "artifacts"
)

PRESERVE_FILES=(
  ".env"
  ".env.local"
  "package.json"
  "tsconfig.json"
  "tailwind.config.ts"
  "vite.config.ts"
  "hardhat.config.ts"
  "README.md"
  "replit.md"
)

# Legacy files identified for cleanup (SAFE TO REMOVE)
LEGACY_FILES=(
  "client/src/App-Original.tsx"
  "server/auth/legacyAuth.ts"
  "client/src/components/auth/LegacyAuth.tsx"
  "client/src/pages/legacy-*"
  "client/src/components/legacy-*"
  "*.backup"
  "*.old"
  "*.deprecated"
  "temp-*"
  "test-*"
  ".DS_Store"
  "*.log"
  "*.tmp"
)

# Duplicate resolution mappings
DUPLICATE_MAPPINGS=(
  "client/src/pages/explorer.tsx:client/src/pages/Explorer.tsx"
  "client/src/pages/dashboard/Yield.tsx:client/src/pages/dashboard/yield.tsx"
  "client/src/pages/pricing.tsx:client/src/pages/Pricing.tsx"
  "client/src/pages/admin.tsx:client/src/pages/Admin.tsx"
  "client/src/pages/dao.tsx:client/src/pages/DAO.tsx"
  "client/src/pages/referral.tsx:client/src/pages/Referral.tsx"
  "client/src/pages/terms.tsx:client/src/pages/Terms.tsx"
)

# Dry run function
dry_run() {
  echo "📋 DRY RUN - Files that would be removed:"
  echo "========================================"
  
  for file in "${LEGACY_FILES[@]}"; do
    if [[ -f "$file" || -d "$file" ]]; then
      echo "❌ Would remove: $file"
    fi
  done
  
  echo ""
  echo "🔄 Duplicate resolution actions:"
  for mapping in "${DUPLICATE_MAPPINGS[@]}"; do
    source="${mapping%:*}"
    target="${mapping#*:}"
    if [[ -f "$source" && -f "$target" ]]; then
      echo "🔄 Would resolve duplicate: $source -> $target"
    fi
  done
  
  echo ""
  echo "✅ Files that will be PRESERVED:"
  for dir in "${PRESERVE_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
      echo "📁 $dir/"
    fi
  done
  
  for file in "${PRESERVE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
      echo "📄 $file"
    fi
  done
}

# Actual cleanup function
perform_cleanup() {
  echo "🚀 Performing Professional Cleanup..."
  echo "======================================"
  
  # Remove legacy files
  for file in "${LEGACY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
      echo "❌ Removing legacy file: $file"
      rm -f "$file"
    elif [[ -d "$file" ]]; then
      echo "❌ Removing legacy directory: $file"
      rm -rf "$file"
    fi
  done
  
  # Resolve duplicates
  for mapping in "${DUPLICATE_MAPPINGS[@]}"; do
    source="${mapping%:*}"
    target="${mapping#*:}"
    if [[ -f "$source" && -f "$target" ]]; then
      echo "🔄 Resolving duplicate: keeping $target, removing $source"
      rm -f "$source"
    fi
  done
  
  # Clean up empty directories
  find . -type d -empty -not -path "./node_modules/*" -not -path "./.git/*" -delete 2>/dev/null || true
  
  echo "✅ Cleanup completed successfully!"
}

# Main execution
case "${1:-dry-run}" in
  "dry-run")
    dry_run
    echo ""
    echo "💡 Run with --execute to perform actual cleanup"
    ;;
  "--execute"|"execute")
    echo "⚠️  EXECUTING CLEANUP - This will permanently delete files!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [[ $confirm == "yes" ]]; then
      perform_cleanup
    else
      echo "❌ Cleanup cancelled"
      exit 1
    fi
    ;;
  "--force")
    perform_cleanup
    ;;
  *)
    echo "Usage: $0 [dry-run|execute|--force]"
    echo "  dry-run  : Show what would be removed (default)"
    echo "  execute  : Perform cleanup with confirmation"
    echo "  --force  : Perform cleanup without confirmation"
    exit 1
    ;;
esac