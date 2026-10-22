import EstateListingTemplate from '../EstateListingTemplate';

const CanadaPage = () => (
  <EstateListingTemplate
    pageTitle="Homes for Sale in Canada"
    pageDescription="Beautiful properties across Canada's major cities and regions."
    breadcrumb={[{ label: 'Listings' }, { label: 'Countries' }, { label: 'Canada' }]}
    filterParams={{ country: 'canada', type: 'estate' }}
  />
);

export default CanadaPage;
