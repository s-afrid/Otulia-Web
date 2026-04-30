import ListingTemplate from '../ListingTemplate';

const BalearicIslandsPage = () => (
  <ListingTemplate
    pageTitle="Balearic Islands Homes for Sale"
    pageDescription="Exclusive properties in the stunning Balearic Islands."
    breadcrumb={[
      { label: 'Listings' },
      { label: 'Balearic Islands' }
    ]}
    filterParams={{ region: 'balearic-islands', type: 'estate' }}
  />
);

export default BalearicIslandsPage;
