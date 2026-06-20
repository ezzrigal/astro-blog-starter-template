/**
 * src/lib/schema.ts
 * ─────────────────────────────────────────────────────
 * Auto-generates all JSON-LD structured data from settings.
 * Import the builder functions you need in each page or SchemaHead.astro
 */

import {
  SITE_URL, COMPANY_NAME_AR, COMPANY_NAME_EN,
  PHONE, EMAIL, LOGO,
  ADDRESS, GEO, BUSINESS, OPENING_HOURS,
  SERVICE_AREAS, RATING
} from './settings';

// ─── LocalBusiness + MovingCompany ────────────────────────────
export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MovingCompany'],
    name: COMPANY_NAME_AR,
    alternateName: COMPANY_NAME_EN,
    image: `${SITE_URL}${LOGO}`,
    logo: `${SITE_URL}${LOGO}`,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    priceRange: `${BUSINESS.priceLow} - ${BUSINESS.priceHigh} ${BUSINESS.currency}`,
    currenciesAccepted: BUSINESS.currency,
    paymentAccepted: 'Cash, Bank Transfer',
    foundingDate: BUSINESS.foundedYear.toString(),
    numberOfEmployees: { '@type': 'QuantitativeValue', value: BUSINESS.employeeCount },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    openingHoursSpecification: OPENING_HOURS.map((h: { days: string; opens: string; closes: string }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.split(',').map((d: string) => d.trim()),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      { '@type': 'City', name: ADDRESS.city, sameAs: 'https://www.wikidata.org/wiki/Q3692' },
      ...SERVICE_AREAS.map((area: string) => ({ '@type': 'AdministrativeArea', name: area })),
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
      geoRadius: '50000',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: RATING.ratingValue,
      reviewCount: RATING.reviewCount,
      bestRating: RATING.bestRating,
      worstRating: RATING.worstRating,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات نقل الأثاث والعفش بالرياض',
      itemListElement: [
        buildServiceOffer('نقل عفش بالرياض', 'نقل الأثاث المنزلي بسيارات دينا مغلقة مع الضمان الكامل'),
        buildServiceOffer('فك وتركيب الأثاث', 'فك وتركيب غرف النوم والمطابخ والمكيفات بأيدي فنيين متخصصين'),
        buildServiceOffer('تغليف الأثاث الاحترافي', 'تغليف بالبابلز والكرتون المقوى واللباد لحماية الأثاث'),
        buildServiceOffer('تخزين الأثاث', 'مستودعات مؤمنة لتخزين الأثاث لفترات قصيرة أو طويلة'),
      ],
    },
  };
}

function buildServiceOffer(name: string, description: string) {
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, description },
  };
}

// ─── FAQ Schema ───────────────────────────────────────────────
export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

// ─── Article / Blog Post Schema ───────────────────────────────
export function buildArticleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image ? `${SITE_URL}${opts.image}` : `${SITE_URL}${LOGO}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME_AR,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME_AR,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}${LOGO}` },
    },
    inLanguage: 'ar-SA',
  };
}

// ─── BreadcrumbList Schema ────────────────────────────────────
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
