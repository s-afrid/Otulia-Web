import ListingTemplate from '../ListingTemplate';

const GreecePage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Greece"
    pageDescription="Mediterranean properties across Greek islands and mainland."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Greece' }]}
    filterParams={{ country: 'greece', type: 'estate' }}
  />
);

export default GreecePage;
