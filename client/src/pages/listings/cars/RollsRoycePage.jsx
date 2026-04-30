import ListingTemplate from '../ListingTemplate';

const RollsRoycePage = () => (
  <ListingTemplate
    pageTitle="Rolls-Royce for Sale"
    pageDescription="Iconic Rolls-Royce luxury vehicles available for purchase."
    breadcrumb={[{ label: 'Listings' }, { label: 'Cars' }, { label: 'Rolls-Royce' }]}
    filterParams={{ brand: 'rolls-royce', type: 'car' }}
  />
);

export default RollsRoycePage;
