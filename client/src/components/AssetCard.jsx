import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import numberWithCommas from '../modules/numberwithcomma'
import { useAuth } from '../contexts/AuthContext'
import { FiHeart, FiMapPin } from 'react-icons/fi'
import { optimizeCloudinaryUrl } from '../utils/imageUtils'

const AssetCard = ({ item }) => {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const pathname = useLocation()

  // STATE
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let category = 'estate'; // Default fallback

  useEffect(() => {
    if (user && user.favorites) {
      const isFav = user.favorites.some(fav =>
        fav.assetId && (fav.assetId === item._id || fav.assetId.toString() === item._id)
      );
      setIsLiked(isFav);
    }
  }, [user, item._id]);

  // CATEGORY INFERENCE
  if (item.category) {
    const cat = item.category.toLowerCase();
    if (cat === 'vehicles' || cat === 'car' || cat === 'carasset') category = 'car';
    else if (cat === 'bikes' || cat === 'bike' || cat === 'bikeasset') category = 'bike';
    else if (cat === 'yachts' || cat === 'yacht' || cat === 'yachtasset') category = 'yacht';
    else if (cat === 'estates' || cat === 'estate' || cat === 'real estate' || cat === 'estateasset') category = 'estate';
  } else if (item.itemModel) {
    const model = item.itemModel.toLowerCase();
    if (model.includes('car')) category = 'car';
    else if (model.includes('estate')) category = 'estate';
    else if (model.includes('bike')) category = 'bike';
    else if (model.includes('yacht')) category = 'yacht';
  }

  // DETAILS EXTRACTION
  let displayDetails = "";
  if (item.keySpecifications) {
    const specs = item.keySpecifications;
    if (category === 'car' || category === 'bike') {
      const year = specs.year;
      const eng = specs.engineCapacity || specs.engineType;
      const seats = specs.seatingCapacity ? `${specs.seatingCapacity} Seats` : null;
      displayDetails = [year, eng, seats].filter(Boolean).join(' \u00B7 ');
    } else if (category === 'estate') {
      const beds = specs.bedrooms ? `${specs.bedrooms} Beds` : null;
      const baths = specs.bathrooms ? `${specs.bathrooms} Baths` : null;
      const area = specs.builtUpArea || specs.landArea;
      displayDetails = [beds, baths, area].filter(Boolean).join(' \u00B7 ');
    } else if (category === 'yacht') {
      const len = specs.length;
      const guests = specs.guests ? `${specs.guests} Guests` : null;
      const cabins = specs.cabins ? `${specs.cabins} Cabins` : null;
      displayDetails = [len, guests, cabins].filter(Boolean).join(' \u00B7 ');
    }
  }

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      navigate('/login');
      return;
    }
    const previousState = isLiked;
    setIsLiked(!isLiked);
    try {
      const response = await fetch('/api/auth/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assetId: item._id,
          assetModel: item.itemModel || (category === 'car' ? 'CarAsset' : category === 'bike' ? 'BikeAsset' : category === 'yacht' ? 'YachtAsset' : 'EstateAsset')
        })
      });
      if (!response.ok) throw new Error('Failed to toggle favorite');
      refreshUser();
    } catch (error) {
      console.error(error);
      setIsLiked(previousState);
    }
  };

  return (
    <div
      onClick={() => navigate(`/asset/${category}/${item._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* IMAGE AREA */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={optimizeCloudinaryUrl(item.images?.[0] || item.image, 800)}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* TOP LEFT BADGE */}
        {item.type === 'Rent' && (
          <div className="absolute top-4 left-4 z-10 bg-[#111827] text-white text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-widest shadow-lg">
            FOR RENT
          </div>
        )}

        {/* TOP RIGHT FAVORITE */}
        <button
          onClick={handleHeartClick}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110 active:scale-95"
        >
          <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-red-500 stroke-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 flex flex-col flex-1">
        {/* PRICE */}
        <div className="mb-1">
          <h3 className="text-[23px] font-normal text-black canela tracking-tight leading-none">
            {item.isPriceOnRequest ? 'Price on Demand' : `$${numberWithCommas(item.price)}`}
            {item.type === 'Rent' && !item.isPriceOnRequest && (
              <span className="text-[12px] text-gray-500 font-medium montserrat ml-1">/ day</span>
            )}
          </h3>
        </div>

        {/* DETAILS (Beds, Baths, etc) */}
        <div className="mb-2">
          <p className="text-[10px] font-medium text-gray-400 montserrat uppercase tracking-wider">
            {displayDetails || (category.charAt(0).toUpperCase() + category.slice(1))}
          </p>
        </div>

        {/* TITLE */}
        <div className="mb-3">
          <h4 className="text-[14px] font-medium text-black leading-snug montserrat line-clamp-1">
            {item.title}
          </h4>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1.5 text-gray-400 mt-auto">
          <FiMapPin className="text-[10px] shrink-0" />
          <span className="text-[10px] font-medium truncate montserrat">
            {item.location}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden max-w-[40%]">
             {item.agent?.companyLogo ? (
               <img 
                 src={optimizeCloudinaryUrl(item.agent.companyLogo, 200)} 
                 alt="Company" 
                 className="h-6 w-auto object-contain shrink-0"
               />
             ) : (
               <div className="text-lg font-black tracking-tighter text-black/90 font-serif">RH</div>
             )}
          </div>
          
          <div className="flex items-center gap-2.5 flex-1 justify-end min-w-0">
            <span className="text-[9px] font-medium text-gray-400 montserrat truncate">
              Listed by {item.agent?.name || 'Marshall Salvi'}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <img 
                src={optimizeCloudinaryUrl(item.agent?.photo || 'https://via.placeholder.com/100', 100, 100)} 
                alt="Agent" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetCard