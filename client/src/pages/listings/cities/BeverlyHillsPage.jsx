import EstateListingTemplate from '../EstateListingTemplate';

const BeverlyHillsPage = () => (
  <EstateListingTemplate
    pageTitle="Beverly Hills Homes for Sale"
    pageDescription="Iconic luxury properties in Beverly Hills, California."
    breadcrumb={[{ label: 'Listings' }, { label: 'Beverly Hills' }]}
    filterParams={{ region: 'beverly-hills', type: 'estate' }}
  />
);

export default BeverlyHillsPage;
