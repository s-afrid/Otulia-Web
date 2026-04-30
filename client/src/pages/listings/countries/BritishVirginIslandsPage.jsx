import ListingTemplate from '../ListingTemplate';

const BritishVirginIslandsPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in British Virgin Islands"
    pageDescription="Luxury properties in the scenic British Virgin Islands."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'British Virgin Islands' }]}
    filterParams={{ country: 'british-virgin-islands', type: 'estate' }}
  />
);

export default BritishVirginIslandsPage;
