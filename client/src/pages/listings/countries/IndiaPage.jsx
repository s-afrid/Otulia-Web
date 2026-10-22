import EstateListingTemplate from '../EstateListingTemplate';

const IndiaPage = () => (
  <EstateListingTemplate
    pageTitle="Homes for Sale in India"
    pageDescription="Luxury properties in India's major cities and destinations."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'India' }]}
    filterParams={{ country: 'india', type: 'estate' }}
  />
);

export default IndiaPage;
