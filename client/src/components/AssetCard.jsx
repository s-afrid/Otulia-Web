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
  // Also determine exact Model for API
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

  if (category === '.' && item.keySpecifications) {
    const specs = item.keySpecifications;

    if (specs.power || specs.mileage || specs.topSpeed) {
      const p1 = specs.topSpeed ? (specs.topSpeed.toLowerCase().includes('mph') || specs.topSpeed.toLowerCase().includes('km') ? specs.topSpeed : `${specs.topSpeed} mph`) : specs.mileage; // Top Speed > Mileage
      const p2 = specs.engineType || specs.cylinderCapacity; // Engine Type > CC
      const p3 = specs.power ? (specs.power.toLowerCase().includes('hp') ? specs.power : `${specs.power} hp`) : null;

      displayDetails = [p1, p2, p3].filter(Boolean).join(' \u00B7 ');
      category = 'car';
    } else {
      const beds = specs.bedrooms ? `${specs.bedrooms} Beds` : null;
      const baths = specs.bathrooms ? `${specs.bathrooms} Baths` : null;
      const area = specs.builtUpArea || specs.landArea;
      displayDetails = [beds, baths, area].filter(Boolean).join(' \u00B7 ');
      category = 'estate';
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

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setActiveImageIndex(index);
  };

  return (
    <div
      onClick={() => navigate(`/asset/${category}/${item._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative border border-gray-100 shadow-sm transition-all duration-300 bg-white cursor-pointer flex flex-col hover:shadow-lg h-full"
    >
      {/* Image Container (Mask) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {/* SLIDER TRACK: DISABLED */}
        {/* 
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
        >
          {validImages.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={item.title}
              // Each image takes up 100% of the card width (min-w-full)
              // The scale effect works independently of the slide
              className={`min-w-full h-full object-cover transition-transform duration-1000 ease-in-out ${isHovered ? "scale-110" : "scale-100"
                }`}
            />
          ))}
        </div>
        */}

        {/* SINGLE IMAGE DISPLAY */}
        <img
          src={optimizeCloudinaryUrl(validImages[0], 800)} // Force to max 800px for better quality on retina displays
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${isHovered ? "scale-110" : "scale-100"}`}
        />

        {/* Pagination Dots: DISABLED */}
        {/*
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {validImages.map((_, index) => (
              <div
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm border border-black/10 
                  ${activeImageIndex === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                  }`}
              ></div>
            ))}
          </div>
        )}
        */}

        {/* Badges Container */}
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
            <div className="bg-black/80 backdrop-blur-md text-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded shadow-lg">
              For Rent
            </div>
          )}
        </div>

        {/* Heart Button */}
        <button
          className={`absolute top-3 right-3 z-20 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 group/heart ${isHovered ? "scale-110" : "scale-100"
            }`}
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

        {/* Image Count */}
        <div className="absolute bottom-3 right-3 z-20 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 text-[8px] font-medium rounded-sm">
          {activeImageIndex + 1}/{item.images?.length || 1}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        <div className="flex-1">
          {/* PRICE */}
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-xl md:text-2xl font-semibold text-black font-sans tracking-tight">
              {item.isPriceOnRequest ? 'Price on Demand' : (typeof item.price === 'number' ? `$ ${numberWithCommas(item.price)}` : item.price)}
              {!item.isPriceOnRequest && item.type === 'Rent' && <span className="text-[10px] text-gray-500 font-normal"> / day</span>}
            </p>
          </div>

          {/* DETAILS / SPECS */}
          <p className="text-[10px] md:text-[11px] text-gray-500 font-medium mb-3 uppercase tracking-wider">
            {displayDetails || "View Details"}
          </p>

          {/* TITLE */}
          <div className="mb-1">
            <h3 className={`text-black leading-tight break-words playfair-display mb-1 ${item.title.length > 40
              ? 'text-sm md:text-base'
              : 'text-base md:text-lg lg:text-xl'
              }`}>
              {item.title}
            </h3>
          </div>

          {/* LOCATION */}
          <p className="text-[10px] md:text-[11px] text-gray-400 mb-4 font-normal uppercase tracking-widest truncate">
            {item.location}
          </p>

          {isMyListings && (
            <div className="flex items-center gap-1.5 mb-3 -mt-2 bg-gray-50 w-fit px-2 py-0.5 rounded-full border border-gray-100">
              <HiOutlineEye className="text-sm text-gray-500" />
              <span className="text-[10px] font-bold text-gray-600 montserrat">
                {formatNumber(item.views || 0)} views
              </span>
            </div>
          )}
        </div>

        <div>
          {/* DIVIDER */}
          <div className="w-full h-px bg-gray-100 my-4"></div>

          {/* FOOTER: COMPANY & AGENT */}
          <div className="flex items-center justify-between min-h-[40px] gap-3">
            {/* COMPANY LOGO */}
            <div className="flex-1 min-w-0">
              {item.agent?.companyLogo ? (
                <img
                  src={optimizeCloudinaryUrl(item.agent.companyLogo, 300)}
                  alt={item.agent.company}
                  className="h-8 max-w-[140px] object-contain object-left grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              ) : item.agent?.company ? (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate block">
                  {item.agent.company}
                </span>
              ) : null}
            </div>

            {/* AGENT INFO */}
            {item.agent && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest hidden xl:block">
                  {item.agent.name}
                </p>
                <img
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover border border-gray-200 shadow-sm hover:border-gray-400 transition-colors"
                  src={optimizeCloudinaryUrl(item.agent.photo, 100, 100)}
                  alt={item.agent.name}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetCard