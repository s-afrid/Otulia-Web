import EstateListingTemplate from '../EstateListingTemplate';

const AtlantaPage = () => (
  <EstateListingTemplate
    pageTitle="Atlanta Homes for Sale"
    pageDescription="Premium properties in Atlanta, Georgia's thriving real estate market."
    breadcrumb={[{ label: 'Listings' }, { label: 'Atlanta' }]}
    filterParams={{ region: 'atlanta', type: 'estate' }}
  />
);

export default AtlantaPage;
