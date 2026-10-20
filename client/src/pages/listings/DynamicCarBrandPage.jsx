import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingTemplate from './ListingTemplate';

const slugify = (value = '') => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const titleFromSlug = (slug = '') => slug
  .split('-')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const DynamicCarBrandPage = () => {
  const { brandSlug = '' } = useParams();
  const [brand, setBrand] = useState(() => titleFromSlug(brandSlug));

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/assets/car-taxonomy', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const canonicalBrand = (data?.brands || []).find((name) => slugify(name) === brandSlug);
        if (canonicalBrand) setBrand(canonicalBrand);
      })
      .catch((error) => { if (error.name !== 'AbortError') console.error('Could not resolve car brand:', error); });
    return () => controller.abort();
  }, [brandSlug]);

  return (
    <ListingTemplate
      pageTitle={`${brand} for Sale`}
      pageDescription={`Explore ${brand} vehicles available for purchase from trusted sellers.`}
      breadcrumb={[{ label: 'Cars', path: '/category/cars' }, { label: brand }]}
      filterParams={{ brand: brand.toLowerCase(), type: 'car' }}
    />
  );
};

export default DynamicCarBrandPage;
