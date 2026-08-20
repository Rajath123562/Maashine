# MaaShine — 100% Free Zero-Cost Launch & Hosting Guide

You do **NOT** need to buy a domain or pay for web hosting to launch MaaShine. You can run and launch MaaShine completely **100% FREE (₹0)**.

---

## 1. How MaaShine Runs 100% Free

| Service | Free Provider | Cost | What It Gives You |
| :--- | :--- | :--- | :--- |
| **Web Hosting & SSL** | **Vercel** (Hobby Plan) | **₹0 / Free Forever** | Fast global hosting + Free SSL (`https://`) + Free `*.vercel.app` domain |
| **Database & Auth** | **Supabase** (Free Plan) | **₹0 / Free Forever** | 500 MB Postgres DB, 50,000 monthly active users, 1 GB Storage |
| **Customer Messaging** | **WhatsApp Click-to-Chat** | **₹0 / Free Forever** | Free `wa.me` instant messaging directly to your phone |
| **Search Engine Indexing**| **Google Search Console** | **₹0 / Free Forever** | Free indexing on Google Search for Mysore queries |
| **Maps & Local 3-Pack** | **Google Business Profile** | **₹0 / Free Forever** | Free Google Maps listing for Mysore localities |
| **Customer Referrals** | **Web Share API / WhatsApp** | **₹0 / Free Forever** | Free viral word-of-mouth referral tool |

---

## 2. Deploy to Vercel in 3 Minutes (Free Domain Included)

Vercel provides a free URL (e.g., `https://maashine.vercel.app` or `https://maashine-mysore.vercel.app`) with automatic HTTPS encryption.

### Step 1: Push Project to GitHub (Free)
1. If not already on GitHub, create a free GitHub repository at [github.com/new](https://github.com/new) named `maashine-website`.
2. Push your code:
   ```bash
   git add .
   git commit -m "MaaShine production ready"
   git push origin main
   ```

### Step 2: Import Project on Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and click **Sign Up** (Sign in with your GitHub account).
2. Click **Add New Project** → Select your `maashine-website` repository.
3. In the **Environment Variables** section, add your 3 Supabase keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ahdveaezqtkqzikpqujq.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[your-anon-key]`
   - `SUPABASE_SERVICE_ROLE_KEY` = `[your-service-role-key]`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-chosen-subdomain.vercel.app`
4. Click **Deploy**.

### Step 3: Your Free Live Website is Ready!
- Within 60 seconds, Vercel will give you a live URL like:
  `https://maashine.vercel.app`
- All pages, booking system, WhatsApp buttons, referral sharing, and admin dashboards will work live immediately.

---

## 3. How to Use Your Free Vercel Domain

You can use your free `*.vercel.app` link everywhere:
- **On WhatsApp:** Share `https://maashine.vercel.app` with friends, family, and apartment groups.
- **On Google Business Profile:** Add `https://maashine.vercel.app` as your official business website.
- **On Google Search Console:** Submit `https://maashine.vercel.app` and `https://maashine.vercel.app/sitemap.xml` for free Google search indexing.
- **On Instagram & Facebook:** Add `https://maashine.vercel.app` to your profile bio.

---

## 4. Upgrading to a Custom Domain in the Future (Optional)

When MaaShine generates profit from cleaning jobs and you decide to buy a custom domain (like `maashineservices.in` or `maashineservices.com`):
1. Buy domain from any registrar (Namecheap, GoDaddy, Cloudflare) for ₹400–₹800/year.
2. In Vercel Project Settings → **Domains** → Click **Add Domain**.
3. Vercel will connect it automatically with zero code changes!
