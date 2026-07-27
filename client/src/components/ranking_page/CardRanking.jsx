import React from "react";
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
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import youtubeIcon from "../../assets/icons/social/youtube.svg";
import instagramIcon from "../../assets/icons/social/instagram.svg";
import xIcon from "../../assets/icons/social/x.svg";
import estateIcon from "../../assets/icons/estate_icon.png";

function RankingCard({ cars, onVote, isVoting }) {
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
              className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-full md:w-[1577px] h-auto md:h-[210px]"
            >
              {/* IMAGES */}
              <div className="relative shrink-0 w-full md:w-[437px] h-[180px] md:h-[210px] bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
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
              <div className="flex flex-col md:flex-row flex-1 h-[210px] rounded-[12px] border border-zinc-800 bg-black text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] md:w-[80%] flex-col px-5 py-2.5 bg-black justify-between h-[210px]">
                    <div>
                      {/* Header */}
                      <div>
                        <h2 className="text-[19px] font-bold tracking-tight text-white leading-tight">
                          {car.name === "Beverly Hills Ultra Estate" ? "Beverly Hills Ultra Luxury" : car.name}
                        </h2>
                        <div className="text-[12px] text-zinc-500 font-medium mt-0.5">
                          {displayLocation}
                        </div>
                      </div>

                      {/* Price */}
                      {displayPrice && (
                        <div className="mt-0.5 text-[18px] font-bold text-white leading-none">
                          {displayPrice}
                        </div>
                      )}

                      {/* Description */}
                      <p className="mt-1 text-[11.5px] leading-snug text-zinc-500 font-normal line-clamp-2">
                        {car.description}
                      </p>
                    </div>

                    <div>
                      {/* Combined Stats and Meta Block */}
                      <div className="border border-zinc-800 rounded-[8px] bg-zinc-950/20 px-3.5 py-1.5 mt-1.5">
                        {/* Estate Metrics Counters */}
                        <div className="flex items-center justify-between py-0.5">
                          {/* Living Area */}
                          {car.livingArea && (
                            <div className="flex items-center gap-2.5 flex-1 justify-start">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white leading-none">{car.livingArea}</span>
                                <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Living Area</span>
                              </div>
                            </div>
                          )}

                          {car.livingArea && car.landSize && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                          {/* Land Size */}
                          {car.landSize && (
                            <div className="flex items-center gap-2.5 flex-1 justify-start">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.62 0-4.75 2.13-4.75 4.75 0 .97.3 1.88.8 2.64L6.5 12h3.5v6H14v-6h3.5l-1.55-2.61c.5-.76.8-1.67.8-2.64 0-2.62-2.13-4.75-4.75-4.75z" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white leading-none">{car.landSize}</span>
                                <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Land Size</span>
                              </div>
                            </div>
                          )}

                          {car.landSize && car.bedrooms && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                          {/* Bedrooms */}
                          {car.bedrooms && (
                            <div className="flex items-center gap-2.5 flex-1 justify-start">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M2.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12M2.25 12V6.75A2.25 2.25 0 004.5 4.5h5.625c.621 0 1.125.504 1.125 1.125V12M21.75 12V6.75A2.25 2.25 0 0019.5 4.5h-5.625c-.621 0-1.125.504-1.125 1.125V12m0 0h1.5m-1.5 0h-1.5" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white leading-none">{car.bedrooms}</span>
                                <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Bedrooms</span>
                              </div>
                            </div>
                          )}

                          {car.bedrooms && car.bathrooms && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                          {/* Bathrooms */}
                          {car.bathrooms && (
                            <div className="flex items-center gap-2.5 flex-1 justify-start">
                              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V10M3 10H21M7 5H17M12 5V10" />
                              </svg>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white leading-none">{car.bathrooms}</span>
                                <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Bathrooms</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-800 my-1" />

                        {/* Meta information */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-zinc-500 font-medium">
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
                      <a
                        href={car.listingLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 flex items-center justify-between border border-[#D6A125] bg-transparent hover:bg-[#D6A125]/5 text-[#D6A125] text-[11.5px] font-bold px-3.5 py-1 rounded-[4px] transition duration-200 w-full"
                      >
                        <span>View all Links</span>
                        <FaArrowRight className="text-[10px]" />
                      </a>
                    </div>
                  </div>

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-[210px] flex-col items-center justify-between border-t md:border-t-0 md:border-l border-zinc-850 px-6 py-3 bg-transparent">
                  {/* Top Rated Badge */}
                  {car.showTopRatedBadge ? (
                    <div className="flex flex-col items-center justify-center shrink-0 mb-4 select-none">
                      <div className="relative flex items-center justify-center w-[52px] h-[60px]">
                        <svg className="absolute inset-0 w-full h-full text-[#D6A125]" viewBox="0 0 24 28" fill="rgba(214,161,37,0.05)">
                          <path d="M12 2C6.5 2 2 4.5 2 4.5V14c0 7.5 10 12 10 12s10-4.5 10-12V4.5S17.5 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="z-10 flex flex-col items-center justify-center text-[#D6A125] font-bold leading-none text-center">
                          <span className="text-[8.5px] uppercase tracking-wider font-extrabold">Top</span>
                          <span className="text-[8.5px] uppercase tracking-wider font-extrabold mt-0.5">Rated</span>
                          <svg className="w-2.5 h-2.5 mt-1 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[60px]" />
                  )}

                  <button
                    onClick={() => onVote && onVote(car._id, car.categoryId)}
                    disabled={isVoting}
                    className={`h-[40px] w-full rounded-[6px] border border-[#D6A125] bg-transparent text-[14px] font-bold text-white transition hover:bg-[#D6A125]/10 select-none ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Vote
                  </button>

                  <div className="text-center my-4 flex-1 flex flex-col justify-center">
                    <div className="text-[32px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes}
                    </div>
                    <div className="text-[12px] text-zinc-500 font-medium mt-1.5 leading-none">
                      Votes
                    </div>
                  </div>

                  <div className="w-full">
                    {/* Gold Progress bar */}
                    <div className="w-full bg-zinc-800 h-[4px] rounded-full overflow-hidden">
                      <div
                        className="bg-[#D6A125] h-full rounded-full transition-all duration-500"
                        style={{ width: car.progress }}
                      />
                    </div>

                    <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-transparent rounded mt-4">
                      {car.statusIcon === "trophy" ? (
                        <FaTrophy className="text-[#D6A125] text-[12px]" />
                      ) : (
                        <FaStar className="text-zinc-400 text-[12px]" />
                      )}
                      <span
                        className="text-[12px] font-bold uppercase tracking-wider text-[#D6A125]"
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
          return (
            <div
              key={car._id}
              id={car._id}
              className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-full md:w-[1577px] h-auto md:h-[210px]"
            >
              {/* IMAGES */}
              <div className="relative shrink-0 w-full md:w-[437px] h-[180px] md:h-[210px] bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
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
              </div>

              {/* CONTENT BOX */}
              <div className="flex flex-col md:flex-row flex-1 h-[210px] rounded-[12px] border border-zinc-800 bg-[#09090b] text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] md:w-[80%] flex-col px-5 py-3 bg-[#09090b] justify-between h-[210px]">
                    <div>
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-zinc-700 bg-black flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
                          {getInitials(car.name)}
                        </div>
                        <div>
                          <h2 className="text-[20px] font-bold tracking-tight text-white leading-tight">
                            {car.name}
                          </h2>
                          <div className="text-[12px] text-zinc-400 font-medium mt-0.5">
                            Channel : <span className="text-zinc-300">{car.channelName || car.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta/Tags */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                        {car.location && (
                          <span className="flex items-center gap-1 text-white">
                            <FiMapPin className="text-[#D6A125]" />
                            {car.location}
                          </span>
                        )}
                        {car.joinDate && (
                          <span className="flex items-center gap-1 text-white">
                            <FaCalendarAlt className="text-[#D6A125]" />
                            {car.joinDate}
                          </span>
                        )}
                        {car.genre && (
                          <span className="flex items-center gap-1 text-white">
                            <FaTag className="text-[#D6A125]" />
                            {car.genre}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-2 text-[12.5px] leading-snug text-zinc-400 font-normal line-clamp-2">
                        {car.description}
                      </p>
                    </div>

                    <div>
                      {/* Divider */}
                      <div className="my-2 border-t border-zinc-800" />

                      {/* Social Counters */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 py-0.5">
                        {/* Total Subscribers */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-[#161618] border border-zinc-800 flex items-center justify-center text-[#D6A125] shrink-0">
                            <FaUsers className="text-sm" />
                          </div>
                          <div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">Total Subscribers</div>
                            <div className="text-[13px] font-extrabold text-white mt-0.5 leading-none">{stats.total}</div>
                          </div>
                        </div>

                        {/* YouTube */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-[#161618] border border-zinc-800 flex items-center justify-center shrink-0">
                            <img src={youtubeIcon} alt="YouTube" className="w-4 h-4 object-contain" />
                          </div>
                          <div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">YouTube</div>
                            <div className="text-[13px] font-extrabold text-white mt-0.5 leading-none">{stats.youtube}</div>
                          </div>
                        </div>

                        {/* Instagram */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-[#161618] border border-zinc-800 flex items-center justify-center shrink-0">
                            <img src={instagramIcon} alt="Instagram" className="w-4 h-4 object-contain" />
                          </div>
                          <div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">Instagram</div>
                            <div className="text-[13px] font-extrabold text-white mt-0.5 leading-none">{stats.instagram}</div>
                          </div>
                        </div>

                        {/* Twitter / X */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-[#161618] border border-zinc-800 flex items-center justify-center shrink-0">
                            <img src={xIcon} alt="Twitter" className="w-4 h-4 object-contain" />
                          </div>
                          <div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">Twitter</div>
                            <div className="text-[13px] font-extrabold text-white mt-0.5 leading-none">{stats.twitter}</div>
                          </div>
                        </div>
                      </div>

                      {/* View Links Button */}
                      <a
                        href={car.socialLinks?.[0]?.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center justify-between border border-[#D6A125] bg-transparent hover:bg-[#D6A125]/10 text-[#D6A125] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition duration-200"
                      >
                        <span>View all Links</span>
                        <FaArrowRight className="text-[10px]" />
                      </a>
                    </div>
                  </div>

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-[210px] flex-col items-center justify-between border-t md:border-t-0 md:border-l border-zinc-800 px-6 py-3.5 bg-zinc-950/20">
                  <button
                    onClick={() => onVote && onVote(car._id, car.categoryId)}
                    disabled={isVoting}
                    className={`h-[48px] w-full rounded-[8px] border border-[#D6A125] bg-transparent text-[14px] font-bold text-white transition hover:bg-[#D6A125]/10 ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Vote
                  </button>

                  <div className="text-center my-6 flex-1 flex flex-col justify-center">
                    <div className="text-[32px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes}
                    </div>
                    <div className="text-[12px] text-zinc-500 font-medium mt-1.5 leading-none">
                      {car.rawVotes ? car.rawVotes.toLocaleString() : "0"}
                    </div>
                  </div>

                  <div className="w-full">
                    {/* Gold separator line */}
                    <div className="w-full border-t border-[#D6A125] my-4" />

                    <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-900/60 border border-zinc-800 rounded">
                      {car.statusIcon === "trophy" ? (
                        <FaTrophy className="text-[#D6A125] text-[11px]" />
                      ) : (
                        <FaStar className="text-zinc-400 text-[11px]" />
                      )}
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
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
            className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-full md:w-[1577px] h-auto md:h-[210px]"
          >
            {/* IMAGES */}
            <div className="relative shrink-0 w-full md:w-[437px] h-[180px] md:h-[210px] bg-zinc-950 rounded-[12px] border border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
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
            <div className="flex flex-col md:flex-row flex-1 h-[210px] rounded-[12px] border border-zinc-800 bg-black text-white overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              {/* CONTENT (80% width ratio) */}
              <div className="flex flex-[4] md:w-[80%] flex-col px-5 py-2.5 bg-black justify-between h-[210px]">
                  <div>
                    {/* Header */}
                    <div>
                      <h2 className="text-[19px] font-bold tracking-tight text-white leading-tight">
                        {car.name}
                      </h2>
                      <div className="text-[12px] text-zinc-500 font-medium mt-0.5">
                        {car.location}
                      </div>
                    </div>

                    {/* Price */}
                    {displayCarPrice && (
                      <div className="mt-0.5 text-[18px] font-bold text-white leading-none">
                        {displayCarPrice}
                      </div>
                    )}

                    {/* Description */}
                    <p className="mt-1 text-[11.5px] leading-snug text-zinc-500 font-normal line-clamp-2">
                      {car.description}
                    </p>
                  </div>

                  <div>
                    {/* Combined Stats and Meta Block */}
                    <div className="border border-zinc-800 rounded-[8px] bg-zinc-950/20 px-3.5 py-1.5 mt-1.5">
                      {/* Metrics Counters */}
                      <div className="flex items-center justify-between py-0.5">
                        {/* Engine */}
                        {car.engine && (
                          <div className="flex items-center gap-2.5 flex-1 justify-start">
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-white leading-none">{car.engine}</span>
                              <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Engine</span>
                            </div>
                          </div>
                        )}

                        {car.engine && car.power && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                        {/* Power */}
                        {car.power && (
                          <div className="flex items-center gap-2.5 flex-1 justify-start">
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-white leading-none">{car.power}</span>
                              <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Power</span>
                            </div>
                          </div>
                        )}

                        {car.power && car.topSpeed && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                        {/* Top Speed */}
                        {car.topSpeed && (
                          <div className="flex items-center gap-2.5 flex-1 justify-start">
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-white leading-none">{car.topSpeed}</span>
                              <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">Top Speed</span>
                            </div>
                          </div>
                        )}

                        {car.topSpeed && displayAcceleration && <div className="w-[1px] bg-zinc-800 self-stretch mx-2.5" />}

                        {/* Acceleration */}
                        {displayAcceleration && (
                          <div className="flex items-center gap-2.5 flex-1 justify-start">
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-white leading-none">{displayAcceleration}</span>
                              <span className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-none">{accelerationLabel}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-zinc-800 my-1" />

                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-zinc-500 font-medium">
                        <span>
                          Category: <span className="text-zinc-300 font-semibold">{car.category}</span>
                        </span>
                        <span>|</span>
                        <span>
                          Origin: <span className="text-zinc-300 font-semibold">{car.origin}</span>
                        </span>
                        <span>|</span>
                        <span className="inline-flex items-center gap-1">
                          Body Type: <span className="text-zinc-300 font-semibold">{car.bodyType}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block ml-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* View all Links Button */}
                    <a
                      href={car.listingLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 flex items-center justify-between border border-[#D6A125] bg-transparent hover:bg-[#D6A125]/5 text-[#D6A125] text-[11.5px] font-bold px-3.5 py-1 rounded-[4px] transition duration-200 w-full"
                    >
                      <span>View all Links</span>
                      <FaArrowRight className="text-[10px]" />
                    </a>
                  </div>
                </div>

              {/* VOTE PANEL (20% width ratio) */}
              <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-[210px] flex-col items-center justify-between border-t md:border-t-0 md:border-l border-zinc-850 px-6 py-3 bg-transparent">
                {/* Top Rated Badge */}
                {car.showTopRatedBadge ? (
                  <div className="flex flex-col items-center justify-center shrink-0 select-none">
                    <div className="relative flex items-center justify-center w-[46px] h-[48px]">
                      <svg className="absolute inset-0 w-full h-full text-[#D6A125]" viewBox="0 0 24 28" fill="rgba(214,161,37,0.05)">
                        <path d="M12 2C6.5 2 2 4.5 2 4.5V14c0 7.5 10 12 10 12s10-4.5 10-12V4.5S17.5 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="z-10 flex flex-col items-center justify-center text-[#D6A125] font-bold leading-none text-center">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold">Top</span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold mt-0.5">Rated</span>
                        <svg className="w-2.5 h-2.5 mt-0.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[48px]" />
                )}

                <button
                  onClick={() => onVote && onVote(car._id, car.categoryId)}
                  disabled={isVoting}
                  className={`h-[36px] w-full max-w-[280px] rounded-[6px] border border-[#D6A125] bg-transparent text-[13px] font-bold text-white transition hover:bg-[#D6A125]/10 select-none ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Vote
                </button>

                <div className="text-center my-1 flex-1 flex flex-col justify-center">
                  <div className="text-[26px] tracking-tight font-extrabold text-white leading-none">
                    {car.votes}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                    Votes
                  </div>
                </div>

                <div className="w-full max-w-[280px]">
                  {/* Gold Progress bar */}
                  <div className="w-full bg-zinc-800 h-[3px] rounded-full overflow-hidden">
                    <div
                      className="bg-[#D6A125] h-full rounded-full transition-all duration-500"
                      style={{ width: car.progress }}
                    />
                  </div>

                  <div className="w-full flex items-center justify-center gap-1.5 py-1 px-3 bg-transparent rounded mt-1.5">
                    {car.statusIcon === "trophy" ? (
                      <FaTrophy className="text-[#D6A125] text-[11px]" />
                    ) : (
                      <FaStar className="text-zinc-400 text-[11px]" />
                    )}
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider text-[#D6A125]"
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
      })}
    </div>
  );
}

export default RankingCard;
