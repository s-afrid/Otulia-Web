import ListingTemplate from '../ListingTemplate';

const PorschePage = () => (
  <ListingTemplate
    pageTitle="Porsche for Sale"
    pageDescription="Premium Porsche vehicles available in our collection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Porsche' }]}
    filterParams={{ brand: 'porsche', type: 'car' }}
  />
);

export default PorschePage;
