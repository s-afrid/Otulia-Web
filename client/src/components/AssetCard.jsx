import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import numberWithCommas from '../modules/numberwithcomma'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineEye } from 'react-icons/hi2'
import formatNumber from '../modules/formatNumber'
import { optimizeCloudinaryUrl } from '../utils/imageUtils'

const AssetCard = ({ item }) => {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, refreshUser } = useAuth();

  const pathname = useLocation()
  // Correctly checking if it is the homepage or mylistings
  const homepage = pathname.pathname === '/'
  const isMyListings = pathname.pathname === '/listings'

  // STATE
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  let category = '.'

  useEffect(() => {
    if (user && user.favorites) {
      const isFav = user.favorites.some(fav =>
        fav.assetId && (fav.assetId === item._id || fav.assetId.toString() === item._id)
      );
      setIsLiked(isFav);
    }
  }, [user, item._id]);

  // 1. GET TOP 3 IMAGES ONLY
  const validImages = (() => {
    let imgs = [];
    if (item.images?.length > 0) imgs = item.images;
    else if (Array.isArray(item.image) && item.image.length > 0) imgs = item.image;
    else if (typeof item.image === 'string') imgs = [item.image];
    else imgs = ['https://via.placeholder.com/400x300?text=No+Image'];

    return imgs.slice(0, 3);
  })();

  // 2. AUTO-SLIDE EFFECT (DISABLED)
  /*
  useEffect(() => {
    if (validImages.length <= 1) return;

    // Pause auto-slide if user is hovering (optional polish)
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % validImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [validImages.length, isHovered]); // dependency on isHovered allows pausing
  */

  // 3. DETAILS LOGIC
  let displayDetails = item.details ? item.details.replace(/\s\|\s/g, ' \u00B7 ') : null;

  // Set category based on explicit field or infer from specs
  let exactModel = item.itemModel || 'Listing';
  if (item.category) {
    const cat = item.category.toLowerCase();
    if (cat === 'vehicles' || cat === 'car' || cat === 'carasset') category = 'car';
    else if (cat === 'bikes' || cat === 'bike' || cat === 'bikeasset') category = 'bike';
    else if (cat === 'yachts' || cat === 'yacht' || cat === 'yachtasset') category = 'yacht';
    else if (cat === 'estates' || cat === 'estate' || cat === 'real estate' || cat === 'estateasset') category = 'estate';
    else category = cat;
  } else if (item.itemModel) {
    const model = item.itemModel.toLowerCase();
    if (model.includes('car')) category = 'car';
    else if (model.includes('estate')) category = 'estate';
    else if (model.includes('bike')) category = 'bike';
    else if (model.includes('yacht')) category = 'yacht';
  }

  // Smart extract from keySpecifications if displayDetails is empty or generic
  if (item.keySpecifications) {
    const specs = item.keySpecifications;
    if (category === 'car' || category === 'bike') {
      const seats = specs.seatingCapacity ? `${specs.seatingCapacity} Seats` : null;
      const trans = specs.transmission;
      const eng = specs.engineCapacity || specs.engineType;
      const year = specs.year;
      const mil = specs.mileage ? (specs.mileage.toLowerCase().includes('km') || specs.mileage.toLowerCase().includes('mi') ? specs.mileage : `${specs.mileage} Km`) : null;
      const combined = [seats, trans, eng, year, mil].filter(Boolean).join(' \u00B7 ');
      if (combined) displayDetails = combined;
    } else if (category === 'estate') {
      const beds = specs.bedrooms ? `${specs.bedrooms} Beds` : null;
      const baths = specs.bathrooms ? `${specs.bathrooms} Baths` : null;
      const area = specs.builtUpArea || specs.landArea;
      const combined = [beds, baths, area].filter(Boolean).join(' \u00B7 ');
      if (combined) displayDetails = combined;
    } else if (category === 'yacht') {
      const len = specs.length;
      const guests = specs.guests ? `${specs.guests} Guests` : null;
      const cabins = specs.cabins ? `${specs.cabins} Cabins` : null;
       const combined = [len, guests, cabins].filter(Boolean).join(' \u00B7 ');
      if (combined) displayDetails = combined;
    }
  }

  // Derive Model Name if still generic
  if (exactModel === 'Listing' || !exactModel) {
    if (category === 'car') exactModel = 'CarAsset';
    else if (category === 'estate') exactModel = 'EstateAsset';
    else if (category === 'yacht') exactModel = 'YachtAsset';
    else if (category === 'bike') exactModel = 'BikeAsset';
  }


  // HANDLERS
  const handleHeartClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      navigate('/login');
      return;
    }

    // Optimistic UI update
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
          assetModel: exactModel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      refreshUser();
    } catch (error) {
      console.error(error);
      setIsLiked(previousState); // Revert on error
    }
  };

  const titleFont = '"Times New Roman", Times, serif';

  return (
    <div
      onClick={() => navigate(`/asset/${category}/${item._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-all duration-300 bg-white cursor-pointer flex flex-col h-full ${homepage ? 'border-none' : 'border border-gray-100 shadow-sm rounded-[1.5rem] overflow-hidden hover:shadow-lg hover:-translate-y-1'}`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-100 ${homepage ? 'aspect-square rounded-none' : 'aspect-[16/10]'}`}>

        <img
          src={optimizeCloudinaryUrl(validImages[0], 800)}
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* Video / Rent Badges (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {item.videoUrl && (
            <div className="bg-white/90 backdrop-blur-sm text-black px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded shadow-sm border border-gray-100 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Video
            </div>
          )}
          {item.type === 'Rent' && (
            <div className="bg-black/80 backdrop-blur-md text-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded shadow-lg">
              FOR RENT
            </div>
          )}
        </div>

        {/* Heart Button (Top Right) */}
        <button
          className={`absolute top-3 right-3 z-20 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 group/heart ${isHovered ? "scale-110" : "scale-100"}`}
          onClick={handleHeartClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "#ef4444" : "none"}
            stroke={isLiked ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            className={`w-4 h-4 transition-colors ${isLiked ? "" : "text-gray-600 group-hover/heart:text-black"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {/* Category Label (Bottom Right) */}
        {homepage && (
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded shadow-md">
              {item.specification?.propertyType || category}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`flex flex-col grow ${homepage ? 'pt-4' : 'p-5'}`}>
        <div className="flex-1">
          {homepage ? (
            <>
              {/* Homepage Layout */}
              <div className="mb-2">
                <p className="text-lg md:text-xl font-medium text-black font-serif tracking-tight" style={{ fontFamily: titleFont }}>
                  {item.isPriceOnRequest ? 'Price on Demand' : (typeof item.price === 'number' ? `$${numberWithCommas(item.price)}` : item.price)}
                  {!item.isPriceOnRequest && item.type === 'Rent' && <span className="text-[10px] text-gray-500 font-normal"> / day</span>}
                </p>
              </div>

              <div className="mb-3">
                <span className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1 w-fit montserrat">
                  VIEW DETAILS <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </span>
              </div>

              <div className="mb-3">
                <h3 className={`text-black leading-snug break-words ${item.title.length > 40 ? 'text-sm' : 'text-base'}`} style={{ fontFamily: titleFont }}>
                  {item.title}
                </h3>
              </div>

              <div className="flex items-start gap-1.5 text-[10px] text-gray-500 font-medium tracking-wide mt-auto montserrat">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span className="truncate">{item.location}</span>
              </div>
            </>
          ) : (
            <>
              {/* Default Layout (Marketplace etc.) */}
              {category === 'estate' ? (
                <>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-xl md:text-2xl font-normal text-black tracking-tight" style={{ fontFamily: titleFont }}>
                      {item.isPriceOnRequest ? 'Price on Demand' : (typeof item.price === 'number' ? `$${numberWithCommas(item.price)}` : item.price)}
                      {!item.isPriceOnRequest && item.type === 'Rent' && <span className="text-[10px] text-gray-500 font-normal montserrat"> / day</span>}
                    </p>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-3 tracking-wide montserrat">
                    {displayDetails || "View Details"}
                  </p>
                  <div className="mb-2">
                    <h3 className={`text-black leading-snug break-words ${item.title.length > 40 ? 'text-sm md:text-base' : 'text-base md:text-lg'}`} style={{ fontFamily: titleFont }}>
                      {item.title}
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-1">
                    <h3 className={`text-black leading-snug break-words ${item.title.length > 40 ? 'text-base' : 'text-lg md:text-xl'}`} style={{ fontFamily: titleFont }}>
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-lg md:text-xl font-normal text-black tracking-tight" style={{ fontFamily: titleFont }}>
                      {item.isPriceOnRequest ? 'Price on Demand' : (typeof item.price === 'number' ? `$${numberWithCommas(item.price)}` : item.price)}
                      {!item.isPriceOnRequest && item.type === 'Rent' && <span className="text-[10px] text-gray-500 font-normal montserrat"> / day</span>}
                    </p>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-3 tracking-wide montserrat">
                    {displayDetails || "View Details"}
                  </p>
                </>
              )}

              <div className="flex items-start gap-1.5 text-[10px] text-gray-500 font-medium tracking-wide mt-auto mb-4 montserrat w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span className="truncate">{item.location}</span>
              </div>
            </>
          )}
        </div>

        {!homepage && (
          <div>
            <div className="w-full h-px bg-gray-100 my-4"></div>
            <div className="flex items-center justify-between min-h-[30px] gap-3">
              {/* Left Side: Company / Dealer Logo and Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {item.agent?.companyLogo && (
                  <img
                    src={optimizeCloudinaryUrl(item.agent.companyLogo, 100, 100)}
                    alt={item.agent.company || 'Company'}
                    className="w-6 h-6 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                )}
                <span className="text-[11px] text-gray-600 font-medium tracking-wide truncate montserrat">
                  {item.agent?.company || 'Verified Dealer'}
                </span>
              </div>

              {/* Right Side: Listed by Agent */}
              {item.agent && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide montserrat hidden sm:block">
                    Listed by {item.agent.name.split(' ')[0]} {/* Show first name to save space */}
                  </p>
                  <img
                    className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                    src={optimizeCloudinaryUrl(item.agent.photo, 100, 100)}
                    alt={item.agent.name}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetCard