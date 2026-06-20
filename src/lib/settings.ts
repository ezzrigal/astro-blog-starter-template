/**
 * src/lib/settings.ts
 * ─────────────────────────────────────────────────────
 * Central settings hub — import this instead of hardcoded values.
 * All data comes from src/data/site-settings.json and local-seo.json
 * which are managed via Decap CMS at /admin
 */

import siteData from '../data/site-settings.json';
import seoData from '../data/local-seo.json';

// ─── Site Settings ─────────────────────────────────────────────
export const SITE_URL         = siteData.siteUrl;
export const SITE_TITLE       = siteData.metaTitle;
export const SITE_DESCRIPTION = siteData.metaDescription;
export const COMPANY_NAME_AR  = siteData.companyNameAr;
export const COMPANY_NAME_EN  = siteData.companyNameEn;
export const PHONE            = siteData.phone;
export const WHATSAPP         = siteData.whatsapp;
export const WHATSAPP_URL     = `https://wa.me/${siteData.whatsapp.replace(/\D/g, '')}`;
export const EMAIL            = siteData.email;
export const LOGO             = siteData.logo;
export const FAVICON          = siteData.favicon;
export const OG_IMAGE         = siteData.ogImage;
export const GOOGLE_VERIFY    = siteData.googleVerification;
export const GA_ID            = siteData.googleAnalyticsId;
export const PROMO_TEXT       = siteData.promoBanner;
export const PROMO_ACTIVE     = siteData.promoBannerActive;
export const FOOTER_COPYRIGHT = siteData.footerCopyright;
export const FOOTER_TAGLINE   = siteData.footerTagline;

// Social
export const SOCIAL_WHATSAPP  = siteData.socialWhatsapp;
export const SOCIAL_TWITTER   = siteData.socialTwitter;
export const SOCIAL_INSTAGRAM = siteData.socialInstagram;
export const SOCIAL_SNAPCHAT  = siteData.socialSnapchat;

// Colors (for SiteConfig.astro dynamic injection)
export const COLORS = {
  primary:      siteData.colorPrimary,
  primaryHover: siteData.colorPrimaryHover,
  primaryLight: siteData.colorPrimaryLight,
  secondary:    siteData.colorSecondary,
  accent:       siteData.colorAccent,
  accentHover:  siteData.colorAccentHover,
  accentLight:  siteData.colorAccentLight,
};

// ─── Local SEO ─────────────────────────────────────────────────
export const ADDRESS = {
  street:     seoData.streetAddress,
  district:   seoData.district,
  city:       seoData.city,
  region:     seoData.region,
  postalCode: seoData.postalCode,
  country:    seoData.country,
};

export const GEO = {
  lat: seoData.lat,
  lng: seoData.lng,
};

export const BUSINESS = {
  priceLow:      seoData.priceLow,
  priceHigh:     seoData.priceHigh,
  currency:      seoData.currency,
  foundedYear:   seoData.foundedYear,
  employeeCount: seoData.employeeCount,
  crNumber:      seoData.crNumber,
  reviewLink:    seoData.reviewLink,
  mapsEmbedUrl:  seoData.mapsEmbedUrl,
};

export const OPENING_HOURS    = seoData.openingHours;
export const SERVICE_AREAS    = seoData.serviceAreas;
export const INTERCITY_CITIES = seoData.intercityCities;
export const RATING           = seoData.aggregateRating;

// ─── Helper: WhatsApp message builder ─────────────────────────
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

// ─── Helper: Price range display ──────────────────────────────
export function getPriceRange(): string {
  return `${BUSINESS.priceLow} - ${BUSINESS.priceHigh} ${BUSINESS.currency}`;
}

// ─── Helper: Years in business ────────────────────────────────
export function getYearsInBusiness(): number {
  return new Date().getFullYear() - BUSINESS.foundedYear;
}
