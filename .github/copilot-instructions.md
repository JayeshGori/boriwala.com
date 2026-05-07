# AI Coding Assistant Instructions for Boriwala Trading Co. B2B Website

## Project Overview
This is a production-ready B2B catalogue + enquiry website built with Next.js 15/16, React 19, Tailwind CSS, and MongoDB. It features a public website for browsing products and submitting enquiries, plus an admin panel for content management.

## Architecture
- **Framework**: Next.js App Router with server-side rendering
- **Frontend**: React 19 with TypeScript, Tailwind CSS for styling
- **Backend**: Next.js API Routes (no separate backend)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based admin auth with bcryptjs
- **File Storage**: Local uploads to `public/uploads` (consider cloud storage for production)
- **Key Directories**:
  - `src/app/`: App Router pages and API routes
  - `src/components/`: Reusable UI components
  - `src/lib/`: Utilities, database, auth, models
  - `src/types/`: TypeScript interfaces

## Data Flow
- Public pages fetch data via API routes (e.g., `/api/products`)
- Admin panel uses authenticated API routes for CRUD operations
- Enquiries submitted via forms, stored in MongoDB
- Products/categories use slug-based URLs with ObjectId resolution
- Buyer auth context controls price visibility (approval-based)

## Critical Workflows
- **Development**: `npm run dev` (starts dev server on :3000)
- **Build**: `npm run build` (production build)
- **Start**: `npm start` (production server)
- **Lint**: `npm run lint` (ESLint check)
- **Database Seeding**: POST to `/api/seed` after starting dev server (creates sample data)
- **Admin Access**: `/admin` with default credentials `admin@boriwala.com` / `admin123`

## Project-Specific Conventions
- **Imports**: Use `@/*` path alias for `src/` directory
- **API Responses**: Always return `{ success: boolean, data?: T, error?: string }` format
- **Models**: Define Mongoose schemas with TypeScript interfaces (e.g., `IProductDoc`)
- **Queries**: Use `.lean()` for read operations, `.populate()` for referenced fields
- **Auth**: Use `authenticateRequest(req)` in API routes requiring admin access
- **Slugs**: Auto-generate unique slugs using `createSlug()` from utils
- **Styling**: Tailwind CSS with custom classes; use `cn()` utility for conditional classes
- **Components**: Functional components with TypeScript props interfaces
- **Forms**: Use `react-hot-toast` for notifications
- **WhatsApp Integration**: Use `getWhatsAppLink()` for pre-filled messages

## Common Patterns
- **Product Filtering**: Support category/subcategory slugs, condition, search, filterAttributes (fa_* query params)
- **Pagination**: Standard page/limit params with total/totalPages in response
- **Error Handling**: Try/catch with console.error and 500 status for server errors
- **File Uploads**: Use `formidable` in API routes for multipart data
- **Buyer Pricing**: Check `isApproved` from `useBuyerAuth()` context before showing prices
- **Admin CRUD**: GET/POST/PUT/DELETE routes with auth checks
- **SEO**: Use Next.js metadata API in page components

## Integration Points
- **MongoDB**: Connection cached globally; models in `src/lib/models/`
- **WhatsApp**: Direct links with `wa.me/` URLs and encoded messages
- **Google Maps**: Embed in contact page via settings
- **Social Links**: Configurable in admin settings

## Key Files to Reference
- `src/lib/mongodb.ts`: Database connection setup
- `src/lib/models/Product.ts`: Example Mongoose model with interface
- `src/app/api/products/route.ts`: CRUD API pattern
- `src/lib/auth.ts`: JWT authentication utilities
- `src/components/products/ProductCard.tsx`: Component with auth/pricing logic
- `src/types/index.ts`: All TypeScript interfaces
- `src/lib/utils.ts`: Helper functions (slugify, formatPrice, etc.)
- `README.md`: Full setup and deployment instructions

## Development Tips
- Always run `npm run lint` before committing
- Test admin features after seeding database
- Use environment variables from `.env.local` (copy from `env.example`)
- For production, migrate file uploads to cloud storage (update `/api/upload`)
- Buyer approval system requires additional implementation for real B2B workflow