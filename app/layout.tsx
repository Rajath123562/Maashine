import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/Footer";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  variable: '--font-bricolage'
});
const plexMono = IBM_Plex_Mono({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: '--font-plex-mono'
});

export const viewport: Viewport = {
  themeColor: "#059669",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maashine.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MaaShine | Professional Cleaning Services in Mysore",
    template: "%s | MaaShine Mysore"
  },
  description: "Trusted professional cleaning services in Mysore, Karnataka. Home deep cleaning, kitchen cleaning, bathroom sanitization, sofa & mattress care, and office cleaning with upfront pricing.",
  keywords: [
    "cleaning services in Mysore",
    "home deep cleaning Mysore",
    "house cleaning services Mysore",
    "kitchen cleaning Mysore",
    "bathroom cleaning Mysore",
    "sofa cleaning Mysore",
    "mattress cleaning Mysore",
    "office cleaning Mysore",
    "apartment cleaning Mysore",
    "floor cleaning Mysore",
    "window glass cleaning Mysore"
  ],
  authors: [{ name: "MaaShine Cleaning Services" }],
  creator: "MaaShine Cleaning Services",
  publisher: "MaaShine Cleaning Services",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "MaaShine | Professional Cleaning Services in Mysore",
    description: "Expert home deep cleaning, kitchen, bathroom, and sofa cleaning in Mysore. Punctual, reliable, and transparent pricing.",
    url: "https://maashineservices.com",
    siteName: "MaaShine Cleaning Services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MaaShine Cleaning Services Mysore"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaaShine | Professional Cleaning Services in Mysore",
    description: "Professional residential and commercial cleaning services across Mysore, Karnataka.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MaaShine",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CleaningService"],
  "name": "MaaShine Cleaning Services",
  "image": "https://maashineservices.com/og-image.jpg",
  "url": "https://maashineservices.com",
  "telephone": "+91-8105699620",
  "email": "contact@maashineservices.com",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "#610, 8th Main, 12th Cross, Near Hemavathi School",
    "addressLocality": "Mysore",
    "addressRegion": "Karnataka",
    "postalCode": "570001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "12.2958",
    "longitude": "76.6394"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Mysore"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Karnataka"
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://maashineservices.com"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${bricolage.variable} ${plexMono.variable} font-sans antialiased bg-linen text-ink min-h-screen flex flex-col`}>
        <NavbarWrapper />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
