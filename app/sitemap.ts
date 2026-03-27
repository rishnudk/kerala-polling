import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kerala-polling.rishnu.xyz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add more pages as they are implemented
  ]
}
