import ListingTemplate from '../ListingTemplate';

const CostaDelSolPage = () => (
  <ListingTemplate
    pageTitle="Costa del Sol Homes for Sale"
    pageDescription="Luxury homes available in Costa del Sol, Spain's premier destination."
    breadcrumb={[{ label: 'Listings' }, { label: 'Costa del Sol' }]}
    filterParams={{ region: 'costa-del-sol', type: 'estate' }}
  />
);

export default CostaDelSolPage;
