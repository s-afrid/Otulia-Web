import EstateListingTemplate from '../EstateListingTemplate';

const TuscanyPage = () => (
  <EstateListingTemplate
    pageTitle="Tuscany Homes for Sale"
    pageDescription="Charming villas and estates in the heart of Tuscany, Italy."
    breadcrumb={[{ label: 'Listings' }, { label: 'Tuscany' }]}
    filterParams={{ region: 'tuscany', type: 'estate' }}
  />
);

export default TuscanyPage;
