import ListingTemplate from '../ListingTemplate';

const BugattiChironPage = () => (
  <ListingTemplate
    pageTitle="Bugatti Chiron for Sale"
    pageDescription="The legendary Bugatti Chiron supercars from our exclusive selection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Bugatti Chiron' }]}
    filterParams={{ brand: 'bugatti', model: 'chiron', type: 'car' }}
  />
);

export default BugattiChironPage;
