import ListingTemplate from '../ListingTemplate';

const KoenigseggPage = () => (
  <ListingTemplate
    pageTitle="Koenigsegg for Sale"
    pageDescription="Premium Koenigsegg hypercars available from our curated collection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Koenigsegg' }]}
    filterParams={{ brand: 'koenigsegg', type: 'car' }}
  />
);

export default KoenigseggPage;
