import ListingTemplate from '../ListingTemplate';

const LamborghiniPage = () => (
  <ListingTemplate
    pageTitle="Lamborghini for Sale"
    pageDescription="Stunning Lamborghini supercars available for purchase."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Lamborghini' }]}
    filterParams={{ brand: 'lamborghini', type: 'car' }}
  />
);

export default LamborghiniPage;
