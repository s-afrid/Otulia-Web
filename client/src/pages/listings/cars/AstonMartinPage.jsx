import ListingTemplate from '../ListingTemplate';

const AstonMartinPage = () => (
  <ListingTemplate
    pageTitle="Aston Martin for Sale"
    pageDescription="Discover luxury Aston Martin vehicles available in our exclusive collection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Aston Martin' }]}
    filterParams={{ brand: 'aston-martin', type: 'car' }}
  />
);

export default AstonMartinPage;
