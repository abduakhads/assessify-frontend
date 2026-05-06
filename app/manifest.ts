import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Assessify - AI-Powered Quiz Platform',
    short_name: 'Assessify',
    description: 'Create, manage, and analyze quizzes with AI. Perfect for teachers and students.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/logoself.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    categories: ['education', 'productivity'],
    lang: 'en',
    dir: 'ltr',
  }
}
