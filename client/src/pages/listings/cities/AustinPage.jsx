import ListingTemplate from '../ListingTemplate';

const AustinPage = () => (
  <ListingTemplate
    pageTitle="Austin Homes for Sale"
    pageDescription="Luxury homes and properties in Austin, Texas' dynamic market."
    breadcrumb={[{ label: 'Listings' }, { label: 'Austin' }]}
    filterParams={{ region: 'austin', type: 'estate' }}
  />
);

export default AustinPage;
