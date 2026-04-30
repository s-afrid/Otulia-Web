import ListingTemplate from '../ListingTemplate';

const IrelandPage = () => (
  <ListingTemplate
    pageTitle="Homes for Sale in Ireland"
    pageDescription="Beautiful properties across Ireland's cities and countryside."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Ireland' }]}
    filterParams={{ country: 'ireland', type: 'estate' }}
  />
);

export default IrelandPage;
