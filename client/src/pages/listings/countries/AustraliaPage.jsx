import ListingTemplate from '../ListingTemplate';

const AustraliaPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Australia"
    pageDescription="Premium properties and estates across Australia."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Australia' }]}
    filterParams={{ country: 'australia', type: 'estate' }}
  />
);

export default AustraliaPage;
