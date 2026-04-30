import ListingTemplate from '../ListingTemplate';

const GermanyPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Germany"
    pageDescription="Luxury properties in Germany's prime locations and cities."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Germany' }]}
    filterParams={{ country: 'germany', type: 'estate' }}
  />
);

export default GermanyPage;
