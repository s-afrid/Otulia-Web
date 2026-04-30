import ListingTemplate from '../ListingTemplate';

const AmsterdamPage = () => (
  <ListingTemplate
    pageTitle="Amsterdam Homes for Sale"
    pageDescription="Beautiful canal houses and properties in Amsterdam, Netherlands."
    breadcrumb={[{ label: 'Listings' }, { label: 'Amsterdam' }]}
    filterParams={{ region: 'amsterdam', type: 'estate' }}
  />
);

export default AmsterdamPage;
