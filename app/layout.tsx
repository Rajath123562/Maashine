import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/Footer";
import MobileBottomBar from "../components/MobileBottomBar";

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
    "Gokulam cleaning services",
    "Vijayanagar cleaning services",
    "Kuvempunagar cleaning services",
    "Jayalakshmipuram cleaning services",
    "Mysore cleaning company"
  ],
  authors: [{ name: "MaaShine Cleaning Services" }],
  creator: "MaaShine",
  publisher: "MaaShine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://maashineservices.com",
    title: "MaaShine | Professional Cleaning Services in Mysore",
    description: "Professional home deep cleaning, kitchen degreasing, bathroom sanitization, and sofa cleaning in Mysore, Karnataka.",
    siteName: "MaaShine Cleaning Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaaShine | Professional Cleaning Services in Mysore",
    description: "Expert residential and commercial cleaning across Mysore with upfront transparent pricing.",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CleaningService"],
  "name": "MaaShine Cleaning Services",
  "image": "https://maashineservices.com/og-image.jpg",
  "url": "https://maashineservices.com",
  "telephone": "+91-9916887855",
  "email": "rajath.raj2569@gmail.com",
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
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "areaServed": [
    "Gokulam",
    "Vijayanagar",
    "Jayalakshmipuram",
    "Kuvempunagar",
    "VV Mohalla",
    "Saraswathipuram",
    "Hebbal",
    "JP Nagar",
    "Dattagalli",
    "Bogadi",
    "Yadavagiri",
    "Siddhartha Layout",
    "Ramakrishnanagar",
    "Alanahalli"
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
      <body className={`${bricolage.variable} ${plexMono.variable} font-sans antialiased bg-linen text-ink min-h-screen flex flex-col pb-16 md:pb-0`}>
        <NavbarWrapper />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
