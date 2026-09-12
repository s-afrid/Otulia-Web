import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_DESCRIPTION =
  'The premier marketplace for buying and selling editorial-grade luxury cars, yachts, estates, and bikes. Explore exclusive global listings from verified dealers and private sellers.';
const DEFAULT_KEYWORDS =
  'luxury assets, luxury cars, yachts for sale, luxury real estate, exclusive bikes, otulia, buy luxury assets, sell luxury assets, luxury marketplace';
const DEFAULT_IMAGE = 'https://otulia.com/images/exclusive_club_bg.jpg';
const DEFAULT_URL = 'https://otulia.com';

const normalizeCanonicalPath = (pathname) => {
  let normalized = pathname
    .replace(/\/{2,}/g, '/')
    .replace(/^\/asset\/cars(?=\/)/i, '/asset/car')
    .replace(/^\/asset\/estates(?=\/)/i, '/asset/estate')
    .replace(/^\/asset\/bikes(?=\/)/i, '/asset/bike')
    .replace(/^\/asset\/yachts(?=\/)/i, '/asset/yacht')
    .toLowerCase();

  if (normalized.length > 1) normalized = normalized.replace(/\/+$/, '');
  return normalized || '/';
};

const resolveCanonicalUrl = (candidate) => {
  try {
    const canonical = new URL(candidate, DEFAULT_URL);
    canonical.protocol = 'https:';
    canonical.host = 'otulia.com';
    canonical.pathname = normalizeCanonicalPath(canonical.pathname);
    canonical.search = '';
    canonical.hash = '';
    return canonical.toString();
  } catch {
    return `${DEFAULT_URL}/`;
  }
};

// Map the asset `condition` field to a schema.org itemCondition URL.
const conditionToSchema = (raw) => {
  if (!raw) return null;
  const c = String(raw).toLowerCase();
  if (c.includes('new')) return 'https://schema.org/NewCondition';
  if (c.includes('refurb')) return 'https://schema.org/RefurbishedCondition';
  return 'https://schema.org/UsedCondition';
};

// Map the asset `status` field to a schema.org availability URL.
const statusToAvailability = (status) => {
  switch (status) {
    case 'Sold':
      return 'https://schema.org/OutOfStock';
    case 'Rented':
      return 'https://schema.org/OutOfStock';
    case 'Draft':
      return 'https://schema.org/Discontinued';
    case 'Active':
    default:
      return 'https://schema.org/InStock';
  }
};

// Normalize an arbitrary price value into a finite number or null.
const toNumericPrice = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : null;
};

export default function SEO({
  title,
  description,
  keywords,
  name = 'Otulia',
  type = 'website',
  image,
  url,
  productData,
  breadcrumbs,
  noindex = false,
}) {
  const location = useLocation();
  // Search/filter parameters, fragments, trailing slashes, case variants, and
  // plural asset aliases must not create separate canonical URLs.
  const resolvedUrl = resolveCanonicalUrl(url || location.pathname);
  const resolvedImage = image || DEFAULT_IMAGE;

  const seoTitle = title
    ? (/\botulia\b/i.test(title) ? title : `${title} | Otulia`)
    : 'Otulia - Buy & Sell Luxury Assets Worldwide';

  // Standard Organization Schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Otulia',
    url: DEFAULT_URL,
    logo: 'https://otulia.com/logos/logo.png',
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      'https://facebook.com/otulia',
      'https://instagram.com/otulia',
      'https://twitter.com/otulia',
    ],
  };

  // WebSite schema with SearchAction (helps Google SGE and AI engines).
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Otulia',
    url: DEFAULT_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@type': 'Organization', name: 'Otulia' },
  };

  const navSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'SiteNavigationElement', position: 1, name: 'Shop', url: `${DEFAULT_URL}/shop` },
      { '@type': 'SiteNavigationElement', position: 2, name: 'Explore', url: `${DEFAULT_URL}/#Category` },
      { '@type': 'SiteNavigationElement', position: 3, name: 'About Us', url: `${DEFAULT_URL}/about` },
      { '@type': 'SiteNavigationElement', position: 4, name: 'Login', url: `${DEFAULT_URL}/login` },
    ],
  };

  // Product Schema for Assets
  let productSchema = null;
  if (productData) {
    const specCondition =
      productData?.specification?.condition || productData?.condition || productData?.usageStatus;
    const itemCondition = conditionToSchema(specCondition);
    const availability = statusToAvailability(productData.status);
    const numericPrice = toNumericPrice(productData.price);
    const onRequest = productData.isPriceOnRequest === true;

    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.title,
      description: productData.description || description || DEFAULT_DESCRIPTION,
      image: productData.images?.length
        ? productData.images
        : [resolvedImage],
      sku: productData._id,
      brand: {
        '@type': 'Brand',
        name: productData.brand || productData.specification?.manufacturer || 'Luxury Asset',
      },
      offers: {
        '@type': 'Offer',
        url: resolvedUrl,
        priceCurrency: 'USD',
        availability,
        ...(itemCondition ? { itemCondition } : {}),
        // Only emit price when it's a real number; otherwise leave it absent
        // (Google flags empty / string prices, and `isPriceOnRequest` is the
        // honest signal to use instead).
        ...(onRequest || numericPrice === null
          ? { priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'USD',
              valueAddedTaxIncluded: false,
              description: 'Price on request',
            } }
          : { price: numericPrice }),
        seller: productData.agent?.company
          ? {
              '@type': 'Organization',
              name: productData.agent.company,
            }
          : undefined,
      },
    };
  }

  // BreadcrumbList JSON-LD. Accepts `[{label, path}]` from ListingTemplate
  // and asset detail pages; pass `breadcrumbs` to emit.
  let breadcrumbSchema = null;
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.label,
        item: crumb.path
          ? (crumb.path.startsWith('http') ? crumb.path : `${DEFAULT_URL}${crumb.path}`)
          : undefined,
      })),
    };
  }

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow, noarchive, nosnippet'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />

      {/* Canonical Link */}
      <link rel="canonical" href={resolvedUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(navSchema)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={description || DEFAULT_DESCRIPTION} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={description || DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={seoTitle} />
    </Helmet>
  );
}