# Quick Vercel Deployment Commands

## Option 1: Using Vercel CLI (Recommended)

Run these commands in your terminal:

```bash
# 1. Login to Vercel (if not already logged in)
vercel login

# 2. Deploy to production
vercel --prod

# Or deploy to preview first
vercel
```

During deployment, Vercel will ask:
- Set up and deploy? **Yes**
- Which scope? (Select your account/team)
- Link to existing project? **No** (for first deployment)
- What's your project's name? **digital-news** (or press Enter)
- In which directory is your code located? **./** (press Enter)

## Option 2: Set Environment Variables via CLI

After deployment, set environment variables:

```bash
# Set DATABASE_URL
vercel env add DATABASE_URL production

# Set NEXTAUTH_SECRET (generate one first: openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production

# Set NEXTAUTH_URL (get this from your deployment URL)
vercel env add NEXTAUTH_URL production
```

## Option 3: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to Settings → Environment Variables
4. Add the required variables

## Required Environment Variables

- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., https://digital-news.vercel.app)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

