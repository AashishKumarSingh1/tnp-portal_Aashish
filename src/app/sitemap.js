
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tnp.nitp.ac.in';

export default function sitemap() {
  // Static Pages
  const staticPages = [
    '', // Homepage
    '/login',
    '/contact',
    '/statistics',
    '/team',
    '/about',       
    '/facilities',  
    '/achievements', 
    '/why-recruit',  
    '/procedure',    
    '/wdc',          
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicPages = [
    // Example: Fetch news slugs
    // { slug: 'placement-drive', lastMod: '2024-03-15T...' },
  ].map((item) => ({
      url: `${BASE_URL}/news/${item.slug}`,
      lastModified: item.lastMod || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
  }));


  return [
    ...staticPages,
    ...dynamicPages,
  ];
} 