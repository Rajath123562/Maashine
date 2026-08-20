# Technology Stack Specification — MaaShine

## 1. Core Framework & Runtime

- **Framework**: Next.js 16.3.1 (App Router architecture with React Server Components)
- **Runtime Environment**: Node.js 18+ / Vercel Edge Runtime ready
- **Language**: TypeScript 5.0+ (Strict mode, explicit interface definitions)
- **CSS Engine**: Tailwind CSS v4 (`@tailwindcss/postcss`)

---

## 2. Frontend Layer

| Library / Tool | Version | Purpose |
|----------------|---------|---------|
| `react` & `react-dom` | `19.0` | Declarative UI rendering & Server Actions integration |
| `lucide-react` | `latest` | Clean, modern UI icon system |
| `clsx` & `tailwind-merge` | `latest` | Conditional CSS class merging & dynamic style overrides |
| `@ducanh2912/next-pwa` | `latest` | Progressive Web App offline caching & manifest management |

---

## 3. Backend & Data Layer

| Tool / Service | Purpose | Configuration |
|----------------|---------|---------------|
| **Supabase Database** | PostgreSQL relational database | Hosts `profiles`, `services`, `cleaning_requests`, `request_images` |
| **Supabase Auth** | Authentication & session management | Email & password authentication with GoTrue SSR cookies |
| **`@supabase/ssr`** | SSR Cookie management | Manages secure HTTP-only cookies in Next.js Server Components & Middleware |
| **Server Actions** | Mutation layer | `submitBookingRequest`, `updateRequestStatus`, `login`, `signup`, `logout`, `resetPassword` |

---

## 4. Third-Party Integrations & Services

- **Resend Email API**: Optional automated transactional email notifications for booking submissions (`bookings@maashineservices.com`).
- **Upstash Redis & Rate Limiting**: Optional IP-based rate limiting (`20 requests / 10s`) via `@upstash/ratelimit`.

---

## 5. Security Protocols

- **Password Hashing**: Managed by Supabase Auth (Bcrypt / Argon2). Plaintext passwords are NEVER stored.
- **Row Level Security (RLS)**: Enforced at PostgreSQL database level.
- **Role-Based Access Control (RBAC)**: Admin checks via `proxy.ts` middleware and backend Server Actions.
- **Session Security**: HTTP-only, SameSite cookies managed by `@supabase/ssr`.
