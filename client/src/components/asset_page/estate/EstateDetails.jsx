import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import numberWithCommas from "../../../modules/numberwithcomma";
import { useCart } from "../../../contexts/CartContext";
import DescriptionSidebar from "../DescriptionSidebar";
import { FiPhoneCall, FiShoppingCart, FiHeart, FiInfo, FiTag, FiChevronDown, FiChevronUp, FiSend, FiMapPin, FiCalendar, FiCheckCircle, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const EstateDetails = ({ item, modelName = "EstateAsset" }) => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activityLoading, setActivityLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Destructure with fallbacks
  const {
    _id,
    title = "Untitled Property",
    brand_logo = "",
    location = "Dubai, UAE",
    description = "No description available.",
    price = 0,
    type = "Sale",
    images = [],
    agent = {},
    keySpecifications = {},
    specification = {},
  } = item || {};

  // Price calculations for Otulia 3% discount
  const isPriceOnDemand = item?.isPriceOnRequest || !price || price <= 0;
  const originalPrice = isPriceOnDemand ? 0 : Math.round(price);
  const discountedPrice = isPriceOnDemand ? 0 : Math.round(price * 0.97);

  const handleCallAgent = async () => {
    if (!isAuthenticated) {
      alert("Please login to contact our agents.");
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setActivityLoading(true);
    try {
      const response = await fetch("/api/leads/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId: agent.id || agent._id,
          assetId: _id,
          assetModel: modelName,
          assetTitle: title,
          message: message,
          agentEmail: agent.email,
          agentName: agent.name,
        }),
      });

      if (response.ok) {
        alert(`Message sent! Agent ${agent.name || "partner"} will be notified.`);
        setMessage("");
      } else {
        throw new Error("Failed to send lead");
      }
    } catch (error) {
      console.error("Failed to send lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleWhatsapp = async () => {
    const phoneNumber = agent?.phone || "+971500000000";

    if (isAuthenticated) {
      try {
        await fetch("/api/leads/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agentId: agent.id || agent._id,
            assetId: _id,
            assetModel: modelName,
            assetTitle: title,
            message: "Inquiry via WhatsApp click",
            agentEmail: agent.email,
            agentName: agent.name,
            source: "WhatsApp",
          }),
        });
      } catch (error) {
        console.error("Failed to generate WhatsApp lead:", error);
      }
    }

    const currentUrl = window.location.href;
    const refId = item?.listingReference || _id?.slice(-8)?.toUpperCase() || "NJM9295559";
    const dealerName = agent?.name || "Otulia Channel Partner";
    const text = `Hello! I'm interested in this listing advertised by ${dealerName} on Otulia.com.

Link: ${currentUrl}
Reference ID: #${refId}

*Kindly do not edit this message to ensure your inquiry is sent to the agent.`;

    let cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = "+" + cleanPhone;
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed.");
      navigate("/login");
      return;
    }

    addToCart({
      itemId: _id,
      itemModel: modelName,
      tempId: Date.now() + Math.random().toString(),
      title,
      image: images.length > 0 ? images[0] : null,
      price: discountedPrice || price,
      totalPrice: discountedPrice || price,
      type: "Sale",
    });
  };

  function getTimeSinceJoined(createdAt) {
    if (!createdAt) return "7 months ago";
    const joinedDate = new Date(createdAt);
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - joinedDate.getFullYear()) * 12 +
      (now.getMonth() - joinedDate.getMonth());

    if (diffInMonths < 12) {
      return diffInMonths <= 0 ? "this month" : `${diffInMonths} months ago`;
    }
    const years = Math.floor(diffInMonths / 12);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }

  // Helper to render developer logo on seller card top right
  const renderDeveloperLogo = () => {
    const textToMatch = `${title} ${agent?.name || ""} ${agent?.companyName || ""} ${item?.developer || ""}`.toUpperCase();

    if (textToMatch.includes("DAMAC")) {
      return (
        <div className="flex flex-col items-end justify-center">
          <span className="text-xl md:text-2xl font-black font-sans italic tracking-[0.1em] text-black leading-none" style={{ transform: "skewX(-6deg)" }}>
            DAMAC
          </span>
        </div>
      );
    }
    if (textToMatch.includes("SOBHA")) {
      return (
        <div className="flex flex-col items-end justify-center">
          <span className="text-xl md:text-2xl font-serif font-medium tracking-[0.2em] text-black leading-none ml-1" style={{ fontFamily: "'Kaisei Decol', Georgia, serif" }}>
            SOBHA
          </span>
          <span className="text-[7.5px] font-sans font-extrabold text-black tracking-[0.3em] uppercase mt-0.5">
            REALTY
          </span>
        </div>
      );
    }
    if (textToMatch.includes("ELLINGTON")) {
      return (
        <div className="flex flex-col items-end justify-center">
          <span className="text-base md:text-lg font-serif font-bold tracking-[0.18em] text-black leading-none">
            ELLINGTON
          </span>
          <span className="text-[7px] font-sans font-bold text-black tracking-[0.2em] uppercase mt-0.5">
            PROPERTIES
          </span>
        </div>
      );
    }
    if (agent?.companyLogo || agent?.logo) {
      return <img src={agent.companyLogo || agent.logo} alt="Developer" className="h-7 max-w-[110px] object-contain" />;
    }
    return null;
  };

  const isLongDescription = description && description.length > 300;

  // Key specifications details list
  const specYear = keySpecifications?.yearOfConstruction || specification?.yearOfConstruction || specification?.year || "2030";
  const specArchitecture = specification?.architectureStyle || specification?.architecture || "Contemporary";
  const specLandArea = specification?.landArea || keySpecifications?.landArea || "2796 Sqft";
  const specBedrooms = keySpecifications?.bedrooms || specification?.bedrooms || "3";
  const specPropertyType = specification?.propertyType || specification?.type || "Apartment";
  const specBuiltArea = specification?.builtUpArea || keySpecifications?.builtUpArea || "2796 Sqft";
  const specFloors = specification?.floors || "1";
  const specBathrooms = keySpecifications?.bathrooms || specification?.bathrooms || "4";

  return (
    <>
      <DescriptionSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        description={description}
      />
      <div className="w-full px-[3%] py-8 bg-white font-sans">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Details */}
          <div className="w-full lg:w-[58%]">
            
            {/* Listing Reference ID */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                LISTING REFERENCE ID
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100/80 border border-gray-200 rounded">
                <span className="text-[11px] font-bold font-mono text-gray-800">
                  #{item.listingReference || _id?.slice(-8)?.toUpperCase() || "NJM9295559"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.listingReference || _id);
                    alert("Reference ID copied to clipboard!");
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-black"
                  title="Copy ID"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-normal text-black leading-snug mb-3"
              style={{ fontFamily: 'Canela, "Times New Roman", Times, serif' }}
            >
              {title}
            </h1>

            {/* Location */}
            <div className="inline-flex items-center gap-1.5 mb-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-500">{location}</span>
            </div>

            {/* ABOUT THE PROPERTY */}
            <div className="mb-10">
              <h2 className="text-[11px] font-bold text-[#b38b46] uppercase tracking-[0.2em] mb-4">
                ABOUT THE PROPERTY
              </h2>

              {/* Promotional Callout Box */}
              <div className="mb-4 text-sm font-normal text-gray-700 leading-relaxed">
                Purchase this property through Otulia and receive an additional 3% discount compared with the standard purchase price at the starting line.
              </div>

              {/* Description Body */}
              <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {isLongDescription && !isExpanded
                  ? `${description.substring(0, 320)}...`
                  : description}
              </div>

              {isLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 text-xs font-semibold text-gray-800 hover:text-black flex items-center gap-1 underline decoration-gray-300 underline-offset-4"
                >
                  {isExpanded ? (
                    <>Show Less <FiChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Read More <FiChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>
              )}
            </div>

            {/* PROPERTY DETAILS Grid */}
            <div className="mb-8 pt-4 border-t border-gray-100">
              <h2 className="text-[11px] font-bold text-[#b38b46] uppercase tracking-[0.2em] mb-5">
                PROPERTY DETAILS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Year Of Construction: <strong className="text-black font-semibold">{specYear}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Property Type: <strong className="text-black font-semibold">{specPropertyType}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Architecture Style: <strong className="text-black font-semibold">{specArchitecture}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Built Up Area: <strong className="text-black font-semibold">{specBuiltArea}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Land Area: <strong className="text-black font-semibold">{specLandArea}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Floors: <strong className="text-black font-semibold">{specFloors}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Bedrooms: <strong className="text-black font-semibold">{specBedrooms}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#b38b46] font-bold">-</span>
                  <span>Bathrooms: <strong className="text-black font-semibold">{specBathrooms}</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Price & Seller Card */}
          <div className="w-full lg:w-[42%] flex flex-col gap-6">
            
            {/* PRICE Block */}
            <div className="w-full flex flex-col relative pt-1">
              {/* Inclusion of all fees badge top-right */}
              <div className="absolute right-0 top-0 flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] text-gray-700 font-medium shadow-2xs">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Inclusion of all fees.</span>
                <FiInfo className="w-3 h-3 text-gray-400 cursor-pointer" />
              </div>

              <span className="text-[11px] font-bold text-[#b38b46] uppercase tracking-widest mb-1.5 w-fit">
                PRICE
              </span>

              {isPriceOnDemand ? (
                <h2 className="text-3xl md:text-4xl font-semibold text-black" style={{ fontFamily: 'Canela, "Times New Roman", Times, serif' }}>
                  Price on Demand
                </h2>
              ) : (
                <div className="flex flex-col">
                  {/* Original Struck-through Price */}
                  <div className="text-lg md:text-xl text-gray-400 line-through font-normal font-sans leading-none mb-1">
                    ${numberWithCommas(originalPrice)}
                  </div>
                  
                  {/* Discounted Price & Otulia Tag Row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-none tracking-tight">
                      ${numberWithCommas(discountedPrice)}
                    </h2>
                    <div className="bg-[#dcfce7] border border-[#b7e4c7] text-[#166534] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                      <FiTag className="w-3 h-3 rotate-90" />
                      <span>-3% with Otulia</span>
                    </div>
                  </div>

                  {/* Subtext below price */}
                  <div className="text-xs text-gray-500 font-normal mt-2.5 flex items-center gap-1">
                    <FiInfo className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>This price is available when you purchase through <strong className="font-semibold text-gray-700">Otulia</strong>.</span>
                  </div>
                </div>
              )}
            </div>

            {/* SELLER / PARTNER CARD */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col gap-4 shadow-sm mt-2">
              
              {/* Header Row: Agent Info Left | Developer Logo Right */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-black font-serif text-xl font-bold overflow-hidden shrink-0">
                    {agent?.photo ? (
                      <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      "O"
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm md:text-base font-bold text-black leading-tight">
                        {agent?.name || "Otulia Channel Partner"}
                      </h3>
                      <span className="bg-[#fef3c7] text-[#92400e] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                        PREMIUM BASIC
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>UAE</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Joined {getTimeSinceJoined(agent?.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side Developer Logo */}
                <div className="shrink-0 pt-0.5">
                  {renderDeveloperLogo()}
                </div>
              </div>

              {/* Verification Banner */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 mt-1">
                <FiCheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                <span>All sellers are thoroughly verified by <strong className="font-semibold">Otulia</strong></span>
              </div>

              {/* Call Now & WhatsApp Action Buttons (2-Column Grid) */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={handleCallAgent}
                  className="bg-[#111827] text-white px-3.5 py-3 rounded-xl flex items-center justify-between hover:bg-black transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <FiPhoneCall className="w-4 h-4 text-gray-300" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-xs">Call Now</span>
                      <span className="text-[9px] text-gray-400 font-normal">Speak directly</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </button>

                <button
                  onClick={handleWhatsapp}
                  className="bg-[#16a34a] text-white px-3.5 py-3 rounded-xl flex items-center justify-between hover:bg-[#15803d] transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <FaWhatsapp className="w-4.5 h-4.5 text-white" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-xs">WhatsApp</span>
                      <span className="text-[9px] text-green-100 font-normal">Chat on WhatsApp</span>
                    </div>
                  </div>
                  <span className="text-xs text-green-100 group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                </button>
              </div>

              {/* Message Input & Send Row */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleCallAgent}
                  disabled={activityLoading}
                  className="bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <span>{activityLoading ? "..." : "Send"}</span>
                  <FiSend className="w-3 h-3" />
                </button>
              </div>

              {/* Show Phone Number Button */}
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-black text-black py-3 rounded-xl font-bold text-xs transition-all mt-1 bg-white hover:bg-gray-50"
              >
                <FiPhoneCall className="w-3.5 h-3.5" />
                <span>{showPhone ? agent.phone || "+971 50 000 0000" : "Show phone number"}</span>
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default EstateDetails;
