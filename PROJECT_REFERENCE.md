# Boriwala Trading Co. — Project Reference

> Last updated: March 2026

---

## 1. Project Overview

**Boriwala Trading Co.** is a full-stack B2B e-commerce platform for trading packaging materials — PP bags, jute bags, BOPP bags, woven sacks, rafiya granules, and more. It includes a public website, admin panel, buyer authentication system, and a companion mobile app.

| Component | Tech | URL / Path |
|-----------|------|------------|
| Website + Admin | Next.js 16 (App Router, React 19) | `boriwala.com/` — deployed on Vercel |
| Database | MongoDB Atlas + Mongoose 9 | via `MONGODB_URI` env variable |
| Mobile App | Expo (React Native) + WebView | `boriwala-app/` — standalone APK |
| Styling | TailwindCSS 4 | PostCSS plugin |
| Auth | JWT (jsonwebtoken + bcryptjs) | Cookie + Bearer token |
| Notifications | Expo Push Notifications API | `expo-notifications` in app |

---

## 2. Tech Stack Details

### Dependencies (Website)
- **next** `16.1.6` — framework (App Router, Turbopack)
- **react / react-dom** `19.2.3`
- **mongoose** `9.2.2` — MongoDB ODM
- **jsonwebtoken** `9.0.3` — JWT generation & verification
- **bcryptjs** `3.0.3` — password hashing (12 rounds)
- **react-hot-toast** `2.6.0` — toast notifications
- **react-icons** `5.5.0` — Feather icons (Fi*) and Font Awesome (Fa*)
- **react-quill-new** `3.8.3` — rich text editor (admin descriptions)
- **slugify** `1.6.6` — URL slug generation
- **zod** `4.3.6` — schema validation
- **sharp** `0.34.5` — image optimization

### Dependencies (Mobile App)
- **expo** `~55.0.2` (SDK 55)
- **react-native** `0.83.2`
- **react-native-webview** `13.16.0` — renders website pages
- **@react-navigation/bottom-tabs** `7.15.2` — tab navigation
- **expo-notifications** `~0.28.9` — push notifications
- **expo-device** `~6.0.2` — device info
- **expo-constants** `~16.0.2` — app constants

---

## 3. Environment Variables

```env
MONGODB_URI=mongodb+srv://...           # MongoDB Atlas connection string
NEXTAUTH_SECRET=your-secret-key         # JWT signing secret
NEXTAUTH_URL=https://boriwala.vercel.app
ADMIN_EMAIL=admin@boriwala.com          # Seed admin email
ADMIN_PASSWORD=admin123                 # Seed admin password
WHATSAPP_NUMBER=919999999999            # Server-side WhatsApp number
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999 # Client-side WhatsApp number
NEXT_PUBLIC_SITE_URL=https://boriwala.vercel.app
```

---

## 4. Database Models (MongoDB)

### 4.1 User (`src/lib/models/User.ts`)
Stores admins, editors, and buyers.

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | bcrypt hashed |
| phone | String | optional |
| companyName | String | optional |
| role | Enum | `admin`, `editor`, `buyer` |
| isActive | Boolean | default: true |
| isApproved | Boolean | default: false — admin must approve buyers to see pricing |
| timestamps | | createdAt, updatedAt |

### 4.2 Category (`src/lib/models/Category.ts`)
Hierarchical categories (parent/child).

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| slug | String | unique, auto-generated |
| description | String | optional |
| image | String | base64 data URL |
| icon | String | optional icon identifier |
| parent | ObjectId → Category | null = top-level |
| order | Number | display order |
| isActive | Boolean | default: true |

**Indexes:** `slug`, `parent`

### 4.3 Product (`src/lib/models/Product.ts`)
Core product catalog.

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| slug | String | unique, auto-generated |
| description | String | required (rich text HTML) |
| shortDescription | String | optional |
| images | [String] | base64 data URLs (max 2MB each) |
| video | String | optional video URL |
| category | ObjectId → Category | required |
| subcategory | ObjectId → Category | optional |
| condition | Enum | `new`, `old`, `rejected` |
| price | Number | optional — only visible to approved buyers |
| showPrice | Boolean | controls price visibility |
| specifications | [{key, value}] | dynamic key-value pairs |
| filterAttributes | Map<String, String> | category-specific filters (quality, gram, etc.) |
| moq | String | minimum order quantity |
| availability | Enum | `in_stock`, `out_of_stock`, `on_demand`, `make_to_order` |
| isFeatured | Boolean | shown on homepage |
| isActive | Boolean | default: true |
| tags | [String] | search tags |
| material | String | e.g. "PP", "Jute" |
| productType | String | product type label |
| size | String | size description |
| application | String | usage/application |

**Indexes:** `slug`, `category`, `subcategory`, `isFeatured`, `condition`, full-text on `name+description+tags`

### 4.4 Enquiry (`src/lib/models/Enquiry.ts`)
Customer enquiries (from Contact page / product pages).

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| phone | String | required |
| email | String | required |
| companyName | String | optional |
| productName | String | auto-filled if from product page |
| productId | ObjectId → Product | optional |
| quantity | String | optional |
| message | String | required |
| isResponded | Boolean | default: false |
| respondedAt | Date | set when admin marks responded |
| notes | String | admin notes |

### 4.5 SellerEnquiry (`src/lib/models/SellerEnquiry.ts`)
Industries wanting to sell used bags/materials to Boriwala.

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| phone | String | required |
| email | String | optional |
| companyName | String | optional |
| city | String | required |
| materialType | String | required — jute_bags, plastic_bags, bopp_bags, woven_sacks, rafiya_granules, hdpe_bags, cement_bags, other |
| materialDescription | String | optional |
| quantity | String | required (e.g. "500 kg", "2 tons") |
| videoLinks | [String] | YouTube/Drive links (max 5) |
| photos | [String] | base64 data URLs (max 5, 2MB each) |
| status | Enum | `new`, `contacted`, `negotiating`, `closed`, `rejected` |
| adminNotes | String | internal notes |

### 4.6 Settings (`src/lib/models/Settings.ts`)
Single-document site-wide configuration.

| Field | Type | Notes |
|-------|------|-------|
| companyName | String | "Boriwala Trading Co." |
| tagline | String | site tagline |
| phone | [String] | contact numbers |
| email | [String] | contact emails |
| address | String | physical address |
| whatsappNumber | String | WhatsApp number |
| googleMapEmbed | String | Google Maps embed HTML |
| socialLinks | Object | facebook, instagram, linkedin, twitter, youtube |
| aboutUs | String | full about text (rich text) |
| aboutUsShort | String | short description |
| experience | String | e.g. "15+ Years" |
| infrastructure | String | infrastructure details |
| certifications | [String] | certification names |
| strengths | [String] | company strengths |
| logo | String | logo image |
| heroImages | [String] | homepage hero slider images |
| heroTitle | String | hero headline |
| heroSubtitle | String | hero sub-headline |

### 4.7 Notification (`src/lib/models/Notification.ts`)
Push notification history (sent from admin panel).

| Field | Type | Notes |
|-------|------|-------|
| title | String | required |
| body | String | required |
| type | Enum | `offer`, `price_drop`, `new_product`, `general` |
| sentCount | Number | successful deliveries |
| failedCount | Number | failed deliveries |
| sentAt | Date | when notification was sent |

### 4.8 PushToken (`src/lib/models/PushToken.ts`)
Registered Expo push tokens from mobile devices.

| Field | Type | Notes |
|-------|------|-------|
| token | String | unique Expo push token |
| platform | Enum | `android`, `ios` |
| deviceName | String | device identifier |
| isActive | Boolean | false = invalid/unregistered |

---

## 5. API Endpoints

### 5.1 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Register new buyer (role=buyer, isApproved=false) |
| POST | `/api/auth/buyer-login` | Public | Buyer login → sets `buyer_token` cookie |
| POST | `/api/auth/buyer-logout` | Public | Clear buyer cookie |
| GET | `/api/auth/buyer-me` | Buyer cookie | Get current buyer profile |
| POST | `/api/auth/login` | Public | Admin login → returns JWT |
| POST | `/api/auth/logout` | Public | Clear admin cookie |
| GET | `/api/auth/me` | Admin JWT | Get current admin profile |

### 5.2 Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List products (paginated, filterable, searchable) |
| POST | `/api/products` | Admin | Create new product |
| GET | `/api/products/[id]` | Public | Get single product by ID or slug |
| PUT | `/api/products/[id]` | Admin | Update product |
| DELETE | `/api/products/[id]` | Admin | Delete product |

**Product GET query params:** `page`, `limit`, `category` (slug or ID), `subcategory`, `condition`, `featured`, `search`, `material`, `productType`, `activeOnly`, `sort` (newest/oldest/name_asc/name_desc/price_asc/price_desc), `fa_*` (filter attributes like `fa_quality=gold`)

### 5.3 Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | List all categories (with subcategories) |
| POST | `/api/categories` | Admin | Create category |
| GET | `/api/categories/[id]` | Public | Get single category |
| PUT | `/api/categories/[id]` | Admin | Update category |
| DELETE | `/api/categories/[id]` | Admin | Delete category |

### 5.4 Enquiries (Customer → Boriwala)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enquiries` | Admin | List enquiries (paginated, filterable by responded/search/date) |
| POST | `/api/enquiries` | Public | Submit new enquiry |
| GET | `/api/enquiries/[id]` | Admin | Get single enquiry |
| PATCH | `/api/enquiries/[id]` | Admin | Update enquiry (mark responded, add notes) |
| DELETE | `/api/enquiries/[id]` | Admin | Delete enquiry |
| GET | `/api/enquiries/export` | Admin | Export enquiries as CSV |

### 5.5 Seller Enquiries (Industry → Boriwala: "Sell to Us")

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/seller-enquiry` | Public | Submit seller enquiry with photos/video links |
| GET | `/api/admin/seller-enquiries` | Admin | List all seller enquiries |
| PATCH | `/api/admin/seller-enquiries/[id]` | Admin | Update status/notes |
| DELETE | `/api/admin/seller-enquiries/[id]` | Admin | Delete enquiry |

### 5.6 Buyers Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/buyers` | Admin | List all registered buyers |
| PATCH | `/api/admin/buyers/[id]` | Admin | Approve/reject/toggle buyer |

### 5.7 Push Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/push-tokens` | Public | Register device push token (upsert) |
| GET | `/api/admin/notifications` | Admin | List notification history (last 50) |
| POST | `/api/admin/notifications` | Admin | Send push notification to all devices (via Expo Push API, batches of 100) |
| GET | `/api/admin/notifications/devices` | Admin | Count of active registered devices |

### 5.8 Other

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | Admin | Dashboard stats (totals + recent enquiries) |
| GET/PUT | `/api/settings` | GET=Public, PUT=Admin | Site settings (company info, hero, etc.) |
| POST | `/api/upload` | Admin | Upload images (base64, max 2MB each) |
| GET | `/api/seed` | Public | Seed initial admin user |
| GET | `/api/debug` | Public | Debug/health check |

---

## 6. Frontend Pages

### 6.1 Public Website (Route Group: `(public)`)

Layout: `src/app/(public)/layout.tsx` → wraps children with Header + Footer + WhatsAppButton

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Homepage — Hero, Categories, Featured Products, Why Choose Us, Industries Served, CTA, Testimonials (has its own Header/Footer, not inside `(public)` layout) |
| `/products` | `(public)/products/page.tsx` | Product listing with filters, search, pagination |
| `/products/[slug]` | `(public)/products/[slug]/page.tsx` | Product detail page with image gallery, specs, enquiry form |
| `/categories` | `(public)/categories/page.tsx` | Category grid with subcategories |
| `/about` | `(public)/about/page.tsx` | About Us page |
| `/contact` | `(public)/contact/page.tsx` | Contact page with enquiry form, map, WhatsApp link |
| `/sell-to-us` | `(public)/sell-to-us/page.tsx` | **Sell to Us** — hero, material types, how-it-works, seller form with photo upload + video links |
| `/login` | `(public)/login/page.tsx` | Buyer login |
| `/signup` | `(public)/signup/page.tsx` | Multi-step buyer registration with animations |

### 6.2 Admin Panel (Route: `/admin/*`)

Layout: `src/app/admin/layout.tsx` → Sidebar + AdminProvider + Toaster

| Route | File | Description |
|-------|------|-------------|
| `/admin/login` | `admin/login/page.tsx` | Admin login page (no sidebar) |
| `/admin` | `admin/page.tsx` | Dashboard — stats cards, recent enquiries, quick actions |
| `/admin/categories` | `admin/categories/page.tsx` | CRUD for categories (parent + subcategories) |
| `/admin/products` | `admin/products/page.tsx` | Product list with search/filter |
| `/admin/products/new` | `admin/products/new/page.tsx` | Create new product form |
| `/admin/products/[id]` | `admin/products/[id]/page.tsx` | Edit product |
| `/admin/buyers` | `admin/buyers/page.tsx` | Manage registered buyers — approve/reject |
| `/admin/enquiries` | `admin/enquiries/page.tsx` | Customer enquiries list — respond, add notes, export |
| `/admin/seller-enquiries` | `admin/seller-enquiries/page.tsx` | Seller enquiries — view photos, videos, update status, WhatsApp contact |
| `/admin/notifications` | `admin/notifications/page.tsx` | Send push notifications, view history, device count |
| `/admin/settings` | `admin/settings/page.tsx` | Edit site settings (company info, hero, social links, etc.) |

### 6.3 Admin Sidebar Navigation
Defined in `src/components/admin/Sidebar.tsx`:
1. Dashboard
2. Categories
3. Products
4. Buyers
5. Enquiries
6. Seller Enquiries
7. Notifications
8. Settings

---

## 7. Components

### Layout Components (`src/components/layout/`)
- **Header.tsx** — Sticky header with top bar (phone, email, WhatsApp, login/register), main nav (links + user menu + "Sell to Us" CTA + "Get Quote" CTA), mobile hamburger menu
- **Footer.tsx** — Site footer with company info, links, contact
- **WhatsAppButton.tsx** — Floating WhatsApp button (bottom-right)

### Home Components (`src/components/home/`)
- **HeroBanner.tsx** — Hero slider/banner
- **CategoryGrid.tsx** — Category cards grid
- **FeaturedProducts.tsx** — Featured product carousel/grid
- **WhyChooseUs.tsx** — Trust badges and features
- **IndustriesServed.tsx** — Industry icons/cards
- **CTASection.tsx** — Call-to-action section
- **Testimonials.tsx** — Customer testimonials

### Admin Components (`src/components/admin/`)
- **AdminProvider.tsx** — Auth context provider (login, logout, token management)
- **Sidebar.tsx** — Admin navigation sidebar

### Forms (`src/components/forms/`)
- **EnquiryForm.tsx** — Reusable enquiry form (used on contact + product pages)

### Products (`src/components/products/`)
- **ProductCard.tsx** — Reusable product card component

---

## 8. Authentication System

### Admin Auth
- JWT-based, stored in `localStorage` (`admin_token`) and sent as `Bearer` token
- Cookie `admin_token` also set for SSR
- Context: `AdminContext` via `AdminProvider`
- Helper: `adminFetch()` auto-attaches auth headers
- Token expiry: 7 days

### Buyer Auth
- JWT-based, stored in HTTP-only cookie (`buyer_token`)
- Context: `BuyerAuthContext` via `BuyerAuthProvider`
- Buyer must be **approved** by admin to see product pricing
- `isApproved: false` by default on signup

### Roles
- **admin** — full access to admin panel
- **editor** — (defined but not separately gated in current code)
- **buyer** — can login, see products, see pricing if approved

---

## 9. Filter System

Defined in `src/lib/filter-definitions.ts`. Category-specific filters are applied to products via `filterAttributes` (Map field).

### PP Bags / BOPP Bags filters:
- Quality (Super Gold, Gold, Silver, Janta)
- Gram/Weight (2g – 5.50g)
- Lamination (Laminated, Unlaminated)
- Availability (Ready Stock, Make-to-Order)
- Filler Content % (5-10% – 40-45%)

### PP Granules filters:
- Grade (Rafiya, RP)
- Melt Flow Index (2-4, 4-6, 6-8, 8-12)
- Color (Natural, Milky White, Mixed, Black)
- Moisture Level (Low, Medium, High)
- Contamination (Clean, Semi Clean, Industrial Mix)
- Application (Raffia Tape, Injection Molding, Extrusion, General Purpose)

### Default filters (all other categories):
- Condition (New, Used, Rejected)
- Size (Small – Extra Large)
- Application (Packaging, Storage, Industrial, Agriculture, Food Grade)
- Material (PP, HDPE, Jute, Nylon)
- Availability (Ready Stock, Make-to-Order)

Products API supports filtering via `fa_*` query params (e.g. `?fa_quality=gold&fa_gram=5`).

---

## 10. Mobile App (boriwala-app)

### Architecture
- **Expo SDK 55** + React Native 0.83
- Uses **WebView** to render website pages inside native tabs
- Bottom tab navigation: Home, Products, Categories, Contact, Account
- Each tab loads the corresponding website URL: `https://boriwala.vercel.app/{path}`
- JavaScript injected into WebView to hide website header/footer (since app provides its own nav)

### Push Notifications
- `expo-notifications` + `expo-device` + `expo-constants`
- On app launch: requests permission → gets Expo push token → sends to backend (`POST /api/push-tokens`)
- Android channels: "Default" (MAX importance) + "Offers & Deals" (HIGH importance)
- Notifications sent from admin panel via Expo Push API (`https://exp.host/--/api/v2/push/send`)

### Build
- **Bundle ID:** `com.boriwala.app` (both Android and iOS)
- **APK built locally** using Gradle (project copied to `C:\boriapp` to avoid Windows 260-char path limit)
- **JDK 17** + Android SDK at `C:\Android`
- Built APK at: `C:\Users\marke\boriwala-app.apk`

### Key Config (`src/config.ts`)
- `BASE_URL`: `https://boriwala.vercel.app`
- Primary color: `#f59e0b` (amber-500)

---

## 11. Deployment

| Component | Platform | Details |
|-----------|----------|---------|
| Website | **Vercel** | Auto-deploys on `git push origin main` |
| Database | **MongoDB Atlas** | Cloud-hosted, connection via `MONGODB_URI` |
| Mobile App | **Local APK build** | Gradle + JDK 17 + Android SDK |

### Deploy steps (Website):
```bash
git add -A
git commit -m "your message"
git push origin main
# Vercel auto-builds and deploys
```

### Rebuild APK (Mobile App):
```powershell
# Copy source to short path (Windows path limit workaround)
robocopy "c:\Users\marke\CascadeProjects\windsurf-project\boriwala-app" "C:\boriapp" /E /XD node_modules android .expo /PURGE

cd C:\boriapp
npm install
npx expo prebuild --platform android --clean

# Set environment
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:ANDROID_HOME = "C:\Android"
$env:ANDROID_SDK_ROOT = "C:\Android"

cd C:\boriapp\android
.\gradlew.bat assembleRelease

# Copy APK
Copy-Item "C:\boriapp\android\app\build\outputs\apk\release\app-release.apk" "C:\Users\marke\boriwala-app.apk"
```

---

## 12. Project Structure

```
boriwala.com/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Homepage
│   │   ├── (public)/                         # Public route group (Header+Footer layout)
│   │   │   ├── layout.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── sell-to-us/page.tsx
│   │   │   └── products/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/page.tsx
│   │   ├── admin/                            # Admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                      # Dashboard
│   │   │   ├── categories/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── buyers/page.tsx
│   │   │   ├── enquiries/page.tsx
│   │   │   ├── seller-enquiries/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/                              # API routes
│   │       ├── auth/ (signup, login, logout, me, buyer-*)
│   │       ├── products/ ([id])
│   │       ├── categories/ ([id])
│   │       ├── enquiries/ ([id], export)
│   │       ├── seller-enquiry/
│   │       ├── push-tokens/
│   │       ├── admin/
│   │       │   ├── buyers/ ([id])
│   │       │   ├── notifications/ (devices)
│   │       │   └── seller-enquiries/ ([id])
│   │       ├── dashboard/
│   │       ├── settings/
│   │       ├── upload/
│   │       ├── seed/
│   │       └── debug/
│   ├── components/
│   │   ├── admin/ (AdminProvider, Sidebar)
│   │   ├── home/ (HeroBanner, CategoryGrid, FeaturedProducts, WhyChooseUs, IndustriesServed, CTASection, Testimonials)
│   │   ├── layout/ (Header, Footer, WhatsAppButton)
│   │   ├── forms/ (EnquiryForm)
│   │   └── products/ (ProductCard)
│   ├── context/
│   │   └── BuyerAuthContext.tsx
│   ├── lib/
│   │   ├── mongodb.ts                        # DB connection (cached)
│   │   ├── auth.ts                           # JWT helpers (hash, verify, generateToken)
│   │   ├── admin-auth.ts                     # Client-side admin auth (context, fetch helpers)
│   │   ├── filter-definitions.ts             # Category-specific product filters
│   │   ├── utils.ts                          # Slug, price format, date format, WhatsApp link
│   │   └── models/
│   │       ├── User.ts
│   │       ├── Product.ts
│   │       ├── Category.ts
│   │       ├── Enquiry.ts
│   │       ├── SellerEnquiry.ts
│   │       ├── Settings.ts
│   │       ├── Notification.ts
│   │       └── PushToken.ts
│   └── types/
├── public/
├── env.example
├── next.config.ts
├── package.json
└── tsconfig.json

boriwala-app/
├── App.tsx                                   # Main app with tab navigation + notification registration
├── app.json                                  # Expo config (com.boriwala.app)
├── src/
│   ├── config.ts                             # BASE_URL, tab config, colors
│   ├── notifications.ts                      # Push notification setup + token registration
│   └── screens/
│       ├── HomeScreen.tsx                     # WebView → /
│       ├── ProductsScreen.tsx                 # WebView → /products
│       ├── CategoriesScreen.tsx               # WebView → /categories
│       ├── ContactScreen.tsx                  # WebView → /contact
│       └── AccountScreen.tsx                  # WebView → /login
└── package.json
```

---

## 13. Feature Summary

| # | Feature | Status |
|---|---------|--------|
| 1 | Product catalog with categories, subcategories, filters, search | ✅ Live |
| 2 | Rich product detail pages (images, video, specifications, enquiry) | ✅ Live |
| 3 | Category-specific filter system (PP/BOPP, Granules, etc.) | ✅ Live |
| 4 | Customer enquiry system (contact + product-level) | ✅ Live |
| 5 | Buyer registration + admin approval for pricing visibility | ✅ Live |
| 6 | Multi-step animated signup form | ✅ Live |
| 7 | Admin dashboard with stats | ✅ Live |
| 8 | Admin CRUD for products (with image upload, rich text, filter attributes) | ✅ Live |
| 9 | Admin CRUD for categories (hierarchical) | ✅ Live |
| 10 | Admin enquiry management (respond, notes, export CSV) | ✅ Live |
| 11 | Admin buyer management (approve/reject) | ✅ Live |
| 12 | Site settings management (company info, hero, social links) | ✅ Live |
| 13 | "Sell to Us" page — industries can sell used bags/materials | ✅ Live |
| 14 | Seller enquiry form (photos + video links) | ✅ Live |
| 15 | Admin seller enquiry management (status, notes, WhatsApp) | ✅ Live |
| 16 | Push notifications — send from admin to all app users | ✅ Live |
| 17 | Mobile app (Expo + WebView) with bottom tab navigation | ✅ Built |
| 18 | WhatsApp floating button + direct links | ✅ Live |
| 19 | Responsive design (mobile + desktop) | ✅ Live |
| 20 | Image upload system (base64, admin-only, max 2MB) | ✅ Live |

---

## 14. Key Business Logic

1. **Pricing visibility**: Product prices are only shown to buyers with `isApproved: true`. New signups default to `isApproved: false` and must be manually approved by admin.

2. **Push notification flow**: App registers → token saved to DB → Admin composes notification → Sent to all active tokens via Expo Push API (batched in 100s) → Invalid tokens auto-deactivated.

3. **Seller enquiry flow**: Industry fills form on `/sell-to-us` → Saved to DB → Admin reviews in `/admin/seller-enquiries` → Updates status (new → contacted → negotiating → closed/rejected) → Can WhatsApp the seller directly.

4. **Product filters**: When a product belongs to a PP/BOPP category, special filters (quality, gram, lamination, filler) are shown. Granules get their own filter set. All others get basic filters. Filter values are stored in `filterAttributes` Map field.

5. **Image storage**: All images (products, categories, seller photos) are stored as base64 data URLs directly in MongoDB. Max 2MB per file.

---

*This document should be updated whenever new features are added or architecture changes.*
