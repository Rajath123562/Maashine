import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maashine.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/my-requests/', '/invoice/', '/staff/', '/profile/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
