import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords,
  image = '/logoself.png',
  url = '/',
  noIndex = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://assessify.app'
  const fullUrl = `${baseUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  const defaultTitle = 'Assessify - AI-Powered Quiz & Assessment Platform'
  const defaultDescription = 'Create, manage, and analyze quizzes with AI. Assessify offers role-based dashboards for teachers and students, classroom management, and detailed analytics.'
  const defaultKeywords = ['online quiz platform', 'AI quiz generator', 'educational assessment', 'classroom management', 'quiz analytics']

  const metaTitle = title || defaultTitle
  const metaDescription = description || defaultDescription
  const metaKeywords = keywords || defaultKeywords

  return {
    title,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: fullUrl,
      siteName: 'Assessify',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [fullImageUrl],
      creator: '@assessify',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://assessify.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Assessify',
    url: baseUrl,
    logo: `${baseUrl}/logoself.png`,
    description: 'AI-powered quiz and assessment platform for education',
    sameAs: [
      // Add your social media links here
      'https://twitter.com/assessify',
      'https://linkedin.com/company/assessify',
    ],
  }
}

export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://assessify.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Assessify',
    url: baseUrl,
    description: 'AI-powered quiz and assessment platform for education',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateEducationalSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://assessify.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Assessify',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
    description: 'AI-powered quiz and assessment platform for teachers and students',
    url: baseUrl,
  }
}
