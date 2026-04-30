import ListingTemplate from '../ListingTemplate';

const FerrariPage = () => (
  <ListingTemplate
    pageTitle="Ferrari for Sale"
    pageDescription="Explore our exclusive collection of Ferrari supercars available for purchase."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Ferrari' }]}
    filterParams={{ brand: 'ferrari', type: 'car' }}
  />
);

export default FerrariPage;
