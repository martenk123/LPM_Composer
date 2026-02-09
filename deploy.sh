#!/bin/bash

# Vercel Deployment Script for La Plume Intelligence
# Email: marten.kopp@laplumemedia.nl

echo "🚀 Setting up Vercel deployment for La Plume Intelligence..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - La Plume Intelligence"
fi

# Login to Vercel
echo "🔐 Logging in to Vercel..."
echo "Please use email: marten.kopp@laplumemedia.nl"
vercel login

# Deploy to preview
echo "🚀 Deploying to Vercel preview..."
vercel

# Ask if user wants to deploy to production
read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    vercel --prod
fi

echo "✅ Deployment complete!"
