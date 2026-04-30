import ListingTemplate from '../ListingTemplate';

const PaganiPage = () => (
  <ListingTemplate
    pageTitle="Pagani for Sale"
    pageDescription="Rare Pagani hypercars from our specialized collection."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Pagani' }]}
    filterParams={{ brand: 'pagani', type: 'car' }}
  />
);

export default PaganiPage;
