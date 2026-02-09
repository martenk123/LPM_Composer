#!/bin/bash

# Fix Runtime Error: Cannot find module './611.js'
# This script clears the Next.js build cache and restarts the dev server

echo "🔧 Fixing Next.js runtime error..."

# Stop any running dev server
echo "Stopping dev server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No server running"

# Remove build cache
echo "Clearing .next directory..."
rm -rf .next

# Remove node_modules cache
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next/cache 2>/dev/null || true

echo "✅ Cache cleared!"
echo ""
echo "Now restart your dev server with:"
echo "  npm run dev"
