This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎉 New: Blog Features

FishOn.my now includes a comprehensive blog system with:
- **Admin Dashboard** for content management (`/admin/blog`)
- **WYSIWYG Editor** for creating rich blog posts
- **Comments System** with moderation
- **Newsletter Integration** with subscription management
- **Social Media Sharing** (Facebook, Twitter, LinkedIn, WhatsApp)
- **Advanced Search** with filters
- **Table of Contents** auto-generated from headings
- **Reading Progress Indicator**
- **Author Profiles** with bio and social links

See [BLOG_IMPLEMENTATION_SUMMARY.md](./BLOG_IMPLEMENTATION_SUMMARY.md) for quick start guide.  
See [docs/BLOG_FEATURES_IMPLEMENTATION.md](./docs/BLOG_FEATURES_IMPLEMENTATION.md) for detailed documentation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Integration

This project connects to the **Fishon Captain backend** in read-only mode to fetch charter and captain data. The integration includes automatic fallback to dummy data if the backend is unavailable.

### Configuration

1. Copy the sample environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Configure the backend API URL (optional):

   ```bash
   FISHON_CAPTAIN_API_URL="https://api.fishon-captain.example.com"
   FISHON_CAPTAIN_API_KEY="your-api-key"  # Optional
   ```

   **Note:** If `FISHON_CAPTAIN_API_URL` is not set, the app will use dummy data automatically.

3. For local database setup (angler registration), update `DATABASE_URL`:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/fishon?schema=public"
   ```

### Documentation

See [docs/BACKEND_INTEGRATION.md](./docs/BACKEND_INTEGRATION.md) for detailed information about:
- Backend API endpoints
- Data flow architecture
- Testing and deployment
- Troubleshooting

## Database & Prisma

This project uses [Prisma](https://www.prisma.io/) for data access. A Prisma client singleton is available at `src/lib/prisma.ts`.

### Local setup

1. Run the migrations and generate the client:

   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:generate
   ```

### Deploying on Vercel

1. Provision a Vercel Postgres database and copy the `DATABASE_URL` (and optional `SHADOW_DATABASE_URL`) from the Vercel dashboard.
2. Add the environment variables to your Vercel project (`Production` + `Preview` environments):
   - `DATABASE_URL`
   - `FISHON_CAPTAIN_API_URL` (optional - for backend integration)
   - `FISHON_CAPTAIN_API_KEY` (optional - if backend requires auth)

3. Add the Prisma migrate step to the build by configuring the **Build & Development Settings** to run:

   ```bash
   npm run prisma:migrate-deploy && npm run build
   ```

4. Redeploy the project. Prisma will run migrations before compiling the Next.js app.
