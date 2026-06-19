import React from "react";
import {
  FaTrophy,
  FaBolt,
  FaArrowRight,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

function RankingCard({ cars }) {
  return (
    <div className="space-y-3">
      {cars.map((car) => (
        <div
          key={car.rank}
          className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white"
        >
          <div className="flex" style={{ height: "250px" }}>
            {/* IMAGE */}
            <div className="relative shrink-0 p-3" style={{ width: "340px" }}>
              <img
                src={car.image}
                alt={car.name}
                className="rounded-[10px] object-cover"
                style={{ width: "100%", height: "200px" }}
              />

              {/* Rank Ribbon */}
              <div className="absolute left-4 top-3">
                <div
                  className="flex w-[40px] flex-col items-center py-2 text-black"
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

              {/* Bottom Badge — only on rank 1 */}
              {car.showBadgeOnImage && car.badge && (
                <div className="absolute bottom-5 left-5">
                  <span className="rounded-md bg-[#4C2D95] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col px-4 py-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    {car.name}
                  </h2>
                  {car.showTagOnHeader && car.tag && (
                    <span className="rounded-md bg-[#4C2D95] px-2.5 py-1 text-[11px] font-semibold text-white">
                      {car.tag}
                    </span>
                  )}
                </div>

                {/* Top Rated Badge — only rank 1 */}
                {car.showTopRatedBadge && (
                  <div
                    className="flex flex-col items-center justify-center rounded-full border-[3px] text-center"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderColor: "#D6A125",
                      backgroundColor: "#FFFBF0",
                    }}
                  >
                    <FaStar
                      className="text-[14px]"
                      style={{ color: "#D6A125" }}
                    />
                    <div
                      className="font-bold leading-tight"
                      style={{
                        fontSize: "9px",
                        color: "#D6A125",
                        lineHeight: "1.1",
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
              <p className="mt-2 text-[13px] leading-relaxed text-[#4B5563]">
                {car.description}
              </p>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-4 gap-6">
                {car.stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <Icon className="mt-0.5 text-[18px] text-[#4B5563]" />
                      <div>
                        <div className="text-[14px] font-semibold text-[#111827]">
                          {stat.value}
                        </div>
                        <div className="text-[12px] text-[#6B7280]">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meta */}
              <div className="mt-4 flex items-center gap-4 border-t border-[#ECECEC] pt-3 text-[12px] text-[#6B7280]">
                <span>
                  Category:{" "}
                  <span className="font-medium text-[#111827]">
                    {car.category}
                  </span>
                </span>
                <span>|</span>
                <span>
                  Origin:{" "}
                  <span className="font-medium text-[#111827]">
                    {car.origin}
                  </span>
                </span>
                <span>|</span>
                <span>
                  Body Type:{" "}
                  <span className="font-medium text-[#111827]">
                    {car.bodyType}
                  </span>
                </span>
              </div>

              {/* Links */}
              <div className="mt-auto flex gap-10 pt-3">
                <button className="flex items-center gap-2 text-[14px] font-semibold text-[#111827] hover:text-[#D6A125]">
                  View Full Listing
                  <FaArrowRight className="text-[12px]" />
                </button>
                <button className="flex items-center gap-2 text-[14px] font-semibold text-[#111827] hover:text-[#D6A125]">
                  View Sources ({car.sourcesCount})
                  <FaArrowRight className="text-[12px]" />
                </button>
              </div>
            </div>

            {/* VOTE PANEL */}
            <div className="flex w-[170px] shrink-0 flex-col items-center border-l border-[#E5E7EB] px-5 py-4">
              <button className="h-[54px] w-full rounded-[8px] bg-black text-[14px] font-semibold text-white transition hover:bg-[#1F2937]">
                Vote
              </button>

              <div className="mt-7 text-center">
                <div className="text-[26px] font-bold text-[#111827]">
                  {car.votes}
                </div>
                <div className="text-[14px] text-[#6B7280]">Votes</div>
              </div>

              <div className="mt-auto w-full">
                <div className="h-[5px] w-full rounded-full bg-[#EFEFEF]">
                  <div
                    className="h-[5px] rounded-full"
                    style={{
                      width: car.progress,
                      backgroundColor: car.progressColor,
                    }}
                  />
                </div>

                <div
                  className="mt-3 flex items-center justify-center gap-2 text-[13px] font-medium"
                  style={{ color: car.statusColor }}
                >
                  {car.statusIcon === "trophy" ? (
                    <FaTrophy className="text-[12px]" />
                  ) : (
                    <FaRegStar className="text-[12px]" />
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
