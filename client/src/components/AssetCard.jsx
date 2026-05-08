import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import numberWithCommas from "../modules/numberwithcomma";
import { useAuth } from "../contexts/AuthContext";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

const AssetCard = ({ item }) => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const pathname = useLocation();

  // STATE
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let category = "estate"; // Default fallback

  useEffect(() => {
    if (user && user.favorites) {
      const isFav = user.favorites.some(
        (fav) =>
          fav.assetId &&
          (fav.assetId === item._id || fav.assetId.toString() === item._id),
      );
      setIsLiked(isFav);
    }
  }, [user, item._id]);

  // CATEGORY INFERENCE
  if (item.category) {
    const cat = item.category.toLowerCase();
    if (cat === "vehicles" || cat === "car" || cat === "carasset")
      category = "car";
    else if (cat === "bikes" || cat === "bike" || cat === "bikeasset")
      category = "bike";
    else if (cat === "yachts" || cat === "yacht" || cat === "yachtasset")
      category = "yacht";
    else if (
      cat === "estates" ||
      cat === "estate" ||
      cat === "real estate" ||
      cat === "estateasset"
    )
      category = "estate";
  } else if (item.itemModel) {
    const model = item.itemModel.toLowerCase();
    if (model.includes("car")) category = "car";
    else if (model.includes("estate")) category = "estate";
    else if (model.includes("bike")) category = "bike";
    else if (model.includes("yacht")) category = "yacht";
  }

  // DETAILS EXTRACTION
  let specs_list = [];
  if (item.keySpecifications) {
    const specs = item.keySpecifications;
    if (category === "car") {
      specs_list = [
        specs.engineType,
        specs.power
          ? specs.power.toString().toLowerCase().includes("hp")
            ? specs.power
            : `${specs.power} HP`
          : null,
        specs.year || item.specification?.yearOfConstruction,
      ].filter(Boolean);
    } else if (category === "bike") {
      specs_list = [
        specs.year,
        specs.engineCapacity || specs.engineType,
        specs.seatingCapacity ? `${specs.seatingCapacity} Seats` : null,
      ].filter(Boolean);
    } else if (category === "estate") {
      let area = specs.builtUpArea || specs.landArea;
      if (area && !area.toString().toLowerCase().includes("sq")) {
        area = `${area} Sqft`;
      }
      specs_list = [
        specs.bedrooms ? `${specs.bedrooms} Beds` : null,
        specs.bathrooms ? `${specs.bathrooms} Baths` : null,
        area,
      ].filter(Boolean);
    } else if (category === "yacht") {
      specs_list = [
        specs.length,
        specs.guests ? `${specs.guests} Guests` : null,
        specs.cabins ? `${specs.cabins} Cabins` : null,
      ].filter(Boolean);
    }
  }

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      navigate("/login");
      return;
    }
    const previousState = isLiked;
    setIsLiked(!isLiked);
    try {
      const response = await fetch("/api/auth/toggle-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetId: item._id,
          assetModel:
            item.itemModel ||
            (category === "car"
              ? "CarAsset"
              : category === "bike"
                ? "BikeAsset"
                : category === "yacht"
                  ? "YachtAsset"
                  : "EstateAsset"),
        }),
      });
      if (!response.ok) throw new Error("Failed to toggle favorite");
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
      className="group relative bg-white flex flex-col"
      style={{ 
        width: "595px", 
        borderRadius: "1px", 
        border: "1px solid rgba(0, 0, 0, 0.12)" 
      }}
    >
      {/* IMAGE AREA */}
      <div className="relative overflow-hidden" style={{ width: "595px", height: "375px" }}>
        <img
          src={optimizeCloudinaryUrl(item.images?.[0] || item.image, 800)}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* TOP LEFT BADGE */}
        {item.type === "Rent" && (
          <div className="absolute top-4 left-4 z-10 bg-[#1a1a1a] text-white text-[9px] font-bold px-2.5 py-1.5 rounded-md uppercase tracking-[0.1em] shadow-lg">
            FOR RENT
          </div>
        )}

        {/* TOP RIGHT FAVORITE */}
        <button
          onClick={handleHeartClick}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-110"
        >
          <FiHeart
            className={`w-4 h-4 ${isLiked ? "fill-red-500 stroke-red-500" : "text-[#666]"}`}
          />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="px-6 py-5 flex flex-col bg-white" style={{ width: "595px", height: "191px", border: "1px solid rgba(0,0,0,0.12)" }}>
        {/* Conditional Layout for Cars: Title above Price */}
        <div className="flex flex-col gap-2">
          {category === "car" ? (
            <>
              {/* TITLE */}
              <div>
                <h4 
                  className="line-clamp-1"
                  style={{ fontFamily: "'Kaisei Decol', serif", fontWeight: 500, fontSize: "20px", lineHeight: "100%", color: "#2A2A2A" }}
                >
                  {item.title}
                </h4>
              </div>

              {/* PRICE */}
              <div>
                <h3 
                  className="text-[18px] text-[#1a1a1a] tracking-tight lining-nums"
                  style={{ fontFamily: "'Konkhmer Sleokchher', cursive", fontWeight: 400, lineHeight: "100%" }}
                >
                  {item.isPriceOnRequest
                    ? "Price on Demand"
                    : `$${numberWithCommas(item.price)}`}
                  {item.type === "Rent" && !item.isPriceOnRequest && (
                    <span className="text-[11px] text-gray-500 font-normal montserrat ml-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      / day
                    </span>
                  )}
                </h3>
              </div>

              {/* PROPERTY DETAILS */}
              <div>
                <div 
                  className="flex items-center gap-2 tracking-[0.1px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#999999" }}
                >
                  {specs_list.length > 0 ? (
                    specs_list.map((spec, index) => (
                      <React.Fragment key={index}>
                        <div>{spec}</div>
                        {index < specs_list.length - 1 && (
                          <div style={{ color: "#999999", fontWeight: "bold", opacity: 0.5 }}>·</div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div>{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* PRICE */}
              <div>
                <h3 
                  className="text-[24px] text-[#1a1a1a] tracking-tight lining-nums"
                  style={{ fontFamily: "'Konkhmer Sleokchher', cursive", fontWeight: 400, lineHeight: "100%" }}
                >
                  {item.isPriceOnRequest
                    ? "Price on Demand"
                    : `$${numberWithCommas(item.price)}`}
                  {item.type === "Rent" && !item.isPriceOnRequest && (
                    <span className="text-[11px] text-gray-500 font-normal montserrat ml-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      / day
                    </span>
                  )}
                </h3>
              </div>

              {/* PROPERTY DETAILS */}
              <div>
                <div 
                  className="flex items-center gap-2 tracking-[0.1px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#999999" }}
                >
                  {specs_list.length > 0 ? (
                    specs_list.map((spec, index) => (
                      <React.Fragment key={index}>
                        <div>{spec}</div>
                        {index < specs_list.length - 1 && (
                          <div style={{ color: "#999999", fontWeight: "bold", opacity: 0.5 }}>·</div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div>{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  )}
                </div>
              </div>

              {/* TITLE */}
              <div>
                <h4 
                  className="line-clamp-1"
                  style={{ fontFamily: "'Kaisei Decol', serif", fontWeight: 500, fontSize: "15px", lineHeight: "100%", color: "#2A2A2A" }}
                >
                  {item.title}
                </h4>
              </div>
            </>
          )}

          {/* LOCATION */}
          <div>
            <span 
              className="truncate"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "11.5px", lineHeight: "100%", color: "#888888" }}
            >
              {item.location}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-[6px] border-t border-[#eeeeee] flex items-center justify-between">
          {/* Logo / Initials */}
          <div className="flex items-center">
            {item.agent?.companyLogo ? (
              <img
                src={optimizeCloudinaryUrl(item.agent.companyLogo, 200)}
                alt="Company"
                className="h-7 w-auto object-contain shrink-0"
              />
            ) : (
              <div className="text-[20px] font-normal tracking-tight text-[#2a2a2a] canela">
                RH
              </div>
            )}
          </div>

          {/* Agent Section */}
          <div className="flex items-center gap-[10px]">
            <span className="text-[10px] font-normal text-[#9a9a9a] montserrat truncate max-w-[120px]">
              Listed by{" "}
              <span className="text-[#5a5a5a] font-normal">
                {item.agent?.name?.split(" ")[0] || "Marshall"}
              </span>
            </span>
            <div className="w-[47px] h-[45px] rounded-full overflow-hidden border border-gray-50 shadow-sm shrink-0">
              <img
                src={optimizeCloudinaryUrl(
                  item.agent?.photo || "https://via.placeholder.com/100",
                  100,
                  100,
                )}
                alt="Agent"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
