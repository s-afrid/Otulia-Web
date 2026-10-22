import EstateListingTemplate from '../EstateListingTemplate';

const MonacoPage = () => (
  <EstateListingTemplate
    pageTitle="Homes for Sale in Monaco"
    pageDescription="Exclusive luxury properties in the prestigious Monaco."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Monaco' }]}
    filterParams={{ country: 'monaco', type: 'estate' }}
  />
);

export default MonacoPage;
