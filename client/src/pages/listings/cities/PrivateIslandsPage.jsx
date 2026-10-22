import EstateListingTemplate from '../EstateListingTemplate';

const PrivateIslandsPage = () => (
  <EstateListingTemplate
    pageTitle="Private Islands for Sale"
    pageDescription="Discover exclusive private island listings available for sale worldwide."
    breadcrumb={[
      { label: 'Listings', path: '/listings' },
      { label: 'Cities & Regions' },
      { label: 'Private Islands' }
    ]}
    filterParams={{ type: 'island' }}
  />
);

export default PrivateIslandsPage;
