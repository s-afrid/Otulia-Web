import EstateListingTemplate from '../EstateListingTemplate';

const FrenchRivieraPage = () => (
  <EstateListingTemplate
    pageTitle="French Riviera Homes for Sale"
    pageDescription="Magnificent properties along the French Riviera coast."
    breadcrumb={[{ label: 'Listings' }, { label: 'French Riviera' }]}
    filterParams={{ region: 'french-riviera', type: 'estate' }}
  />
);

export default FrenchRivieraPage;
