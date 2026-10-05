import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export const BRAND_TITLE = 'Otulia | Luxury Cars, Real Estate & Yachts Marketplace';
const DEFAULT_DESCRIPTION =
  'Otulia is the global luxury marketplace to buy and sell luxury cars, real estate, yachts and bikes from verified dealers and private sellers.';
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

const productPropertyLabels = {
  yearOfConstruction: 'Year', year: 'Year', model: 'Model', variant: 'Variant', body: 'Body style',
  mileage: 'Mileage', mileageKM: 'Mileage', power: 'Power', maxPower: 'Maximum power',
  cylinderCapacity: 'Engine capacity', engineCapacityCC: 'Engine capacity', topSpeed: 'Top speed',
  engineType: 'Engine', transmission: 'Transmission', drive: 'Drive', fuel: 'Fuel',
  fuelType: 'Fuel type', exteriorColor: 'Exterior color', interiorColor: 'Interior color',
  condition: 'Condition', propertyType: 'Property type', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms',
  builtUpArea: 'Built-up area', landArea: 'Land area', yachtType: 'Yacht type', length: 'Length',
  beam: 'Beam', draft: 'Draft', guestCapacity: 'Guest capacity', crewCapacity: 'Crew capacity',
  hullMaterial: 'Hull material', usageHours: 'Usage hours', accidentFree: 'Accident-free',
};

const getProductProperties = (productData) => Object.entries({
  ...(productData?.specification || {}),
  ...(productData?.keySpecifications || {}),
})
  .filter(([key, value]) => productPropertyLabels[key] && (typeof value === 'string' || typeof value === 'number') && String(value).trim())
  .map(([key, value]) => ({
    '@type': 'PropertyValue',
    name: productPropertyLabels[key],
    value: String(value).trim(),
  }));

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

  const specification = productData?.specification || {};
  const productBrand = productData?.brand || specification.brand || specification.brandBuilder;
  const productModel = specification.model || specification.variant || productData?.variant;
  const productYear = specification.yearOfConstruction || specification.year;
  const brandAndModel = [
    productBrand && productModel && String(productModel).toLowerCase().startsWith(String(productBrand).toLowerCase()) ? null : productBrand,
    productModel,
  ].filter(Boolean).join(' ');
  const productName = brandAndModel
    ? `${productYear && !brandAndModel.includes(String(productYear)) ? `${productYear} ` : ''}${brandAndModel}`
    : productData?.title || title || 'Luxury listing';
  const listingPurpose = productData?.type === 'Rent' ? 'for rent' : 'for sale';
  const seoTitle = productData
    ? `${productName} ${listingPurpose}${productData.location ? ` in ${productData.location}` : ''} | Otulia`
    : title
      ? (/\botulia\b/i.test(title) ? title : `${title} | Otulia`)
      : BRAND_TITLE;
  const productDescription = productData
    ? [
        `${productName} ${listingPurpose}${productData.location ? ` in ${productData.location}` : ''}.`,
        productBrand && !productName.toLowerCase().includes(String(productBrand).toLowerCase()) ? productBrand : null,
        productModel && !productName.toLowerCase().includes(String(productModel).toLowerCase()) ? productModel : null,
        productYear && !productName.includes(String(productYear)) ? productYear : null,
        productData.isPriceOnRequest
          ? 'Price on request.'
          : toNumericPrice(productData.price) > 0
            ? `Price: USD ${toNumericPrice(productData.price).toLocaleString('en-US')}.`
            : null,
        description || DEFAULT_DESCRIPTION,
      ].filter(Boolean).join(' ').replace(/\s+/g, ' ').slice(0, 300)
    : description || DEFAULT_DESCRIPTION;

  // Product Schema for Assets
  let productSchema = null;
  if (productData) {
    const specCondition =
      productData?.specification?.condition || productData?.condition || productData?.usageStatus;
    const itemCondition = conditionToSchema(specCondition);
    const availability = statusToAvailability(productData.status);
    const numericPrice = toNumericPrice(productData.price);
    const onRequest = productData.isPriceOnRequest === true;

    productSchema = numericPrice > 0 && !onRequest && productData.type !== 'Rent' && productData.images?.length ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.title,
      description: productData.description || productDescription,
      image: productData.images?.length
        ? productData.images
        : [resolvedImage],
      sku: productData._id,
      category: productData.category || undefined,
      model: productData.specification?.model || undefined,
      ...(getProductProperties(productData).length ? { additionalProperty: getProductProperties(productData) } : {}),
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
        price: numericPrice,
        ...(productData.location
          ? { availableAtOrFrom: { '@type': 'Place', name: productData.location } }
          : {}),
        seller: productData.agent?.company
          ? {
              '@type': 'Organization',
              name: productData.agent.company,
            }
          : undefined,
      },
    } : null;
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
      <meta name="description" content={productDescription} />
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

      {/* Structured Data (Organization/WebSite graph is static in index.html) */}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={productDescription} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={productDescription} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={seoTitle} />
    </Helmet>
  );
}
