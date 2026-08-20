# Product Requirements Document (PRD) — MaaShine

## 1. Business Vision & Positioning
**MaaShine** is a professional residential and commercial cleaning service business positioning itself as:
- **Professional & Detail-Oriented**: Providing systematic 50-point cleaning standards.
- **Transparent**: Clear, upfront pricing with no hidden charges.
- **Trustworthy**: Vetted, background-checked cleaning professionals.
- **Modern & Customer-Centric**: Seamless digital booking, quotation, and request tracking.

---

## 2. Target Audience & User Personas

### Persona A: Homeowner / Tenant (Residential)
- **Goal**: Secure reliable deep cleaning for home transitions (moving into a new house or maintaining an occupied space).
- **Need**: Instant pricing, clear inclusions list, preferred time scheduling.

### Persona B: Office / Commercial Manager
- **Goal**: Arrange scheduled or customized cleaning for office spaces and shared residential common areas.
- **Need**: Customized quotation request, flexible scheduling, professional communication.

### Persona C: MaaShine Admin / Business Owner
- **Goal**: Efficiently manage incoming bookings, review quote requests, update job statuses, and update service catalogues.
- **Need**: Centralized admin dashboard with status controls, customer overview, and service configuration.

---

## 3. Scope of Services & Exact Pricing Rules

### Allowed Services (9 Total)
1. **Home Deep Cleaning** (Residential) — Conditional Pricing Logic:
   - 20 × 30, New / Unoccupied: ₹6,500
   - 20 × 30, Living / Occupied: ₹7,500
   - 30 × 40, New / Unoccupied: ₹8,500
   - 30 × 40, Living / Occupied: ₹9,500 *(Negotiable based on site requirements)*
   - Other / Custom Size: Price on Request
2. **Kitchen Cleaning** (Residential) — Fixed Price: ₹2,000
3. **Bathroom & Toilet Cleaning** (Residential) — Fixed Price: ₹850
4. **Sofa Cleaning** (Residential) — Fixed Price: ₹1,800
5. **Mattress Cleaning** (Residential) — Fixed Price: ₹650
6. **Office Cleaning** (Commercial) — Price on Request
7. **Apartment / Common Area Cleaning** (Commercial) — Price on Request
8. **Window & Glass Cleaning** (Specialized) — Conditional Pricing:
   - Normal Window: ₹650 *(Includes mesh cleaning)*
   - Bigger Window: ₹850 *(Includes mesh cleaning)*
9. **Floor Cleaning** (Specialized) — Price on Request

### Prohibited Services
The following services MUST NOT exist anywhere in the application:
- Carpet & Rug Cleaning
- Commercial / Shop Cleaning
- Post-Construction Cleaning
- Disinfection & Sanitization

---

## 4. Key Functional Requirements

### F1: Customer Booking & Quote Flow
- Multi-step booking form collecting: Service selection, Property type, Property size, Condition, Preferred date/time, Alternative schedule, Location details, and Special instructions.
- Instant calculation of dynamic prices vs. quote flags.
- Double-submission prevention during request processing.

### F2: Authentication & Access Control
- User Registration (Name, Email, Phone, Password).
- User Login with error handling and Next.js 15+ promise-based searchParams.
- Password Reset via email flow.
- Protected customer routes (`/dashboard`, `/profile`, `/my-requests/*`).
- Protected admin routes (`/admin/*`) restricted to users with `role = 'admin'`.

### F3: Customer Dashboard
- Overview of total requests, pending items, confirmed bookings, and completed jobs.
- Detailed view per request (`/my-requests/[id]`) displaying status, schedule, address, service inclusions, and admin messages.
- Customer data isolation enforced at both application and database RLS layers.

### F4: Business Admin Dashboard
- Business metrics overview (Total customers, Pending requests, Confirmed jobs, Completed jobs).
- Request Management table with status dropdown (`Pending` → `Contacted` → `Confirmed` → `In Progress` → `Completed` / `Cancelled` / `Rejected`) and custom admin notes.
- Customer management directory.
- Service catalogue management (add service, auto-slug generation, activate/deactivate toggle).
