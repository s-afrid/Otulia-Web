import ListingTemplate from '../ListingTemplate';

const AtlantaPage = () => (
  <ListingTemplate
    pageTitle="Atlanta Homes for Sale"
    pageDescription="Premium properties in Atlanta, Georgia's thriving real estate market."
    breadcrumb={[{ label: 'Listings' }, { label: 'Atlanta' }]}
    filterParams={{ region: 'atlanta', type: 'estate' }}
  />
);

export default AtlantaPage;
