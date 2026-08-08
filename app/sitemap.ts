import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '', '/about', '/services', '/portfolio', '/gallery', '/pricing',
    '/booking', '/shop', '/testimonials', '/blog', '/career',
    '/contact', '/faq', '/privacy-policy', '/terms',
  ];
  const base = 'https://firstlookstudio.com';
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
