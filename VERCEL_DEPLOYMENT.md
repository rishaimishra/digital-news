# Vercel Deployment Guide

## Quick Deployment Steps

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `digital-news` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build` (or leave default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=generate_a_random_secret_key
   ```

   **To generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

## Important Notes

### Database Setup
Before deploying, make sure you have:
- A PostgreSQL database (you can use Vercel Postgres, Supabase, Neon, or any PostgreSQL provider)
- Run migrations on your database:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

### Environment Variables
All environment variables must be set in Vercel:
- `DATABASE_URL` - Required for database connections
- `NEXTAUTH_URL` - Required for authentication (update after first deployment)
- `NEXTAUTH_SECRET` - Required for session encryption

### File Uploads
The current implementation uses local file storage. For production, consider:
- Using Vercel Blob Storage
- Using AWS S3
- Using Cloudinary
- Using other cloud storage solutions

### Build Settings
Vercel should automatically detect Next.js, but if needed:
- Build Command: `prisma generate && next build`
- Output Directory: `.next`
- Install Command: `npm install`

## Post-Deployment

1. **Update NEXTAUTH_URL**
   After first deployment, update `NEXTAUTH_URL` in Vercel environment variables to match your actual domain.

2. **Create First Admin User**
   You'll need to create an admin user. You can:
   - Use Prisma Studio locally and connect to production DB
   - Create a seed script
   - Use your database provider's interface

3. **Set up Categories and Cities**
   Use the admin panel to add categories and cities after logging in as admin.

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure Prisma can connect to your database
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if your database allows connections from Vercel IPs
- Ensure SSL is configured if required

### Authentication Not Working
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set and not empty
- Review NextAuth logs in Vercel function logs

