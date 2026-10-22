import EstateListingTemplate from '../EstateListingTemplate';

const BenehavisPage = () => (
  <EstateListingTemplate
    pageTitle="Benahavís Homes for Sale"
    pageDescription="Exclusive properties in Benahavís, one of Spain's most prestigious destinations."
    breadcrumb={[{ label: 'Listings' }, { label: 'Benahavís' }]}
    filterParams={{ region: 'benahavis', type: 'estate' }}
  />
);

export default BenehavisPage;
