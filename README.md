# Boriwala Trading Co. — B2B Trading Website

A production-ready B2B catalogue + enquiry website built with **Next.js 15**, **React**, **Tailwind CSS**, and **MongoDB**.

## Features

### Public Website
- **Home** — Hero banner, category grid, featured products, why choose us, industries served, testimonials, CTA
- **Products** — Category/subcategory filters, condition filter, search, pagination, grid layout
- **Product Detail** — Image gallery, video support, specifications table, enquiry form, WhatsApp button, related products
- **Categories** — All categories with subcategory navigation
- **About Us** — Company profile, strengths, infrastructure, stats
- **Contact** — Enquiry form, Google Map embed, contact details, WhatsApp button
- **Floating WhatsApp button** on every page

### Admin Panel (`/admin`)
- Secure JWT-based login
- **Dashboard** — Stats overview, recent enquiries, quick actions
- **Category Management** — CRUD with subcategory support, image upload
- **Product Management** — Full CRUD, multi-image upload, specifications, pricing toggle, featured toggle
- **Enquiry Management** — View/filter/search, mark as responded, export CSV
- **Settings** — Company info, contact details, social links, about content, hero section

### Technical
- Next.js App Router with server-side rendering
- MongoDB with Mongoose ODM
- JWT authentication for admin
- File upload to `public/uploads`
- SEO-optimized with metadata
- Fully responsive mobile-first design
- Modern industrial B2B design with Tailwind CSS

---

## Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Framework  | Next.js 15 (App Router) |
| UI         | React 19, Tailwind CSS |
| Backend    | Next.js API Routes     |
| Database   | MongoDB + Mongoose     |
| Auth       | JWT + bcryptjs         |
| Icons      | react-icons            |
| Toasts     | react-hot-toast        |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages with shared layout
│   │   ├── products/       # Products listing & detail
│   │   ├── categories/     # Categories page
│   │   ├── about/          # About page
│   │   └── contact/        # Contact page
│   ├── admin/              # Admin panel
│   │   ├── login/          # Admin login
│   │   ├── categories/     # Category management
│   │   ├── products/       # Product management (list, new, edit)
│   │   ├── enquiries/      # Enquiry management
│   │   └── settings/       # Site settings
│   ├── api/                # API routes
│   │   ├── auth/           # Login, logout, me
│   │   ├── categories/     # Category CRUD
│   │   ├── products/       # Product CRUD
│   │   ├── enquiries/      # Enquiry CRUD + export
│   │   ├── settings/       # Site settings
│   │   ├── upload/         # File upload
│   │   ├── dashboard/      # Dashboard stats
│   │   └── seed/           # Database seeder
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout with SEO
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Header, Footer, WhatsAppButton
│   ├── home/               # Hero, CategoryGrid, FeaturedProducts, etc.
│   ├── products/           # ProductCard
│   ├── forms/              # EnquiryForm
│   └── admin/              # AdminProvider, Sidebar
├── lib/
│   ├── mongodb.ts          # Database connection
│   ├── auth.ts             # JWT auth utilities
│   ├── admin-auth.ts       # Client-side admin auth
│   ├── utils.ts            # Helper functions
│   └── models/             # Mongoose models
│       ├── Category.ts
│       ├── Product.ts
│       ├── Enquiry.ts
│       ├── User.ts
│       └── Settings.ts
├── types/
│   └── index.ts            # TypeScript interfaces
└── middleware.ts            # Security headers
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone <repo-url>
cd boriwala.com
npm install
```

### 2. Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Edit `.env.local` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/boriwala
NEXTAUTH_SECRET=your-strong-secret-key
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@boriwala.com
ADMIN_PASSWORD=admin123
WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Seed the Database

Start the dev server and hit the seed endpoint:

```bash
npm run dev
```

Then open in browser or use curl:
```
POST http://localhost:3000/api/seed
```

This creates:
- Admin user (admin@boriwala.com / admin123)
- 8 sample categories with subcategories
- 6 sample products
- Default site settings

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Admin Panel

**URL:** `/admin`
**Default credentials:** `admin@boriwala.com` / `admin123`

> Change the password after first login in production.

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

> Note: File uploads to `public/uploads` won't persist on Vercel's serverless. For production, integrate a cloud storage service (AWS S3, Cloudinary, etc.) by updating `src/app/api/upload/route.ts`.

### VPS / Self-Hosted

```bash
# Build
npm run build

# Start production server
npm start
```

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "boriwala" -- start
pm2 save
pm2 startup
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## API Endpoints

| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| POST   | `/api/auth/login`         | No   | Admin login              |
| POST   | `/api/auth/logout`        | No   | Admin logout             |
| GET    | `/api/auth/me`            | Yes  | Get current admin        |
| GET    | `/api/categories`         | No   | List categories          |
| POST   | `/api/categories`         | Yes  | Create category          |
| PUT    | `/api/categories/:id`     | Yes  | Update category          |
| DELETE | `/api/categories/:id`     | Yes  | Delete category          |
| GET    | `/api/products`           | No   | List products (filtered) |
| POST   | `/api/products`           | Yes  | Create product           |
| GET    | `/api/products/:id`       | No   | Get product by ID/slug   |
| PUT    | `/api/products/:id`       | Yes  | Update product           |
| DELETE | `/api/products/:id`       | Yes  | Delete product           |
| GET    | `/api/enquiries`          | Yes  | List enquiries           |
| POST   | `/api/enquiries`          | No   | Submit enquiry           |
| PUT    | `/api/enquiries/:id`      | Yes  | Update enquiry           |
| DELETE | `/api/enquiries/:id`      | Yes  | Delete enquiry           |
| GET    | `/api/enquiries/export`   | Yes  | Export CSV               |
| GET    | `/api/settings`           | No   | Get site settings        |
| PUT    | `/api/settings`           | Yes  | Update settings          |
| POST   | `/api/upload`             | Yes  | Upload files             |
| GET    | `/api/dashboard`          | Yes  | Dashboard stats          |
| POST   | `/api/seed`               | No   | Seed database            |

---

## License

Private — All rights reserved.

