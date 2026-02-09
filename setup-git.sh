#!/bin/bash

# Git Setup Script for La Plume Intelligence
# GitHub User: martenk123
# Email: marten.kopp@laplumemedia.nl

echo "🔧 Setting up Git configuration..."

# Set global Git config
git config --global user.name "martenk123"
git config --global user.email "marten.kopp@laplumemedia.nl"

# Verify configuration
echo ""
echo "✅ Git configuration set:"
echo "   Username: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
echo ""

# Initialize repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    
    # Set local config (overrides global if needed)
    git config user.name "martenk123"
    git config user.email "marten.kopp@laplumemedia.nl"
    
    echo "✅ Git repository initialized"
else
    echo "ℹ️  Git repository already initialized"
fi

echo ""
echo "🎉 Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Add files: git add ."
echo "2. Commit: git commit -m 'Initial commit'"
echo "3. Add remote: git remote add origin https://github.com/martenk123/YOUR-REPO-NAME.git"
echo "4. Push: git push -u origin main"
