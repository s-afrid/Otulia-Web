import { useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';
import { createAssetSlug } from '../../utils/slugUtils';

// Turns an API listing into the few values the card needs.
const getCardData = (item) => {
  const specs = item.keySpecifications || {};
  const spec = item.specification || {};
  const beds = specs.bedrooms || spec.bedrooms;
  const baths = specs.bathrooms || spec.bathrooms;
  let area = specs.builtUpArea || spec.builtUpArea || specs.landArea;
  if (area && !String(area).toLowerCase().includes('sq')) area = `${area} Sqft`;

  const propertyType = specs.propertyType || spec.propertyType || 'Home';
  const price = item.isPriceOnRequest || !item.price ? 'Price On Request' : `$${numberWithCommas(item.price)}`;

  return {
    price: item.type === 'Rent' && !item.isPriceOnRequest ? `${price} /mo` : price,
    tags: [beds && `${beds} Beds`, baths && `${baths} Baths`, area].filter(Boolean),
    subtitle: item.location ? `${propertyType} in ${item.location}` : propertyType,
    images: (item.images || []).map((src) => optimizeCloudinaryUrl(src, 800)),
    badges: [item.videoUrl && 'Video', item.virtualTour && 'Virtual tour', item.type === 'Rent' && 'For rent'].filter(Boolean),
    photoCount: item.photoCount || item.images?.length || 0,
    agent: item.agent || {},
  };
};

const Badges = ({ badges }) => (
  <div className="absolute left-3 top-3 flex gap-1.5">
    {badges.map((badge) => (
      <span key={badge} className="bg-white px-1.5 py-0.5 text-xs font-medium text-gray-900">{badge}</span>
    ))}
  </div>
);

const PhotoCount = ({ count }) => count > 0 && (
  <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">1/{count}</span>
);

const AgentFooter = ({ agent }) => (
  <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
    {agent.companyLogo
      ? <img src={optimizeCloudinaryUrl(agent.companyLogo, 200)} alt={agent.company || 'Agency'} className="h-10 max-w-[120px] object-contain" />
      : <span className="truncate text-xs font-semibold uppercase tracking-wider text-gray-700">{agent.company || ''}</span>}
    {agent.name && (
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="truncate text-sm text-gray-500">{agent.name}</span>
        {agent.photo
          ? <img src={optimizeCloudinaryUrl(agent.photo, 80)} alt={agent.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
          : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">{agent.name[0]}</span>}
      </div>
    )}
  </div>
);

const PriceRow = ({ price, onContact }) => (
  <div className="flex items-start justify-between gap-3">
    <p className="text-lg font-semibold text-gray-900">{price}</p>
    <button type="button" onClick={onContact} className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-900 hover:underline">
      Contact <FiMail />
    </button>
  </div>
);

const EstateListingCard = ({ item, featured = false }) => {
  const navigate = useNavigate();
  const card = getCardData(item);

  const openListing = () => {
    if (item.isPlaceholder) return;
    navigate(`/asset/estate/${createAssetSlug(item.title, item._id)}`, { state: { id: item._id } });
  };

  const handleContact = (event) => {
    event.stopPropagation();
    if (item.agent?.email) window.location.href = `mailto:${item.agent.email}?subject=${encodeURIComponent(item.title)}`;
    else openListing();
  };

  // Wide "promoted" card: photos on the left, details panel on the right.
  if (featured) {
    return (
      <article onClick={openListing} className="group grid cursor-pointer border border-gray-200 bg-white sm:col-span-2 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-0.5">
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 md:aspect-auto md:min-h-64 md:flex-1">
            <img src={card.images[0]} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 md:absolute md:inset-0" />
            <Badges badges={card.badges} />
            <PhotoCount count={card.photoCount} />
          </div>
          {card.images.length > 2 && (
            <div className="hidden grid-cols-2 gap-0.5 md:grid">
              {card.images.slice(1, 3).map((src) => <img key={src} src={src} alt="" className="aspect-[16/9] w-full object-cover" />)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 bg-[#eef3f3] p-5 md:p-6">
          <PriceRow price={card.price} onContact={handleContact} />
          <p className="text-base text-gray-800">{card.tags.join(' · ')}</p>
          <p className="truncate text-base text-gray-500">{card.subtitle}</p>
          {item.amenities?.length > 0 && (
            <ul className="my-2 grid grid-cols-2 gap-x-4 gap-y-1.5 border-y border-gray-300 py-3 text-sm text-gray-700">
              {item.amenities.slice(0, 4).map((amenity) => <li key={amenity}>{amenity}</li>)}
            </ul>
          )}
          <p className="text-sm font-medium text-gray-700">{item.title}</p>
          {item.description && <p className="line-clamp-2 text-sm text-gray-500">{item.description}</p>}
          <div className="mt-auto pt-3"><AgentFooter agent={card.agent} /></div>
        </div>
      </article>
    );
  }

  return (
    <article onClick={openListing} className="group flex cursor-pointer flex-col border border-gray-200 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img src={card.images[0]} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Badges badges={card.badges} />
        <PhotoCount count={card.photoCount} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <PriceRow price={card.price} onContact={handleContact} />
        <p className="text-sm text-gray-700">{card.tags.join(' · ')}</p>
        <p className="mb-3 truncate text-sm text-gray-500">{card.subtitle}</p>
        <AgentFooter agent={card.agent} />
      </div>
    </article>
  );
};

export default EstateListingCard;
