import React, { useState } from "react";
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

function RankingCard({ cars, onVote, isVoting }) {
  const [openSnackbarId, setOpenSnackbarId] = useState(null);

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

  return (
    <div className="space-y-4">
      {cars.map((car) => {
        if (car.isEstate) {
          const formatLocation = (loc) => {
            if (!loc) return "";
            const parts = loc.split(",").map(p => p.trim());
            if (parts.length === 3) {
              return `${parts[1]} , ${parts[2]}, ${parts[0]}`;
            }
            return loc;
          };

          const displayLocation = formatLocation(car.location);
          const displayPrice = car.price ? car.price.replace("$", "$ ") : "";

          return (
            <div
              key={car._id}
              id={car._id}
              className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-[1592px] mx-auto h-auto md:h-[300px]"
            >
              {/* IMAGES */}
              <div className="relative shrink-0 w-full md:w-[340px] lg:w-[440px] xl:w-[530px] h-[200px] md:h-[300px] bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />

                {/* Rank Ribbon */}
                <div className="absolute left-4 top-0">
                  <div
                    className="flex w-[36px] flex-col items-center py-2 text-black rounded-b-[4px]"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[12px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-0.5 text-[15px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>

                {/* Bottom Image Tag */}
                {car.showBadgeOnImage && car.badge && (
                  <div className="absolute bottom-3 left-4">
                    <span className="rounded-[4px] bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800">
                      {car.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT BOX */}
              <div className="flex flex-col md:flex-row flex-1 min-w-0 h-auto md:h-[300px] rounded-[12px] border border-zinc-800 bg-black text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] min-w-0 flex-col px-4 sm:px-5 lg:px-6 py-4 md:py-5 bg-black justify-between h-auto md:h-[300px]">
                    <div className="min-w-0">
                      {/* Header */}
                      <div className="min-w-0">
                        <h2 className="text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-bold tracking-tight text-white leading-tight truncate">
                          {car.name === "Beverly Hills Ultra Estate" ? "Beverly Hills Ultra Luxury" : car.name}
                        </h2>
                        <div className="text-[12px] sm:text-[13px] text-zinc-500 font-normal mt-0.5 truncate">
                          {displayLocation}
                        </div>
                      </div>

                      {/* Price */}
                      {displayPrice && (
                        <div className="mt-1.5 sm:mt-2 text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-white leading-none">
                          {displayPrice}
                        </div>
                      )}

                      {/* Description */}
                      <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] leading-relaxed text-zinc-400 font-normal line-clamp-2">
                        {car.description}
                      </p>
                    </div>

                    <div className="min-w-0">
                      {/* Combined Stats and Meta Block */}
                      <div className="border border-zinc-800/80 rounded-[8px] bg-zinc-950/80 px-3 sm:px-3.5 py-2 mt-2 w-fit max-w-full overflow-x-auto no-scrollbar">
                        {/* Estate Metrics Counters */}
                        <div className="flex items-center gap-2 sm:gap-3 py-0.5 min-w-max">
                          {/* Living Area */}
                          {car.livingArea && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">{car.livingArea}</span>
                                <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">Living Area</span>
                              </div>
                            </div>
                          )}

                          {car.livingArea && car.landSize && <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />}

                          {/* Land Size */}
                          {car.landSize && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.62 0-4.75 2.13-4.75 4.75 0 .97.3 1.88.8 2.64L6.5 12h3.5v6H14v-6h3.5l-1.55-2.61c.5-.76.8-1.67.8-2.64 0-2.62-2.13-4.75-4.75-4.75z" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">{car.landSize}</span>
                                <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">Land Size</span>
                              </div>
                            </div>
                          )}

                          {car.landSize && car.bedrooms && <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />}

                          {/* Bedrooms */}
                          {car.bedrooms && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M2.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12M2.25 12V6.75A2.25 2.25 0 004.5 4.5h5.625c.621 0 1.125.504 1.125 1.125V12M21.75 12V6.75A2.25 2.25 0 0019.5 4.5h-5.625c-.621 0-1.125.504-1.125 1.125V12m0 0h1.5m-1.5 0h-1.5" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">{car.bedrooms}</span>
                                <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">Bedrooms</span>
                              </div>
                            </div>
                          )}

                          {car.bedrooms && car.bathrooms && <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />}

                          {/* Bathrooms */}
                          {car.bathrooms && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V10M3 10H21M7 5H17M12 5V10" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">{car.bathrooms}</span>
                                <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">Bathrooms</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-800/80 my-1.5" />

                        {/* Meta information */}
                        <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-0.5 text-[10px] sm:text-[10.5px] text-zinc-400 font-medium">
                          <span>
                            Category: <span className="text-zinc-300 font-semibold">{car.category}</span>
                          </span>
                          <span>|</span>
                          <span>
                            Property Type: <span className="text-zinc-300 font-semibold">{car.propertyType}</span>
                          </span>
                          <span>|</span>
                          <span className="inline-flex items-center gap-1">
                            Status: <span className="text-zinc-300 font-semibold">{car.availabilityStatus}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block ml-0.5" />
                          </span>
                        </div>
                      </div>

                      {/* View all Links Button */}
                      <div className="relative mt-2.5 sm:mt-3">
                        <button
                          type="button"
                          onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                          className="flex items-center gap-2 text-[#D6A125] hover:text-[#e5b338] text-[12.5px] sm:text-[13.5px] font-bold transition duration-200 w-fit select-none"
                        >
                          <span>View all Links</span>
                          <FaArrowRight className="text-[12px] sm:text-[13.5px]" />
                        </button>
                        {openSnackbarId === car._id && renderLinksSnackbar(car)}
                      </div>
                    </div>
                  </div>

                {/* VERTICAL DIVIDER LINE */}
                <div className="hidden md:block w-[1px] h-[240px] bg-zinc-800 my-auto shrink-0" />

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[190px] lg:w-[220px] xl:w-[240px] shrink-0 h-auto md:h-[300px] flex-col items-center justify-between border-t md:border-t-0 border-zinc-800 md:border-none px-4 lg:px-6 py-4 md:py-5 bg-transparent select-none">
                  {/* Top Rated Badge */}
                  {car.showTopRatedBadge ? (
                    <div className="flex flex-col items-center justify-center shrink-0 mb-1 select-none">
                      <div className="relative flex items-center justify-center w-[48px] lg:w-[52px] h-[54px] lg:h-[60px]">
                        <svg className="absolute inset-0 w-full h-full text-[#D6A125]" viewBox="0 0 24 28" fill="rgba(214,161,37,0.05)">
                          <path d="M12 2C6.5 2 2 4.5 2 4.5V14c0 7.5 10 12 10 12s10-4.5 10-12V4.5S17.5 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="z-10 flex flex-col items-center justify-center text-[#D6A125] font-bold leading-none text-center">
                          <span className="text-[8px] lg:text-[8.5px] uppercase tracking-wider font-extrabold">Top</span>
                          <span className="text-[8px] lg:text-[8.5px] uppercase tracking-wider font-extrabold mt-0.5">Rated</span>
                          <svg className="w-2.5 h-2.5 mt-1 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[54px] lg:h-[60px]" />
                  )}

                  <button
                    onClick={() => onVote && onVote(car._id, car.categoryId)}
                    disabled={isVoting}
                    className={`h-[40px] lg:h-[42px] w-full rounded-[8px] border border-[#D6A125] bg-transparent text-[14px] lg:text-[15px] font-bold text-white transition hover:bg-[#D6A125]/10 select-none ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Vote
                  </button>

                  <div className="text-center my-2 flex-1 flex flex-col justify-center">
                    <div className="text-[28px] lg:text-[32px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes}
                    </div>
                    <div className="text-[11px] lg:text-[12px] text-zinc-400 font-medium mt-1 leading-none">
                      Votes
                    </div>
                  </div>

                  <div className="w-full">
                    {/* Gold Progress bar */}
                    <div className="w-full bg-zinc-800 h-[3px] rounded-full overflow-hidden">
                      <div
                        className="bg-[#D6A125] h-full rounded-full transition-all duration-500"
                        style={{ width: car.progress }}
                      />
                    </div>

                    <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-transparent rounded mt-3">
                      {car.statusIcon === "trophy" ? (
                        <FaTrophy className="text-[#D6A125] text-[12px] lg:text-[13px]" />
                      ) : (
                        <FaStar className="text-zinc-400 text-[12px] lg:text-[13px]" />
                      )}
                      <span
                        className="text-[12px] lg:text-[13px] font-bold uppercase tracking-wider text-[#D6A125]"
                        style={{ color: car.rank === 1 ? "#D6A125" : "#A1A1AA" }}
                      >
                        {car.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        if (car.isContentCreator) {
          const stats = getCreatorStats(car);
          const profilePicUrl = getCreatorProfilePic(car);
          const bannerImageUrl = car.banner || car.bannerImage || car.coverImage || car.image;

          return (
            <div
              key={car._id}
              id={car._id}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full max-w-full xl:max-w-[1570px] h-auto md:h-[310px]"
            >
              {/* IMAGES (Appears on the left) */}
              <div className="relative shrink-0 w-full md:w-[320px] lg:w-[430px] h-[220px] md:h-[310px] my-auto bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                <img
                  src={bannerImageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />

                {/* Rank Ribbon */}
                <div className="absolute left-4 top-0">
                  <div
                    className="flex w-[36px] flex-col items-center py-2 text-black rounded-b-[4px]"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[12px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-0.5 text-[15px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>
              </div>

              {/* CONTENT BOX (Appears on the right) */}
              <div className="flex flex-col md:flex-row flex-1 w-full max-w-full rounded-[12px] border border-zinc-800 bg-black text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-auto md:h-[310px]">
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] w-full md:w-[75%] lg:w-[80%] flex-col px-4 sm:px-6 py-4 bg-black justify-between h-auto md:h-[310px]">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-[68px] h-[66px] sm:w-[82px] sm:h-[79px] rounded-full border border-zinc-800 bg-[#141416] flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0 select-none overflow-hidden relative">
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
                        className="w-full h-full rounded-full items-center justify-center text-white font-bold text-base sm:text-lg select-none"
                        style={{ display: profilePicUrl ? 'none' : 'flex' }}
                      >
                        {getInitials(car.name)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center h-[66px] sm:h-[79px]">
                      <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-extrabold tracking-tight text-white leading-none">
                        {car.name}
                      </h2>
                      <div className="text-[13px] sm:text-[15px] lg:text-[16px] text-zinc-400 font-medium mt-1 sm:mt-2 leading-none">
                        Channel : <span className="text-zinc-300">{car.channelName || car.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta/Tags */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-[12px] sm:text-[13.5px]">
                    {car.location && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FiMapPin className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.location}
                      </span>
                    )}
                    {car.joinDate && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FaCalendarAlt className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.joinDate}
                      </span>
                    )}
                    {car.genre && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FaTag className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.genre}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-[12.5px] sm:text-[13.5px] leading-relaxed text-zinc-400 font-normal line-clamp-2 sm:line-clamp-3">
                    {car.description}
                  </p>

                  {/* Divider */}
                  <div className="my-2 border-t border-zinc-800/80" />

                  {/* Social Counters Bar Container */}
                  <div className="bg-[#121214] border border-zinc-800/80 rounded-[6px] py-2 sm:py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-y-2 sm:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 items-center">
                    {/* Total Subscribers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0">
                      <FaUsers className="text-[#D6A125] text-[18px] sm:text-[24px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">Total Subscribers</span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">{stats.total}</span>
                      </div>
                    </div>

                    {/* YouTube Subscribers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0">
                      <img src={youtubeIcon} alt="YouTube" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">YouTube Subscribers</span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">{stats.youtube}</span>
                      </div>
                    </div>

                    {/* Instagram Followers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0">
                      <img src={instagramIcon} alt="Instagram" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">Instagram Followers</span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">{stats.instagram}</span>
                      </div>
                    </div>

                    {/* Twitter Followers */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0">
                      <img src={xIcon} alt="Twitter" className="w-4.5 h-4.5 sm:w-[22px] sm:h-[22px] object-contain shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">Twitter Followers</span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">{stats.twitter}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Links Button */}
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                      className="flex items-center gap-2 text-[#D6A125] hover:text-[#e5b338] text-[12.5px] sm:text-[13.5px] font-bold transition duration-200 w-fit select-none"
                    >
                      <span>View all Links</span>
                      <FaArrowRight className="text-[12px] sm:text-[13px]" />
                    </button>
                    {openSnackbarId === car._id && renderLinksSnackbar(car)}
                  </div>
                </div>

                {/* VERTICAL DIVIDER LINE */}
                <div className="hidden md:block w-[1px] h-[250px] bg-zinc-800/80 my-auto shrink-0" />

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[25%] lg:w-[20%] shrink-0 h-auto md:h-[310px] flex-col items-center justify-center gap-2.5 border-t md:border-t-0 px-4 sm:px-6 py-4 bg-black select-none">
                  <button
                    onClick={() => onVote && onVote(car._id, car.categoryId)}
                    disabled={isVoting}
                    className={`h-[40px] sm:h-[44px] w-[130px] sm:w-[140px] rounded-[8px] border border-[#D6A125] bg-transparent text-[16px] sm:text-[18px] font-bold text-white transition hover:bg-[#D6A125]/10 ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Vote
                  </button>

                  <div className="text-center flex flex-col justify-center items-center py-1">
                    <div className="text-[30px] sm:text-[36px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-zinc-500 font-normal mt-1.5 leading-none">
                      {car.rawVotes ? car.rawVotes.toLocaleString() : "0"}
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center">
                    {/* Gold separator line */}
                    <div className="w-[120px] sm:w-[140px] bg-[#D6A125] h-[3px] rounded-full mb-3" />

                    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3.5 sm:px-4 bg-[#141416] border border-zinc-800/80 rounded-[6px]">
                      {car.statusIcon === "trophy" ? (
                        <FaTrophy className="text-[#D6A125] text-[12px]" />
                      ) : (
                        <FaStar className="text-zinc-400 text-[12px]" />
                      )}
                      <span
                        className="text-[12px] sm:text-[13px] font-bold"
                        style={{ color: car.rank === 1 ? "#D6A125" : "#A1A1AA" }}
                      >
                        {car.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // REDESIGNED AUTOMOTIVE/CARS NOMINEE CARD
        const displayCarPrice = car.price ? car.price.replace("$", "$ ") : "";
        const displayAcceleration = car.acceleration || car.transmission || "";
        const accelerationLabel = (car.acceleration && car.acceleration.toLowerCase().includes("s")) ? "0-100 km/h" : "Transmission";

        return (
          <div
            key={car._id}
            id={car._id}
            className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-[1577px] h-auto md:h-[210px] mx-auto"
          >
            {/* IMAGES */}
            <div className="relative shrink-0 w-full md:w-[320px] lg:w-[380px] xl:w-[437px] h-[180px] md:h-[210px] bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />

              {/* Rank Ribbon */}
              <div className="absolute left-4 top-0">
                <div
                  className="flex w-[36px] flex-col items-center py-2 text-black rounded-b-[4px]"
                  style={{ backgroundColor: car.rankColor }}
                >
                  <FaTrophy
                    className="text-[12px]"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  />
                  <span
                    className="mt-0.5 text-[15px] font-bold leading-none"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  >
                    {car.rank}
                  </span>
                </div>
                <div
                  className="mx-auto h-0 w-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: car.rankColor }}
                />
              </div>

              {/* Bottom Image Tag */}
              {car.showBadgeOnImage && car.badge && (
                <div className="absolute bottom-3 left-4">
                  <span className="rounded-[4px] bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>
            {/* CONTENT BOX */}
            <div className="flex flex-col md:flex-row flex-1 h-auto md:h-[210px] rounded-[12px] border border-zinc-800 bg-black text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              {/* CONTENT (80% width ratio) */}
              <div className="flex flex-col flex-[4] w-full md:w-[80%] px-3.5 sm:px-4 md:px-5 py-2.5 md:py-3 bg-black justify-between min-h-0 md:h-[210px]">
                <div>
                  {/* Header */}
                  <div>
                    <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold tracking-tight text-white leading-tight">
                      {car.name}
                    </h2>
                    <p className="mt-1 text-[11px] sm:text-[11.5px] md:text-[12.5px] leading-snug text-zinc-400 font-normal line-clamp-2 md:line-clamp-3">
                      {car.description}
                    </p>
                  </div>

                  {/* Metrics Counters Row */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 py-1 mt-1.5 md:mt-2 mb-1 md:mb-1.5 overflow-x-auto no-scrollbar">
                    {/* Power */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <FaBolt className="text-[#EAB308] text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.power || "1,800 HP"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Power
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Acceleration / 0-60 MPH */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <LuTimerReset className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.acceleration || "2.0 Sec"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          0-60 MPH
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Top Speed */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <MdOutlineSpeed className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.topSpeed || "445 Kmph"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Top Speed
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Engine */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <TbEngine className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.engine || "8.3 L W16"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Engine
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="border-t border-zinc-800/80 w-full my-1 md:my-1.5" />

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 md:gap-x-3 gap-y-1 text-[10px] sm:text-[10.5px] md:text-[11px] text-zinc-500 font-normal">
                    <span>
                      Brand : <span className="text-white font-semibold">{car.brand || car.location || "Bugatti"}</span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span>
                      Model : <span className="text-white font-semibold">{car.model || car.bodyType || "Tourbillon"}</span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span>
                      Year : <span className="text-white font-semibold">{car.year || "2026"}</span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span>
                      Production Limit : <span className="text-white font-semibold">{car.productionUnits || car.productionLimit || car.limit || "250"}</span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span>
                      Origin :{" "}
                      <span className="inline-flex items-center gap-1.5 text-white font-semibold align-middle">
                        <img
                          src={getCountryFlagInfo(car.country || car.origin, car.brand).flagUrl}
                          srcSet={`${getCountryFlagInfo(car.country || car.origin, car.brand).flagUrl2x} 2x`}
                          alt={getCountryFlagInfo(car.country || car.origin, car.brand).name}
                          className="w-4 h-auto rounded-[2px] object-contain shadow-xs inline-block"
                        />
                        <span>
                          {getCountryFlagInfo(car.country || car.origin, car.brand).name}
                        </span>
                      </span>
                    </span>
                  </div>

                  {/* View all Links Button */}
                  <div className="relative mt-1 md:mt-1.5">
                    <button
                      type="button"
                      onClick={() => setOpenSnackbarId(openSnackbarId === car._id ? null : car._id)}
                      className="flex items-center gap-1.5 text-[#D6A125] hover:text-[#e5b338] text-[11px] md:text-[12px] font-bold transition duration-200 w-fit"
                    >
                      <span>View all Links</span>
                      <FaArrowRight className="text-[10px]" />
                    </button>
                    {openSnackbarId === car._id && renderLinksSnackbar(car)}
                  </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER LINE */}
              <div className="hidden md:block w-[1px] h-[160px] bg-[#545454] my-auto shrink-0" />

              {/* VOTE PANEL (20% width ratio) */}
              <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-auto md:h-[210px] flex-col items-center justify-between border-t md:border-t-0 border-zinc-800 md:border-none px-4 sm:px-6 py-4 md:py-3.5 bg-black select-none">
                <button
                  onClick={() => onVote && onVote(car._id, car.categoryId)}
                  disabled={isVoting}
                  className={`h-[40px] md:h-[44px] w-full max-w-[280px] md:max-w-none rounded-[10px] border border-[#D6A125] bg-transparent text-[16px] md:text-[18px] font-bold text-[#D6A125] transition duration-200 hover:bg-[#D6A125]/10 select-none ${
                    isVoting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Vote
                </button>

                <div className="text-center my-3 md:my-auto flex flex-col items-center justify-center py-1">
                  <div className="text-[26px] md:text-[32px] tracking-tight font-extrabold text-white leading-none">
                    {car.votes || "0"}
                  </div>
                  <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                    {car.rawVotes ? car.rawVotes.toLocaleString() : car.votes || "0"}
                  </div>
                </div>

                <div className="w-full max-w-[280px] md:max-w-none">
                  {/* Gold solid line */}
                  <div className="w-full bg-[#D6A125] h-[3px] rounded-full mb-2.5 md:mb-3" />

                  <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3.5 bg-zinc-950/80 border border-zinc-800 rounded">
                    {car.statusIcon === "trophy" || car.rank === 1 ? (
                      <FaTrophy className="text-[#D6A125] text-[11px] md:text-[12px]" />
                    ) : (
                      <FaStar className="text-[#D6A125] text-[11px] md:text-[12px]" />
                    )}
                    <span className="text-[11px] md:text-[12px] font-bold text-[#D6A125]">
                      {car.status || (car.rank === 1 ? "Leading" : "Strong Contender")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RankingCard;
