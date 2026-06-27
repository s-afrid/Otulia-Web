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
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

function RankingCard({ cars, onVote, isVoting }) {
  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div
          key={car._id}
          className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col md:flex-row min-h-[260px]">
            {/* IMAGE */}
            <div className="relative shrink-0 w-full md:w-[360px] h-[220px] md:h-auto bg-gray-100">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />

              {/* Rank Ribbon */}
              <div className="absolute left-4 top-0">
                <div
                  className="flex w-[40px] flex-col items-center py-2.5 text-black rounded-b-[4px]"
                  style={{ backgroundColor: car.rankColor }}
                >
                  <FaTrophy
                    className="text-[14px]"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  />
                  <span
                    className="mt-1 text-[18px] font-bold leading-none"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  >
                    {car.rank}
                  </span>
                </div>
                <div
                  className="mx-auto h-0 w-0 border-l-[20px] border-r-[20px] border-t-[10px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: car.rankColor }}
                />
              </div>

              {/* Bottom Image Tag */}
              {car.showBadgeOnImage && car.badge && (
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-[4px] bg-black/80 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col px-6 py-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-[28px] font-bold tracking-tight text-[#111827] font-serif">
                      {car.name}
                    </h2>
                    {car.showTagOnHeader && car.tag && (
                      <span className="rounded-[4px] bg-[#4C2D95] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {car.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* Location */}
                  {car.location && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
                      <FiMapPin className="text-[14px] text-gray-400" />
                      <span>{car.location}</span>
                    </div>
                  )}

                  {/* Price */}
                  {car.price && (
                    <div className="mt-2 text-[26px] font-extrabold text-black leading-tight">
                      {car.price}
                    </div>
                  )}
                </div>

                {/* Top Rated Badge */}
                {car.showTopRatedBadge && (
                  <div
                    className="flex flex-col items-center justify-center rounded-full border-[3px] text-center shrink-0"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderColor: "#D6A125",
                      backgroundColor: "#FFFBF0",
                    }}
                  >
                    <FaStar
                      className="text-[12px] mb-0.5"
                      style={{ color: "#D6A125" }}
                    />
                    <div
                      className="font-bold leading-none"
                      style={{
                        fontSize: "8.5px",
                        color: "#D6A125",
                      }}
                    >
                      TOP
                      <br />
                      RATED
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-[14px] leading-relaxed text-[#4B5563] tracking-normal">
                {car.description}
              </p>

              {/* Stats */}
              {car.stats && car.stats.length > 0 && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {car.stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="flex items-start gap-2.5">
                        <div className="p-1 rounded bg-gray-50">
                          <Icon className="text-[16px] text-gray-600" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#111827] tracking-tight leading-tight">
                            {stat.value}
                          </div>
                          <div className="text-[11px] text-[#6B7280] font-medium tracking-normal mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#ECECEC] pt-3 text-[12px] text-[#6B7280]">
                {car.meta && car.meta.length > 0 ? (
                  car.meta.map((meta, mIdx) => (
                    <React.Fragment key={mIdx}>
                      <span>
                        {meta.label}:{" "}
                        <span className="font-semibold text-[#111827] tracking-normal inline-flex items-center gap-1">
                          {meta.value}
                          {meta.label === "Status" && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          )}
                        </span>
                      </span>
                      {mIdx !== car.meta.length - 1 && <span>|</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <span>
                      Category:{" "}
                      <span className="font-semibold text-[#111827] tracking-normal">
                        {car.category}
                      </span>
                    </span>
                    <span>|</span>
                    <span>
                      Origin:{" "}
                      <span className="font-semibold text-[#111827] tracking-normal">
                        {car.origin}
                      </span>
                    </span>
                    <span>|</span>
                    <span>
                      Body Type:{" "}
                      <span className="font-semibold text-[#111827] tracking-normal">
                        {car.bodyType}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {/* Links */}
              <div className="mt-5 flex gap-8 pt-3 border-t border-gray-100">
                {car.socialLinks && car.socialLinks.length > 0 ? (
                  <a
                    href={car.socialLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] font-bold text-[#111827] hover:text-[#D6A125] transition-colors"
                  >
                    View Channel
                    <FaArrowRight className="text-[11px]" />
                  </a>
                ) : (
                  <a
                    href={car.listingLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] font-bold text-[#111827] hover:text-[#D6A125] transition-colors"
                  >
                    View Full Listing
                    <FaArrowRight className="text-[11px]" />
                  </a>
                )}
                <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#111827] hover:text-[#D6A125] transition-colors">
                  View Sources ({car.sourcesCount})
                  <FaArrowRight className="text-[11px]" />
                </button>
              </div>
            </div>

            {/* VOTE PANEL */}
            <div className="flex w-full md:w-[180px] shrink-0 flex-col items-center border-t md:border-t-0 md:border-l border-[#E5E7EB] px-6 py-6 bg-gray-50/30">
              <button
                onClick={() => onVote && onVote(car._id, car.categoryId)}
                disabled={isVoting}
                className={`h-[48px] w-full rounded-[8px] bg-black text-[14px] font-bold text-white transition hover:bg-gray-800 ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Vote
              </button>

              <div className="mt-6 text-center">
                <div className="text-[32px] tracking-tight font-extrabold text-[#111827]">
                  {car.votes}
                </div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Votes</div>
              </div>

              <div className="mt-auto w-full pt-6">
                <div className="h-[6px] w-full rounded-full bg-[#E5E7EB]">
                  <div
                    className="h-[6px] rounded-full transition-all duration-500"
                    style={{
                      width: car.progress,
                      backgroundColor: car.progressColor,
                    }}
                  />
                </div>

                <div
                  className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-bold uppercase tracking-wider"
                  style={{ color: car.statusColor }}
                >
                  {car.statusIcon === "trophy" ? (
                    <FaTrophy className="text-[11px]" />
                  ) : (
                    <FaRegStar className="text-[11px]" />
                  )}
                  <span>{car.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RankingCard;
