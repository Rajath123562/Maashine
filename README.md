# MaaShine — Premium Cleaning Services Web Application

MaaShine is a modern, full-stack cleaning service web application built for residential and commercial cleaning requests, customized quotation flows, dynamic pricing engines, customer dashboards, and business admin management.

---

## 🌟 Key Features

- **Dynamic Service Catalogue**: 9 official services across Residential, Commercial, and Specialized cleaning.
- **Dynamic Pricing Engine**: Automated pricing logic for Home Deep Cleaning (property size + condition combinations) and Window & Glass Cleaning.
- **Quote Request System**: Dedicated quote workflow for custom size properties, Office Cleaning, Apartment Cleaning, and Floor Cleaning.
- **Multi-Step Booking System**: 6-step intuitive booking process with property details, preferred schedule, location, and payment verification.
- **Customer Dashboard**: Secure request tracking, status updates, and profile management with strict customer data isolation.
- **Admin Management Dashboard**: Comprehensive business control panel for managing incoming requests, updating job statuses, and adding/toggling services.
- **Authentication System**: Secure Supabase SSR authentication with password reset and protected routes middleware.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Supabase project created

### 2. Environment Setup
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies & Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Database Setup & Seeding
1. Run the database migration script (`supabase/migrations/20260817000000_schema.sql`) in your Supabase SQL Editor.
2. Visit **[http://localhost:3000/api/seed](http://localhost:3000/api/seed)** in your browser to automatically seed all 9 official MaaShine services into your database.

---

## 📁 Project Structure

```
website/
├── app/                        # Next.js App Router
│   ├── (admin)/admin/          # Protected Admin Dashboard & Management
│   ├── (auth)/                 # Login, Register, Forgot Password
│   ├── (customer)/             # Customer Dashboard, Requests, Profile
│   ├── actions/                # Server Actions (Booking, Admin, Auth, Services)
│   ├── api/seed/               # Automated Database Seeding API
│   ├── booking/                # Multi-Step Booking Page
│   ├── services/               # Catalogue & Service Details ([slug])
│   ├── about/                  # About MaaShine Page
│   └── contact/                # Contact Page
├── components/                 # React Components (Catalogue, Booking Form, Navbar)
├── supabase/                   # Schema migrations and seed SQL files
├── proxy.ts                    # Next.js Middleware Route Protection
├── middleware.ts               # Proxy delegation wrapper
└── public/                     # Static assets, icons, manifest.json
```

---

## 🔐 Security & Data Isolation
- **Row Level Security (RLS)** is enabled on all tables (`profiles`, `services`, `cleaning_requests`, `payments`, `reschedule_requests`, `business_settings`, `reviews`).
- Customers can ONLY view and edit their own profiles and requests.
- Single-team concurrency protection is enforced via unique slot index on `(preferred_date, preferred_time)`.
- Admin dashboard routes (`/admin/*`) are strictly protected by server-side role verification.

---

## 📈 Google Search Console Setup Guide (Free Organic Indexing)

To make MaaShine discoverable on Google Search for Mysore queries:

1. **Sign in to Google Search Console:** Go to [search.google.com/search-console](https://search.google.com/search-console).
2. **Add Property:** Enter your live production domain (e.g. `https://maashineservices.com`) using the **URL prefix** or **Domain** method.
3. **Verify Ownership:** 
   - **HTML Tag Method:** Copy the verification meta tag provided by Google and paste it into `app/layout.tsx` inside `<head>`, or
   - **DNS TXT Method (Recommended):** Add the TXT record to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.).
4. **Submit Sitemap:**
   - In the left sidebar, click **Sitemaps**.
   - Enter `sitemap.xml` and click **Submit**.
   - Google will crawl all 14+ public pages and service slugs automatically.
5. **Inspect & Request Indexing:** Use the URL Inspection tool at the top to inspect `https://maashineservices.com` and click **Request Indexing** for immediate crawling.

---

## 📍 Google Business Profile Setup Guide (Mysore Local 3-Pack)

Setting up a free Google Business Profile ensures MaaShine appears in Google Maps and local search results when customers search for cleaning services in Mysore.

1. **Create Profile:** Go to [business.google.com](https://business.google.com).
2. **Business Name:** `MaaShine Cleaning Services`
3. **Primary Category:** `House Cleaning Service` or `Cleaning Service`.
4. **Service-Area Configuration:** Select **"Yes, I deliver services to customers at their location"**.
5. **Add Service Areas in Mysore:**
   - Gokulam, Vijayanagar, Jayalakshmipuram, Kuvempunagar, VV Mohalla, Saraswathipuram, Hebbal, JP Nagar, Dattagalli, Bogadi, Yadavagiri, Siddhartha Layout.
6. **Contact Information:** Add phone number (`+91 81056 99620`), website (`https://maashineservices.com`), and booking link (`https://maashineservices.com/booking`).
7. **Business Hours:** Set Mon–Sat, 9:00 AM – 6:00 PM.
8. **Add Photos:** Upload high-resolution photos of cleaning gear, staff uniforms, and authentic before/after transformations.
9. **Capture Customer Reviews:** After every completed job, share your Google review link with the customer. 10+ reviews dramatically boost local map ranking.

