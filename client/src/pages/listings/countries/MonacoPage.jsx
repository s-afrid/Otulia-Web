import ListingTemplate from '../ListingTemplate';

const MonacoPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Monaco"
    pageDescription="Exclusive luxury properties in the prestigious Monaco."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Monaco' }]}
    filterParams={{ country: 'monaco', type: 'estate' }}
  />
);

export default MonacoPage;
