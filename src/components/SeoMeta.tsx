import { Helmet } from 'react-helmet-async';

import { SEO_DEFAULTS } from '../lib/seo';

interface SeoMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  twitterCard?: string;
  lang?: 'en' | 'uz';
  robots?: string;
}

export function SeoMeta({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  canonical = SEO_DEFAULTS.canonical,
  keywords = SEO_DEFAULTS.keywords,
  ogTitle = SEO_DEFAULTS.ogTitle,
  ogDescription = SEO_DEFAULTS.ogDescription,
  ogImage = SEO_DEFAULTS.ogImage,
  ogImageAlt = SEO_DEFAULTS.ogImageAlt,
  ogType = SEO_DEFAULTS.ogType,
  twitterCard = SEO_DEFAULTS.twitterCard,
  lang = 'en',
  robots = SEO_DEFAULTS.robots,
}: SeoMetaProps) {
  const normalizedCanonical = canonical.endsWith('/') ? canonical : `${canonical}/`;
  const uzHref = `${normalizedCanonical}?lang=uz`;
  const enHref = `${normalizedCanonical}?lang=en`;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_DEFAULTS.siteName,
    url: 'https://dualium.vercel.app/',
    inLanguage: ['en', 'uz'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dualium.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dualium',
    url: 'https://dualium.vercel.app/',
    founder: 'Izzatillo Davlatov',
    sameAs: ['https://izzatillo.uz'],
  };
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Izzatillo Davlatov',
    url: 'https://izzatillo.uz',
    jobTitle: 'Front-End Developer',
    description:
      'Front-end developer from Uzbekistan, passionate about technology and preparing to study cyber security.',
  };

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="application-name" content={SEO_DEFAULTS.siteName} />
      <meta name="apple-mobile-web-app-title" content={SEO_DEFAULTS.siteName} />
      <meta name="author" content="Izzatillo Davlatov" />
      <meta name="creator" content="Izzatillo Davlatov" />
      <meta name="publisher" content="izzatillo.uz" />
      <meta name="copyright" content="Copyright all reserved 2026 Izzatillo Davlatov" />
      <meta name="rights" content="Izzatillo Davlatov. All rights reserved." />
      <link rel="canonical" href={normalizedCanonical} />
      <link rel="alternate" hrefLang="en" href={enHref} />
      <link rel="alternate" hrefLang="uz" href={uzHref} />
      <link rel="alternate" hrefLang="x-default" href={normalizedCanonical} />

      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:url" content={normalizedCanonical} />
      <meta property="og:locale" content={lang === 'uz' ? 'uz_UZ' : 'en_US'} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={SEO_DEFAULTS.twitterSite} />
      <meta name="twitter:creator" content="@izzatillodavlatov" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  );
}
