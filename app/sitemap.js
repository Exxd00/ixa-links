import { SITE_URL } from './site-config';

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${SITE_URL}/renders/ixa-logo-3d.png`],
    },
    {
      url: `${SITE_URL}/impressum`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
