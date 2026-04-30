import ListingTemplate from '../ListingTemplate';

const CaymanIslandsPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Cayman Islands"
    pageDescription="Exclusive island properties in the Cayman Islands."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Cayman Islands' }]}
    filterParams={{ country: 'cayman-islands', type: 'estate' }}
  />
);

export default CaymanIslandsPage;
