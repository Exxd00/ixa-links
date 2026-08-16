export const SITE_URL = 'https://ixa-agency.de';
export const SITE_NAME = 'IXA Agency';
export const SITE_DESCRIPTION = 'IXA Agency verbindet messbare Lead-Generierung mit klarem Social Media Marketing.';
export const GOOGLE_ANALYTICS_ID = 'G-MC97FW20HT';

export const INSTAGRAM = 'https://www.instagram.com/ixa_agency/';
export const INSTAGRAM_LINK = 'https://www.instagram.com/ixa_agency?igsh=MXd2aDI3dGx5dTZ0cA==';
export const LINKEDIN = 'https://www.linkedin.com/company/ixa-agency';
export const PHONE = '+491629155408';
export const PHONE_DISPLAY = '+49 162 9155408';
export const WHATSAPP = `https://wa.me/${PHONE.replace('+', '')}`;

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const webpageId = `${SITE_URL}/#webpage`;
const leadsServiceId = `${SITE_URL}/#ixa-leads-service`;

export const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/renders/ixa-logo-3d.png`,
        width: 1800,
        height: 1350,
      },
      image: `${SITE_URL}/renders/ixa-logo-3d.png`,
      email: 'info@ixa-leads.de',
      telephone: PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Einsteinring 12',
        postalCode: '90453',
        addressLocality: 'Nürnberg',
        addressCountry: 'DE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: PHONE,
        email: 'info@ixa-leads.de',
        contactType: 'customer service',
        availableLanguage: 'German',
      },
      sameAs: [INSTAGRAM, LINKEDIN],
      slogan: 'Sichtbar. Messbar. Wirksam.',
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { '@id': organizationId },
      inLanguage: 'de-DE',
    },
    {
      '@type': 'WebPage',
      '@id': webpageId,
      url: `${SITE_URL}/`,
      name: 'IXA Agency — Sichtbar. Messbar. Wirksam.',
      description: SITE_DESCRIPTION,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      mainEntity: { '@id': leadsServiceId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/renders/ixa-logo-3d.png`,
        width: 1800,
        height: 1350,
      },
      inLanguage: 'de-DE',
    },
    {
      '@type': 'Service',
      '@id': leadsServiceId,
      name: 'IXA Leads',
      serviceType: 'Google Ads, Landingpages und messbare Lead-Generierung',
      description: 'IXA Leads führt Menschen von der Google-Suche über eine klare Landingpage zu einer messbar erfassten Anfrage.',
      url: 'https://ixa-leads.de/',
      provider: { '@id': organizationId },
      mainEntityOfPage: { '@id': webpageId },
      potentialAction: {
        '@type': 'ViewAction',
        target: 'https://ixa-leads.de/',
        name: 'IXA Leads öffnen',
      },
    },
  ],
};
