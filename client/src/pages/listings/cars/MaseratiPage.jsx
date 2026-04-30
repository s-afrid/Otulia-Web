import ListingTemplate from '../ListingTemplate';

const MaseratiPage = () => (
  <ListingTemplate
    pageTitle="Maserati for Sale"
    pageDescription="Luxury Maserati models available in our exclusive selection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Maserati' }]}
    filterParams={{ brand: 'maserati', type: 'car' }}
  />
);

export default MaseratiPage;
