# System Architecture & Technical Specifications — MaaShine

## 1. High-Level Architecture

```
[ Customer / Admin Browser ]
            │
            ▼ (HTTP / HTTPS)
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                │
│                                                         │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Server Components  │    │   Client Components  │  │
│  │   (Pages, Layouts)   │    │   (Booking Form, UI) │  │
│  └──────────┬───────────┘    └──────────┬───────────┘  │
│             │                           │              │
│             ▼                           ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Server Actions / Route Handlers (API)      │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │ (@supabase/ssr)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase Cloud Backend                │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │  GoTrue (Auth)   │  │  PostgreSQL Database + RLS  │  │
│  └──────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Component Mapping

```
app/
├── (admin)/
│   └── admin/
│       ├── page.tsx               # Admin Overview Dashboard
│       ├── requests/page.tsx      # Admin Request Management Table
│       ├── customers/page.tsx     # Admin Customer Directory
│       └── services/page.tsx      # Admin Service & Pricing Control
├── (auth)/
│   ├── login/                     # Login Page & Actions
│   ├── register/                  # Registration Page
│   └── forgot-password/           # Password Reset Page
├── (customer)/
│   ├── dashboard/page.tsx         # Customer Dashboard
│   ├── profile/page.tsx           # Profile & Address Management
│   └── my-requests/[id]/page.tsx  # Detailed Request View & Status Tracker
├── actions/
│   ├── booking.ts                 # Submit Cleaning Request Action
│   ├── admin.ts                   # Status & Admin Notes Update Action
│   ├── auth.ts / login/actions.ts # Auth, Sign Up, Reset & Logout Actions
│   └── services.ts                # Service Creation & Toggle Actions
├── api/seed/route.ts              # Idempotent Database Seeding API
├── booking/page.tsx               # Public Booking Gateway
├── services/
│   ├── page.tsx                   # Service Catalogue Page
│   └── [slug]/page.tsx            # Dynamic Service Detail Page
├── about/page.tsx                 # About MaaShine Page
├── contact/page.tsx               # Contact & Inquiry Page
└── page.tsx                       # Homepage
```

---

## 3. Database Schema & Entity Relationships

```sql
-- User Roles Enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Request Status Enum
CREATE TYPE request_status AS ENUM (
  'Pending', 'Contacted', 'Confirmed', 
  'In Progress', 'Completed', 'Cancelled', 'Rejected'
);

-- Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services Table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'Residential',
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    pricing_type TEXT NOT NULL DEFAULT 'fixed', -- 'fixed', 'conditional', 'quote'
    pricing_conditions JSONB,
    includes JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cleaning Requests Table
CREATE TABLE public.cleaning_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number SERIAL NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    property_type TEXT NOT NULL,
    rooms INTEGER,
    bathrooms INTEGER,
    property_size TEXT,
    property_condition TEXT,
    is_quote_request BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    alternative_date DATE,
    alternative_time TIME,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    landmark TEXT,
    additional_notes TEXT,
    status request_status NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Route Protection Middleware

The middleware (`proxy.ts` / `middleware.ts`) intercepts requests on matcher paths:
1. **Unauthenticated users** navigating to `/dashboard`, `/profile`, `/my-requests/*`, or `/admin/*` are automatically redirected to `/login`.
2. **Authenticated users** navigating to `/login`, `/register`, or `/forgot-password` are redirected to `/dashboard`.
3. **Non-admin users** navigating to `/admin/*` are redirected to `/dashboard`.
