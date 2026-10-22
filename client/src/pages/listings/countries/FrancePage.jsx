import EstateListingTemplate from '../EstateListingTemplate';

const FrancePage = () => (
  <EstateListingTemplate
    pageTitle="Homes for Sale in France"
    pageDescription="Premium properties throughout France, from Paris to the coast."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'France' }]}
    filterParams={{ country: 'france', type: 'estate' }}
  />
);

export default FrancePage;
