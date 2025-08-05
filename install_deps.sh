#!/bin/bash
# Script to reinstall dependencies properly

echo "Reinstalling node dependencies..."
rm -rf node_modules package-lock.json

# Use npm directly to install
npm install

echo "Dependencies installation complete"