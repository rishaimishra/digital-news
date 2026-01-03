# Digital News Platform

A comprehensive digital news platform built with Next.js 16, PostgreSQL, Prisma, and NextAuth.js.

## Features

- Multi-user role system (Public, Reporter, Editor, Admin)
- News article management with approval workflow
- E-Paper module
- Advertisement management
- Compliance features (Grievance redressal, Legal pages)
- RSS feeds
- Multi-language support
- City and category-based content organization

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **UI**: Shadcn/ui + Tailwind CSS
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and NextAuth secret
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets and uploads
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET` - Generate a secret key (run `openssl rand -base64 32`)
5. Vercel will automatically detect Next.js and deploy

### Environment Variables for Production

Make sure to set these in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - A random secret key

### Database Setup

Before deploying, make sure your PostgreSQL database is set up and run:
```bash
npx prisma generate
npx prisma db push
```

## License

Private project

