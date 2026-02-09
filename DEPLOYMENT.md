# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Ensure you're logged in with `marten.kopp@laplumemedia.nl`
2. **Vercel CLI**: Install if not already installed
   ```bash
   npm i -g vercel
   ```

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   Use your email: `marten.kopp@laplumemedia.nl`

2. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account/team
   - Link to existing project? **No** (for first deployment)
   - Project name? `concept-composer-web` (or your preferred name)
   - Directory? `./` (current directory)
   - Override settings? **No**

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and login with `marten.kopp@laplumemedia.nl`

2. Click **"Add New Project"**

3. **Import Git Repository**:
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository
   - Or use **"Import Git Repository"** if you've pushed to a remote

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Click **"Deploy"**

## Environment Variables

If you need environment variables:

1. Go to your project settings in Vercel Dashboard
2. Navigate to **"Environment Variables"**
3. Add any required variables (e.g., API keys, database URLs)

## Project Settings

The project is configured with:
- **Framework**: Next.js 15
- **Node Version**: Auto-detected (recommended: 18.x or higher)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected by Next.js)

## Custom Domain (Optional)

1. Go to your project settings in Vercel Dashboard
2. Navigate to **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Once connected to a Git repository:
- Every push to `main`/`master` branch = Production deployment
- Every push to other branches = Preview deployment

## Troubleshooting

### Build Errors
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Review build logs in Vercel Dashboard

### Runtime Errors
- Check server logs in Vercel Dashboard
- Verify environment variables are set correctly
- Ensure API routes are properly configured

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```
