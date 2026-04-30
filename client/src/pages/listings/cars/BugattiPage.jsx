import ListingTemplate from '../ListingTemplate';

const BugattiPage = () => (
  <ListingTemplate
    pageTitle="Bugatti for Sale"
    pageDescription="Exclusive Bugatti vehicles from our prestigious inventory."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Bugatti' }]}
    filterParams={{ brand: 'bugatti', type: 'car' }}
  />
);

export default BugattiPage;
