# Database Migration Guide - Blog Features

This guide explains how to apply the database changes for the new blog features.

## Overview

The blog features implementation adds the following to your database:
1. New models: `BlogComment`, `NewsletterSubscription`
2. Extended `User` model with author profile fields
3. Extended `BlogPost` model with comments relation

## Prerequisites

- PostgreSQL database configured
- `DATABASE_URL` environment variable set
- Prisma CLI available (`npm run prisma:migrate`)

## Migration Steps

### Option 1: Automated Migration (Recommended)

Run the Prisma migration command:

```bash
npm run prisma:migrate -- --name "add_blog_features"
```

This will:
1. Generate the migration SQL
2. Apply it to your database
3. Update the Prisma Client

### Option 2: Manual Migration

If you need to review the SQL before applying:

1. Generate the migration without applying:
   ```bash
   npx prisma migrate dev --create-only --name "add_blog_features"
   ```

2. Review the generated SQL in `prisma/migrations/[timestamp]_add_blog_features/migration.sql`

3. Apply the migration:
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: Direct SQL Execution

If you prefer to run SQL directly:

```sql
-- Add author profile fields to User table
ALTER TABLE "User" 
  ADD COLUMN "name" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "avatar" TEXT,
  ADD COLUMN "website" TEXT,
  ADD COLUMN "twitter" TEXT,
  ADD COLUMN "facebook" TEXT,
  ADD COLUMN "instagram" TEXT;

-- Create BlogComment table
CREATE TABLE "BlogComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- Create indexes for BlogComment
CREATE INDEX "BlogComment_postId_idx" ON "BlogComment"("postId");
CREATE INDEX "BlogComment_authorId_idx" ON "BlogComment"("authorId");
CREATE INDEX "BlogComment_approved_idx" ON "BlogComment"("approved");

-- Create NewsletterSubscription table
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint and indexes for NewsletterSubscription
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");
CREATE INDEX "NewsletterSubscription_email_idx" ON "NewsletterSubscription"("email");
CREATE INDEX "NewsletterSubscription_active_idx" ON "NewsletterSubscription"("active");

-- Add foreign key constraints
ALTER TABLE "BlogComment" 
  ADD CONSTRAINT "BlogComment_postId_fkey" 
  FOREIGN KEY ("postId") 
  REFERENCES "BlogPost"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE "BlogComment" 
  ADD CONSTRAINT "BlogComment_authorId_fkey" 
  FOREIGN KEY ("authorId") 
  REFERENCES "User"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;
```

## Post-Migration Steps

### 1. Generate Prisma Client

After applying the migration, regenerate the Prisma Client:

```bash
npm run prisma:generate
```

### 2. Seed Sample Data (Optional)

If you want to populate the database with sample blog content:

```bash
npm run seed:blog
```

This will create:
- A default admin user (`admin@fishon.my`)
- All blog categories
- All blog tags
- Sample blog posts with relationships

### 3. Verify Migration

Check that tables were created successfully:

```bash
npx prisma studio
```

This opens a web interface where you can browse your database tables.

## Rollback Instructions

If you need to rollback the migration:

### Option 1: Using Prisma

```bash
# Reset database to previous migration
npx prisma migrate reset
```

**Warning**: This will clear all data!

### Option 2: Manual Rollback

```sql
-- Drop new tables
DROP TABLE IF EXISTS "BlogComment" CASCADE;
DROP TABLE IF EXISTS "NewsletterSubscription" CASCADE;

-- Remove new columns from User table
ALTER TABLE "User" 
  DROP COLUMN IF EXISTS "name",
  DROP COLUMN IF EXISTS "bio",
  DROP COLUMN IF EXISTS "avatar",
  DROP COLUMN IF EXISTS "website",
  DROP COLUMN IF EXISTS "twitter",
  DROP COLUMN IF EXISTS "facebook",
  DROP COLUMN IF EXISTS "instagram";
```

## Troubleshooting

### Error: "Migration already applied"

If you see this error, the migration has already been applied. You can verify by checking the database or running:

```bash
npx prisma migrate status
```

### Error: "Database connection failed"

Ensure your `DATABASE_URL` is correct in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fishon?schema=public"
```

### Error: "Column already exists"

This means some changes were already applied. You can either:
1. Drop the existing columns/tables manually
2. Create a new migration that only adds what's missing
3. Reset the database (loses all data)

### Error: "Foreign key constraint fails"

Ensure the referenced tables (`BlogPost`, `User`) exist before running the migration.

## Production Deployment

For production environments:

1. **Backup your database first!**
   ```bash
   pg_dump your_database > backup_$(date +%Y%m%d).sql
   ```

2. Use `migrate deploy` instead of `migrate dev`:
   ```bash
   npm run prisma:migrate-deploy
   ```

3. Test in a staging environment first

4. Plan for downtime or use a migration strategy that allows zero-downtime deployments

## Environment Variables

Ensure these are set in your production environment:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://fishon.my"
```

## Vercel Deployment

If deploying to Vercel:

1. Add `DATABASE_URL` to environment variables in Vercel dashboard
2. The build command should include migration:
   ```bash
   npm run prisma:migrate-deploy && npm run build
   ```

## Support

If you encounter issues:
1. Check Prisma documentation: https://www.prisma.io/docs/
2. Review error logs carefully
3. Verify database connection
4. Ensure Prisma version compatibility

---

**Last Updated**: October 2025  
**Prisma Version**: 6.x  
**PostgreSQL Version**: 12+
