import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  FaTrophy,
  FaBolt,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGlobe,
  FaCalendarAlt,
  FaTag,
  FaUsers,
  FaHome,
  FaTree,
  FaBed,
  FaBath,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import youtubeIcon from "../../assets/icons/social/youtube.svg";
import instagramIcon from "../../assets/icons/social/instagram.svg";
import xIcon from "../../assets/icons/social/x_inverted.svg";
import estateIcon from "../../assets/icons/estate_icon.png";

function RankingCard({ cars, data, onVote, isVoting, votesRemaining = 3 }) {
  const [openSnackbarId, setOpenSnackbarId] = useState(null);
  const [toast, setToast] = useState({ show: false, nomineeName: "", votesLeft: 3, limitReached: false });

  const isLimitReached = votesRemaining <= 0;

  const triggerGoldenSparkles = (e) => {
    let originX = 0.5;
    let originY = 0.5;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    confetti({
      particleCount: 75,
      spread: 85,
      origin: { x: originX, y: originY },
      colors: ["#D6A125", "#FFD700", "#FFF8DC", "#FFA500", "#FFFFFF"],
      shapes: ["star", "circle"],
      scalar: 1.15,
      ticks: 220,
      gravity: 0.8,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: Math.max(0.05, originX - 0.08), y: originY },
        colors: ["#D6A125", "#F59E0B", "#FCD34D", "#FFFFFF"],
        shapes: ["star"],
        scalar: 0.95,
        ticks: 180,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: Math.min(0.95, originX + 0.08), y: originY },
        colors: ["#D6A125", "#F59E0B", "#FCD34D", "#FFFFFF"],
        shapes: ["star"],
        scalar: 0.95,
        ticks: 180,
      });
    }, 110);
  };

  const handleVoteClick = (e, car) => {
    e.stopPropagation();

    if (isLimitReached) {
      setToast({
        show: true,
        nomineeName: car.name || "Nominee",
        votesLeft: 0,
        limitReached: true,
      });
      return;
    }

    triggerGoldenSparkles(e);

    const nextVotesLeft = Math.max(0, votesRemaining - 1);
    setToast({
      show: true,
      nomineeName: car.name || "Nominee",
      votesLeft: nextVotesLeft,
      limitReached: false,
    });

    if (onVote) {
      onVote(car._id, car.categoryId);
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.show, toast.nomineeName, toast.votesLeft, toast.limitReached]);

  const getCarLinks = (car) => {
    const list = [];

    if (Array.isArray(car.sources) && car.sources.length > 0) {
      car.sources.forEach((src, idx) => {
        if (typeof src === "string" && src.trim()) {
          const formatted = src.startsWith("http") ? src : `https://${src}`;
          list.push({
            title: `Source ${idx + 1}`,
            url: formatted,
          });
        } else if (src && typeof src === "object") {
          const linkUrl = src.url || src.link || src.href;
          if (linkUrl) {
            const formatted = linkUrl.startsWith("http") || linkUrl.startsWith("/") ? linkUrl : `https://${linkUrl}`;
            list.push({
              title: src.title || src.name || `Source ${idx + 1}`,
              url: formatted,
            });
          }
        }
      });
    }

    if (car.listingLink && car.listingLink !== "#") {
      const formatted = car.listingLink.startsWith("http") || car.listingLink.startsWith("/")
        ? car.listingLink
        : `https://${car.listingLink}`;
      if (!list.some((item) => item.url === formatted)) {
        list.push({
          title: car.name ? `${car.name} Official Listing` : "Official Listing",
          url: formatted,
        });
      }
    }

    if (Array.isArray(car.socialLinks) && car.socialLinks.length > 0) {
      car.socialLinks.forEach((s) => {
        if (s && s.url) {
          const formatted = s.url.startsWith("http") ? s.url : `https://${s.url}`;
          if (!list.some((item) => item.url === formatted)) {
            const platformName = s.platform
              ? s.platform.charAt(0).toUpperCase() + s.platform.slice(1)
              : "Social Link";
            list.push({
              title: `${platformName} Page`,
              url: formatted,
            });
          }
        }
      });
    }

    const platforms = [
      { key: "youtube", title: "YouTube Channel" },
      { key: "instagram", title: "Instagram Profile" },
      { key: "twitter", title: "Twitter / X Profile" },
      { key: "tiktok", title: "TikTok Profile" },
      { key: "website", title: "Official Website" },
    ];
    platforms.forEach((p) => {
      const val = car[p.key];
      if (val && typeof val === "string" && val.trim().length > 3) {
        const formatted = val.startsWith("http") ? val : `https://${val}`;
        if (!list.some((item) => item.url === formatted)) {
          list.push({
            title: p.title,
            url: formatted,
          });
        }
      }
    });

    if (list.length === 0) {
      const brandOrName = car.name || car.brand || "Nominee";
      list.push({
        title: `${brandOrName} Official Web Page`,
        url: car.listingLink && car.listingLink !== "#" ? car.listingLink : `https://www.google.com/search?q=${encodeURIComponent(brandOrName)}`,
      });
    }

    return list;
  };

  const renderLinksSnackbar = (car) => {
    const links = getCarLinks(car);
    return (
      <div
        className="absolute bottom-full mb-2 left-0 z-50 w-72 md:w-80 rounded-xl border border-[#D6A125]/80 bg-zinc-900/95 backdrop-blur-md p-3.5 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-[#D6A125] text-xs" />
            <span className="text-[12px] font-bold text-[#D6A125] uppercase tracking-wider">
              Links & Sources ({links.length})
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenSnackbarId(null);
            }}
            className="text-zinc-400 hover:text-white text-xs font-bold w-5 h-5 rounded flex items-center justify-center hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {links.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-black/60 border border-zinc-800 hover:border-[#D6A125]/60 hover:bg-[#D6A125]/10 transition duration-150"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-semibold text-white group-hover:text-[#D6A125] transition truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                  {item.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <FaExternalLinkAlt className="text-[10px] text-zinc-400 group-hover:text-[#D6A125] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  const getCountryFlagInfo = (countryStr, brandStr) => {
    const raw = (countryStr || brandStr || "").trim();
    if (!raw) return { iso: "un", flagUrl: "https://flagcdn.com/w20/un.png", flagUrl2x: "https://flagcdn.com/w40/un.png", name: "Global" };

    const lower = raw.toLowerCase();
    const brandLower = (brandStr || "").toLowerCase();
    const combined = lower + " " + brandLower;

    let iso = "un";
    let name = raw;

    if (lower.includes("italy") || lower.includes("italian")) { iso = "it"; name = "Italy"; }
    else if (lower.includes("france") || lower.includes("french")) { iso = "fr"; name = "France"; }
    else if (lower.includes("germany") || lower.includes("german")) { iso = "de"; name = "Germany"; }
    else if (lower.includes("united kingdom") || lower.includes("uk") || lower.includes("britain") || lower.includes("british") || lower.includes("england")) { iso = "gb"; name = "United Kingdom"; }
    else if (lower.includes("united states") || lower.includes("usa") || lower.includes("us") || lower.includes("american")) { iso = "us"; name = "United States"; }
    else if (lower.includes("japan") || lower.includes("japanese")) { iso = "jp"; name = "Japan"; }
    else if (lower.includes("sweden") || lower.includes("swedish")) { iso = "se"; name = "Sweden"; }
    else if (lower.includes("croatia") || lower.includes("croatian")) { iso = "hr"; name = "Croatia"; }
    else if (lower.includes("austria") || lower.includes("austrian")) { iso = "at"; name = "Austria"; }
    else if (lower.includes("switzerland") || lower.includes("swiss")) { iso = "ch"; name = "Switzerland"; }
    else if (lower.includes("canada") || lower.includes("canadian")) { iso = "ca"; name = "Canada"; }
    else if (lower.includes("australia") || lower.includes("australian")) { iso = "au"; name = "Australia"; }
    else if (lower.includes("india") || lower.includes("indian")) { iso = "in"; name = "India"; }
    else if (lower.includes("greece") || lower.includes("greek")) { iso = "gr"; name = "Greece"; }
    else if (lower.includes("monaco")) { iso = "mc"; name = "Monaco"; }
    else if (lower.includes("spain") || lower.includes("spanish")) { iso = "es"; name = "Spain"; }
    else if (lower.includes("netherlands") || lower.includes("dutch")) { iso = "nl"; name = "Netherlands"; }
    else if (lower.includes("united arab emirates") || lower.includes("uae") || lower.includes("dubai")) { iso = "ae"; name = "UAE"; }
    else if (combined.includes("ferrari") || combined.includes("lamborghini") || combined.includes("pagani") || combined.includes("maserati") || combined.includes("alfa romeo") || combined.includes("fiat")) { iso = "it"; }
    else if (combined.includes("bugatti") || combined.includes("alpine") || combined.includes("peugeot") || combined.includes("renault")) { iso = "fr"; }
    else if (combined.includes("porsche") || combined.includes("bmw") || combined.includes("mercedes") || combined.includes("audi") || combined.includes("volkswagen") || combined.includes("maybach") || combined.includes("ruf")) { iso = "de"; }
    else if (combined.includes("roll") || combined.includes("bentley") || combined.includes("aston") || combined.includes("mclaren") || combined.includes("lotus") || combined.includes("jaguar")) { iso = "gb"; }
    else if (combined.includes("ford") || combined.includes("chevrolet") || combined.includes("corvette") || combined.includes("dodge") || combined.includes("shelby") || combined.includes("hennessey") || combined.includes("tesla")) { iso = "us"; }
    else if (combined.includes("koenigsegg") || combined.includes("volvo")) { iso = "se"; }
    else if (combined.includes("rimac")) { iso = "hr"; }
    else if (combined.includes("toyota") || combined.includes("lexus") || combined.includes("nissan") || combined.includes("honda")) { iso = "jp"; }

    return {
      iso,
      flagUrl: `https://flagcdn.com/w20/${iso}.png`,
      flagUrl2x: `https://flagcdn.com/w40/${iso}.png`,
      name,
    };
  };

  const getInitials = (name) => {
    if (!name) return "CC";
    if (name.includes("Andrew Tate")) {
      return "SG";
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getCreatorProfilePic = (car) => {
    if (car.profilePic) return car.profilePic;
    if (car.profilePicture) return car.profilePicture;
    if (car.avatar) return car.avatar;
    if (car.profileImage) return car.profileImage;
    if (car.keyDetails?.profilePic) return car.keyDetails.profilePic;
    if (car.keyDetails?.profilePicture) return car.keyDetails.profilePicture;
    
    if (car.image && car.banner && car.image !== car.banner) {
      return car.image;
    }

    if (car.name === "MrBeast") {
      return "https://unavatar.io/youtube/@mrbeast";
    }
    if (car.name === "PewDiePie") {
      return "https://unavatar.io/youtube/@pewdiepie";
    }
    if (car.name && car.name.includes("Andrew Tate")) {
      return "https://unavatar.io/twitter/Cobratate";
    }
    
    if (car.youtube) {
      const parts = car.youtube.trim().split('/');
      const handle = parts[parts.length - 1] || parts[parts.length - 2];
      if (handle) return `https://unavatar.io/youtube/${handle.replace('@', '')}`;
    }
    if (car.twitter || car.x) {
      const handle = (car.twitter || car.x).trim().split('/').pop();
      if (handle) return `https://unavatar.io/twitter/${handle}`;
    }
    
    return car.image || null;
  };


  const getCreatorStats = (car) => {
    const total = car.subscribers || "0";
    
    if (car.name === "MrBeast") {
      return {
        total: "300M+",
        youtube: "270M+",
        instagram: "45M+",
        twitter: "25M+"
      };
    }
    
    if (car.name === "PewDiePie") {
      return {
        total: "111M+",
        youtube: "111M+",
        instagram: "22M+",
        twitter: "19M+"
      };
    }

    if (car.name.includes("Andrew Tate") || (car.channelName && car.channelName.includes("Tate Car Reviews"))) {
      return {
        total: "2.52M+",
        youtube: "2.30M+",
        instagram: "180K+",
        twitter: "40K+"
      };
    }
    
    const cleanSubscribers = (sub) => {
      if (!sub) return { num: 0, suffix: "" };
      const num = parseFloat(sub);
      const suffix = sub.replace(/[0-9.]/g, '') || "";
      return { num, suffix };
    };

    const { num, suffix } = cleanSubscribers(total);
    if (isNaN(num) || num <= 0) {
      return {
        total: total || "0",
        youtube: total || "0",
        instagram: "10K+",
        twitter: "5K+"
      };
    }

    const yt = (num * 0.9).toFixed(1);
    const ig = (num * 0.15).toFixed(1);
    const tw = (num * 0.05).toFixed(1);

    const format = (val) => {
      const cleanVal = parseFloat(val).toString();
      const cleanSuffix = suffix.includes('+') ? suffix : suffix + '+';
      return cleanVal + cleanSuffix;
    };

    return {
      total: total.includes('+') ? total : total + '+',
      youtube: format(yt),
      instagram: format(ig),
      twitter: format(tw)
    };
  };

  const carList = Array.isArray(cars) ? cars : (data ? [data] : []);

  return (
    <div className="space-y-4 sm:space-y-5">
      {carList.map((car) => {
        // ----------------------------------------------------
        // 1. REAL ESTATE CARD
        // ----------------------------------------------------
        if (car.isEstate) {
          const formatLocation = (loc) => {
            if (!loc) return "";
            const parts = loc.split(",").map(p => p.trim());
            if (parts.length === 3) {
              return `${parts[1]}, ${parts[2]}, ${parts[0]}`;
            }
            return loc;
          };

          const displayLocation = formatLocation(car.location || car.brand);
          const displayPrice = car.price ? car.price.replace("$", "$ ") : "";

          return (
            <div
              key={car._id || car.id || car.name}
              id={car._id || car.id}
              className="w-full rounded-xl sm:rounded-2xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700/80 transition-all duration-300 flex flex-col md:flex-row overflow-hidden shadow-lg group"
            >
              {/* Image Container */}
              <div className="relative shrink-0 w-full md:w-[280px] lg:w-[340px] xl:w-[420px] 2xl:w-[460px] h-[210px] sm:h-[240px] md:h-auto min-h-[210px] md:min-h-[260px] bg-zinc-950 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Rank Ribbon */}
                <div className="absolute left-3.5 sm:left-4 top-0 z-10">
                  <div
                    className="flex w-[32px] sm:w-[36px] flex-col items-center py-1.5 sm:py-2 text-black rounded-b-[4px] shadow-md"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[11px] sm:text-[12px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-0.5 text-[13px] sm:text-[15px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[16px] sm:border-l-[18px] border-r-[16px] sm:border-r-[18px] border-t-[7px] sm:border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>

                {/* Bottom Image Tag */}
                {car.showBadgeOnImage && car.badge && (
                  <div className="absolute bottom-3 left-3.5 sm:left-4 z-10">
                    <span className="rounded-[4px] bg-black/85 px-2.5 py-1 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800 backdrop-blur-xs">
                      {car.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between p-4 sm:p-4.5 md:p-5 lg:p-5.5 bg-black/60">
                <div className="min-w-0">
                  {/* Title & Location */}
                  <h2 className="text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] font-bold tracking-tight text-white leading-tight truncate">
                    {car.name}
                  </h2>
                  {displayLocation && (
                    <div className="text-[11.5px] sm:text-[12.5px] text-zinc-400 font-normal mt-0.5 truncate flex items-center gap-1.5">
                      <FiMapPin className="text-[#D6A125] text-xs shrink-0" />
                      <span>{displayLocation}</span>
                    </div>
                  )}

                  {/* Price */}
                  {displayPrice && (
                    <div className="mt-1.5 text-[17px] sm:text-[20px] md:text-[22px] font-bold text-[#D6A125] leading-none">
                      {displayPrice}
                    </div>
                  )}

                  {/* Description */}
                  <p className="mt-1.5 text-[11.5px] sm:text-[12.5px] leading-relaxed text-zinc-400 font-normal line-clamp-2">
                    {car.description}
                  </p>

                  {/* Estate Metrics Box */}
                  <div className="border border-zinc-800/90 rounded-[10px] bg-zinc-950/90 p-2.5 sm:p-3 mt-2.5 w-full">
                    {/* Living, Land, Beds, Baths */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 py-0.5">
                      {car.livingArea && (
                        <div className="flex items-center gap-2">
                          <FaHome className="w-4 h-4 text-zinc-300 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11.5px] sm:text-[12px] font-bold text-white leading-none truncate">{car.livingArea}</span>
                            <span className="text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">Living Area</span>
                          </div>
                        </div>
                      )}
                      {car.landSize && (
                        <div className="flex items-center gap-2">
                          <FaTree className="w-4 h-4 text-zinc-300 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11.5px] sm:text-[12px] font-bold text-white leading-none truncate">{car.landSize}</span>
                            <span className="text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">Land Size</span>
                          </div>
                        </div>
                      )}
                      {car.bedrooms && (
                        <div className="flex items-center gap-2">
                          <FaBed className="w-4 h-4 text-zinc-300 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11.5px] sm:text-[12px] font-bold text-white leading-none truncate">{car.bedrooms}</span>
                            <span className="text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">Bedrooms</span>
                          </div>
                        </div>
                      )}
                      {car.bathrooms && (
                        <div className="flex items-center gap-2">
                          <FaBath className="w-4 h-4 text-zinc-300 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11.5px] sm:text-[12px] font-bold text-white leading-none truncate">{car.bathrooms}</span>
                            <span className="text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">Bathrooms</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Divider & Meta */}
                    <div className="border-t border-zinc-850 pt-2 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-zinc-400 font-medium">
                      <span>
                        Category: <span className="text-zinc-200 font-semibold">{car.category || "Luxury Real Estate"}</span>
                      </span>
                      <span>|</span>
                      <span>
                        Type: <span className="text-zinc-200 font-semibold">{car.propertyType || "Estate"}</span>
                      </span>
                      <span>|</span>
                      <span className="inline-flex items-center gap-1.5">
                        Status: <span className="text-zinc-200 font-semibold">{car.availabilityStatus || "For Sale"}</span>
                        <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Links Button */}
                <div className="relative mt-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                    className="flex items-center gap-1.5 text-[#D6A125] hover:text-[#f3c250] text-[12px] sm:text-[12.5px] font-bold transition duration-200 w-fit select-none"
                  >
                    <span>View all Links</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                  {openSnackbarId === car._id && renderLinksSnackbar(car)}
                </div>
              </div>

              {/* Vote Panel */}
              <div className="w-full md:w-[150px] lg:w-[170px] xl:w-[190px] shrink-0 flex flex-col items-center justify-center p-4 sm:p-4.5 md:p-5 bg-black/85 border-t md:border-t-0 md:border-l border-zinc-850 gap-3 sm:gap-3.5 select-none">
                <button
                  onClick={(e) => handleVoteClick(e, car)}
                  disabled={isVoting || isLimitReached}
                  title={isLimitReached ? "Daily limit of 3 votes reached for today" : "Click to cast a vote"}
                  className={`h-[40px] md:h-[42px] w-full max-w-[260px] md:max-w-none rounded-[10px] border text-[15px] md:text-[16px] font-bold transition duration-200 select-none ${
                    isVoting || isLimitReached
                      ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                      : "border-[#D6A125] bg-[#D6A125]/10 text-[#D6A125] hover:bg-[#D6A125]/20 cursor-pointer shadow-sm active:scale-95"
                  }`}
                >
                  {isLimitReached ? "Limit Reached" : "Vote"}
                </button>

                <div className="text-center flex flex-col items-center justify-center py-0.5">
                  <div className="text-[26px] md:text-[30px] tracking-tight font-extrabold text-white leading-none">
                    {car.votes || "0"}
                  </div>
                  <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                    {car.rawVotes ? car.rawVotes.toLocaleString() : car.votes || "0"}
                  </div>
                </div>

                <div className="w-full max-w-[260px] md:max-w-none">
                  <div className="w-full bg-[#D6A125] h-[2.5px] rounded-full mb-2 sm:mb-2.5" />
                  <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3 bg-zinc-900/90 border border-zinc-800 rounded">
                    {car.statusIcon === "trophy" || car.rank === 1 ? (
                      <FaTrophy className="text-[#D6A125] text-[11px]" />
                    ) : (
                      <FaStar className="text-[#D6A125] text-[11px]" />
                    )}
                    <span className="text-[11px] font-bold text-[#D6A125]">
                      {car.status || (car.rank === 1 ? "Leading" : "Strong Contender")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ----------------------------------------------------
        // 2. CONTENT CREATOR CARD
        // ----------------------------------------------------
        if (car.isContentCreator) {
          const stats = getCreatorStats(car);
          const profilePicUrl = getCreatorProfilePic(car);
          const bannerImageUrl = car.banner || car.bannerImage || car.coverImage || car.image;

          return (
            <div
              key={car._id || car.id || car.name}
              id={car._id || car.id}
              className="w-full rounded-xl sm:rounded-2xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700/80 transition-all duration-300 flex flex-col md:flex-row overflow-hidden shadow-lg group"
            >
              {/* Banner Container */}
              <div className="relative shrink-0 w-full md:w-[280px] lg:w-[340px] xl:w-[400px] 2xl:w-[440px] h-[200px] sm:h-[230px] md:h-auto min-h-[200px] md:min-h-[250px] bg-zinc-950 overflow-hidden">
                <img
                  src={bannerImageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Rank Ribbon */}
                <div className="absolute left-3.5 sm:left-4 top-0 z-10">
                  <div
                    className="flex w-[32px] sm:w-[36px] flex-col items-center py-1.5 sm:py-2 text-black rounded-b-[4px] shadow-md"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[11px] sm:text-[12px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-0.5 text-[13px] sm:text-[15px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[16px] sm:border-l-[18px] border-r-[16px] sm:border-r-[18px] border-t-[7px] sm:border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between p-4 sm:p-4.5 md:p-5 lg:p-5.5 bg-black/60">
                <div className="min-w-0">
                  {/* Creator Header with Avatar */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] md:w-[64px] md:h-[64px] rounded-full border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden relative shadow-md">
                      {profilePicUrl ? (
                        <img
                          src={profilePicUrl}
                          alt={car.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full rounded-full items-center justify-center text-white font-bold text-sm sm:text-base select-none"
                        style={{ display: profilePicUrl ? 'none' : 'flex' }}
                      >
                        {getInitials(car.name)}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center min-w-0">
                      <h2 className="text-[20px] sm:text-[23px] md:text-[26px] lg:text-[28px] font-extrabold tracking-tight text-white leading-tight truncate">
                        {car.name}
                      </h2>
                      <div className="text-[11.5px] sm:text-[13px] text-zinc-400 font-medium truncate mt-0.5">
                        Channel: <span className="text-zinc-200">{car.channelName || car.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Tags (Location, Joined, Genre) */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-1 text-[11px] sm:text-[12px] text-zinc-300 font-medium">
                    {car.location && (
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <FiMapPin className="text-[#D6A125] text-xs shrink-0" />
                        <span>{car.location}</span>
                      </span>
                    )}
                    {car.joinDate && (
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <FaCalendarAlt className="text-[#D6A125] text-xs shrink-0" />
                        <span>Joined {car.joinDate}</span>
                      </span>
                    )}
                    {car.genre && (
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <FaTag className="text-[#D6A125] text-xs shrink-0" />
                        <span>{car.genre}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-[11.5px] sm:text-[12.5px] leading-relaxed text-zinc-400 font-normal line-clamp-2">
                    {car.description}
                  </p>

                  {/* Social Counters Bar */}
                  <div className="bg-[#121214] border border-zinc-800/90 rounded-[8px] p-2 sm:p-2.5 mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 items-center">
                    {/* Total Subscribers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 px-1 py-1 sm:py-0">
                      <FaUsers className="text-[#D6A125] text-[16px] sm:text-[20px] shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] sm:text-[9.5px] text-zinc-400 font-semibold leading-none truncate">Total Subs</span>
                        <span className="text-[12px] sm:text-[13.5px] font-bold text-white mt-1 leading-none">{stats.total}</span>
                      </div>
                    </div>

                    {/* YouTube Subscribers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 px-1 py-1 sm:py-0">
                      <img src={youtubeIcon} alt="YouTube" className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] sm:text-[9.5px] text-zinc-400 font-semibold leading-none truncate">YouTube</span>
                        <span className="text-[12px] sm:text-[13.5px] font-bold text-white mt-1 leading-none">{stats.youtube}</span>
                      </div>
                    </div>

                    {/* Instagram Followers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 px-1 py-1 sm:py-0">
                      <img src={instagramIcon} alt="Instagram" className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] sm:text-[9.5px] text-zinc-400 font-semibold leading-none truncate">Instagram</span>
                        <span className="text-[12px] sm:text-[13.5px] font-bold text-white mt-1 leading-none">{stats.instagram}</span>
                      </div>
                    </div>

                    {/* Twitter Followers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 px-1 py-1 sm:py-0">
                      <img src={xIcon} alt="Twitter" className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] sm:text-[9.5px] text-zinc-400 font-semibold leading-none truncate">X / Twitter</span>
                        <span className="text-[12px] sm:text-[13.5px] font-bold text-white mt-1 leading-none">{stats.twitter}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Links Button */}
                <div className="relative mt-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                    className="flex items-center gap-1.5 text-[#D6A125] hover:text-[#f3c250] text-[12px] sm:text-[12.5px] font-bold transition duration-200 w-fit select-none"
                  >
                    <span>View all Links</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                  {openSnackbarId === car._id && renderLinksSnackbar(car)}
                </div>
              </div>

              {/* Vote Panel */}
              <div className="w-full md:w-[150px] lg:w-[170px] xl:w-[190px] shrink-0 flex flex-col items-center justify-center p-4 sm:p-4.5 md:p-5 bg-black/85 border-t md:border-t-0 md:border-l border-zinc-850 gap-3 sm:gap-3.5 select-none">
                <button
                  onClick={(e) => handleVoteClick(e, car)}
                  disabled={isVoting || isLimitReached}
                  title={isLimitReached ? "Daily limit of 3 votes reached for today" : "Click to cast a vote"}
                  className={`h-[40px] md:h-[42px] w-full max-w-[260px] md:max-w-none rounded-[10px] border text-[15px] md:text-[16px] font-bold transition duration-200 select-none ${
                    isVoting || isLimitReached
                      ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                      : "border-[#D6A125] bg-[#D6A125]/10 text-[#D6A125] hover:bg-[#D6A125]/20 cursor-pointer shadow-sm active:scale-95"
                  }`}
                >
                  {isLimitReached ? "Limit Reached" : "Vote"}
                </button>

                <div className="text-center flex flex-col items-center justify-center py-0.5">
                  <div className="text-[26px] md:text-[30px] tracking-tight font-extrabold text-white leading-none">
                    {car.votes || "0"}
                  </div>
                  <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                    {car.rawVotes ? car.rawVotes.toLocaleString() : car.votes || "0"}
                  </div>
                </div>

                <div className="w-full max-w-[260px] md:max-w-none">
                  <div className="w-full bg-[#D6A125] h-[2.5px] rounded-full mb-2 sm:mb-2.5" />
                  <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3 bg-zinc-900/90 border border-zinc-800 rounded">
                    {car.statusIcon === "trophy" || car.rank === 1 ? (
                      <FaTrophy className="text-[#D6A125] text-[11px]" />
                    ) : (
                      <FaStar className="text-[#D6A125] text-[11px]" />
                    )}
                    <span className="text-[11px] font-bold text-[#D6A125]">
                      {car.status || (car.rank === 1 ? "Leading" : "Strong Contender")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ----------------------------------------------------
        // 3. CARS / AUTOMOTIVE NOMINEE CARD (DEFAULT)
        // ----------------------------------------------------
        const displayPower = car.power || car.keyDetails?.power || "1,184 HP";
        const displayAcceleration = car.acceleration || car.keyDetails?.acceleration || car.keyDetails?.transmission || "2.0 Sec";
        const displayTopSpeed = car.topSpeed || car.keyDetails?.topSpeed || "350 Km/h";
        const displayEngine = car.engine || car.keyDetails?.engine || "V6 Hybrid";
        const displayBrand = car.brand || car.keyDetails?.brand || (car.name ? car.name.split(" ")[0] : "Ferrari");
        const displayModel = car.model || car.keyDetails?.model || (car.name ? car.name.split(" ").slice(1).join(" ") : "F80 Coupe");
        const displayYear = car.year || car.keyDetails?.year || "2026";
        const displayLimit = car.productionLimit || car.productionUnits || car.keyDetails?.productionLimit || car.keyDetails?.productionUnits || "799 Units";
        const countryInfo = getCountryFlagInfo(car.country || car.origin || car.keyDetails?.country, displayBrand);

        return (
          <div
            key={car._id || car.id || car.name}
            id={car._id || car.id}
            className="w-full rounded-xl sm:rounded-2xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700/80 transition-all duration-300 flex flex-col md:flex-row overflow-hidden shadow-lg group"
          >
            {/* Image Container */}
            <div className="relative shrink-0 w-full md:w-[280px] lg:w-[340px] xl:w-[400px] 2xl:w-[440px] h-[190px] sm:h-[220px] md:h-auto min-h-[190px] md:min-h-[220px] bg-zinc-950 overflow-hidden">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Rank Ribbon */}
              <div className="absolute left-3.5 sm:left-4 top-0 z-10">
                <div
                  className="flex w-[32px] sm:w-[36px] flex-col items-center py-1.5 sm:py-2 text-black rounded-b-[4px] shadow-md"
                  style={{ backgroundColor: car.rankColor }}
                >
                  <FaTrophy
                    className="text-[11px] sm:text-[12px]"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  />
                  <span
                    className="mt-0.5 text-[13px] sm:text-[15px] font-bold leading-none"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  >
                    {car.rank}
                  </span>
                </div>
                <div
                  className="mx-auto h-0 w-0 border-l-[16px] sm:border-l-[18px] border-r-[16px] sm:border-r-[18px] border-t-[7px] sm:border-t-[8px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: car.rankColor }}
                />
              </div>

              {/* Bottom Image Tag */}
              {car.showBadgeOnImage && car.badge && (
                <div className="absolute bottom-3 left-3.5 sm:left-4 z-10">
                  <span className="rounded-[4px] bg-black/85 px-2.5 py-1 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800 backdrop-blur-xs">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0 flex flex-col justify-between p-3.5 sm:p-4 md:p-4.5 lg:p-5 bg-black/60">
              <div className="min-w-0">
                {/* Header (Title & Subtitle) */}
                <div>
                  <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold tracking-tight text-white leading-tight truncate">
                    {car.name}
                  </h2>
                  <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-zinc-400 font-normal line-clamp-1">
                    {car.detail || car.description}
                  </p>
                </div>

                {/* 4 Performance Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 py-1.5 my-2 w-full border-y border-zinc-850/80">
                  {/* Power */}
                  <div className="flex items-center gap-2">
                    <FaBolt className="text-[#D6A125] text-[17px] sm:text-[19px] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.5px] sm:text-[12.5px] font-bold text-white leading-none truncate">
                        {displayPower}
                      </span>
                      <span className="text-[8.5px] sm:text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">
                        Power
                      </span>
                    </div>
                  </div>

                  {/* 0-60 MPH / Acceleration */}
                  <div className="flex items-center gap-2">
                    <LuTimerReset className="text-zinc-300 text-[17px] sm:text-[19px] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.5px] sm:text-[12.5px] font-bold text-white leading-none truncate">
                        {displayAcceleration}
                      </span>
                      <span className="text-[8.5px] sm:text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">
                        0-60 MPH
                      </span>
                    </div>
                  </div>

                  {/* Top Speed */}
                  <div className="flex items-center gap-2">
                    <MdOutlineSpeed className="text-zinc-300 text-[17px] sm:text-[19px] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.5px] sm:text-[12.5px] font-bold text-white leading-none truncate">
                        {displayTopSpeed}
                      </span>
                      <span className="text-[8.5px] sm:text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">
                        Top Speed
                      </span>
                    </div>
                  </div>

                  {/* Engine */}
                  <div className="flex items-center gap-2">
                    <TbEngine className="text-zinc-300 text-[17px] sm:text-[19px] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.5px] sm:text-[12.5px] font-bold text-white leading-none truncate">
                        {displayEngine}
                      </span>
                      <span className="text-[8.5px] sm:text-[9px] text-zinc-500 font-medium mt-0.5 leading-none">
                        Engine
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta Information Row */}
                <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-zinc-400 font-normal">
                  <span>
                    Brand : <span className="text-zinc-200 font-semibold">{displayBrand}</span>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    Model : <span className="text-zinc-200 font-semibold">{displayModel}</span>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    Year : <span className="text-zinc-200 font-semibold">{displayYear}</span>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    Production Limit : <span className="text-zinc-200 font-semibold">{displayLimit}</span>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    Origin :{" "}
                    <span className="inline-flex items-center gap-1.5 text-zinc-200 font-semibold align-middle">
                      <img
                        src={countryInfo.flagUrl}
                        srcSet={`${countryInfo.flagUrl2x} 2x`}
                        alt={countryInfo.name}
                        className="w-3.5 h-auto rounded-[2px] object-contain shadow-xs inline-block"
                      />
                      <span>{countryInfo.name}</span>
                    </span>
                  </span>
                </div>
              </div>

              {/* View all Links Button */}
              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                  className="flex items-center gap-1.5 text-[#D6A125] hover:text-[#f3c250] text-[11.5px] sm:text-[12px] font-bold transition duration-200 w-fit select-none"
                >
                  <span>View all Links</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
                {openSnackbarId === car._id && renderLinksSnackbar(car)}
              </div>
            </div>

            {/* Vote Panel */}
            <div className="w-full md:w-[150px] lg:w-[170px] xl:w-[190px] shrink-0 flex flex-col items-center justify-center p-3.5 sm:p-4 md:p-4.5 bg-black/85 border-t md:border-t-0 md:border-l border-zinc-850 gap-2.5 sm:gap-3.5 select-none">
              <button
                onClick={(e) => handleVoteClick(e, car)}
                disabled={isVoting || isLimitReached}
                title={isLimitReached ? "Daily limit of 3 votes reached for today" : "Click to cast a vote"}
                className={`h-[38px] md:h-[42px] w-full max-w-[260px] md:max-w-none rounded-[10px] border text-[15px] md:text-[16px] font-bold transition duration-200 select-none ${
                  isVoting || isLimitReached
                    ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                    : "border-[#D6A125] bg-[#D6A125]/10 text-[#D6A125] hover:bg-[#D6A125]/20 cursor-pointer shadow-sm active:scale-95"
                }`}
              >
                {isLimitReached ? "Limit Reached" : "Vote"}
              </button>

              <div className="text-center flex flex-col items-center justify-center py-0.5">
                <div className="text-[26px] md:text-[30px] tracking-tight font-extrabold text-white leading-none">
                  {car.votes || "0"}
                </div>
                <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                  {car.rawVotes ? car.rawVotes.toLocaleString() : car.votes || "0"}
                </div>
              </div>

              <div className="w-full max-w-[260px] md:max-w-none">
                <div className="w-full bg-[#D6A125] h-[2.5px] rounded-full mb-2 sm:mb-2.5" />
                <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3 bg-zinc-900/90 border border-zinc-800 rounded">
                  {car.statusIcon === "trophy" || car.rank === 1 ? (
                    <FaTrophy className="text-[#D6A125] text-[11px]" />
                  ) : (
                    <FaStar className="text-[#D6A125] text-[11px]" />
                  )}
                  <span className="text-[11px] font-bold text-[#D6A125]">
                    {car.status || (car.rank === 1 ? "Leading" : "Strong Contender")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* FLOATING BOTTOM GOLDEN SNACKBAR / TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col overflow-hidden rounded-xl border border-[#D6A125]/80 bg-zinc-950/95 text-white shadow-[0_10px_35px_rgba(214,161,37,0.35)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in max-w-[95vw] sm:max-w-xl w-auto min-w-[320px] select-none">
          <div className="flex items-center gap-3.5 px-5 py-3.5">
            <div className="w-9 h-9 rounded-full bg-[#D6A125]/20 border border-[#D6A125]/50 flex items-center justify-center shrink-0">
              <FaTrophy className="text-[#D6A125] text-base animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0 pr-2 flex-1">
              <span className="text-[13.5px] font-bold text-white leading-snug flex items-center gap-1.5">
                <span>{toast.limitReached ? "Daily Limit Reached ⚠️" : "Vote Registered!"}</span>
                {!toast.limitReached && <span className="text-[#D6A125] text-xs">✨</span>}
              </span>
              <span className="text-[11.5px] text-zinc-300 font-medium leading-relaxed mt-0.5 whitespace-normal sm:whitespace-nowrap">
                {toast.limitReached ? (
                  <span>You have <span className="text-[#D6A125] font-bold">0 votes</span> left today. Try again tomorrow!</span>
                ) : (
                  <span>
                    Thank you for voting for <span className="text-white font-semibold">{toast.nomineeName}</span>. You have <span className="text-[#D6A125] font-bold">{toast.votesLeft} {toast.votesLeft === 1 ? 'vote' : 'votes'} left</span> today.
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="text-zinc-400 hover:text-white text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition shrink-0 ml-2"
            >
              ✕
            </button>
          </div>

          {/* Animated 4.5s Golden Progress Bar */}
          <div className="w-full bg-zinc-800/60 h-[3px]">
            <div
              className="bg-[#D6A125] h-full"
              style={{
                width: "100%",
                animation: "toastProgress 4.5s linear forwards",
              }}
            />
          </div>
          <style>{`
            @keyframes toastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default RankingCard;

