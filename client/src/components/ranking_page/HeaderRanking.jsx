import React from "react";
import {
  FaChevronRight,
  FaShareAlt,
  FaTrophy,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";

function RankingHeader() {
  // Dummy data (replace with API data later)
  const rankingData = {
    breadcrumbs: ["Home", "Rankings", "Cars", "Best Hypercars of 2026"],

    titleMain: "Best Hypercars",

    titleHighlight: "of 2026",

    description:
      "The ultimate ranking of the world's most extraordinary hypercars based on performance, design, innovation, and overall impact.",

    stats: [
      {
        icon: FaTrophy,
        value: "10",
        label: "Nominees",
        iconColor: "text-[#C9920E]",
      },
      {
        icon: FaUsers,
        value: "2.4K",
        label: "Total Votes",
        iconColor: "text-black",
      },
      {
        icon: FaRegCalendarAlt,
        value: "May 2026",
        label: "Last Updated",
        iconColor: "text-black",
      },
    ],
  };

  return (
    <section className="bg-white ml-[248px] pt-[110px] px-8 pb-10">
      {/* Breadcrumb + Share */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#6B7280] mb-5">
            {rankingData.breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>

                {index !== rankingData.breadcrumbs.length - 1 && (
                  <FaChevronRight className="text-[11px]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em]">
            <span className="text-black">{rankingData.titleMain} </span>

            <span className="text-[#C9920E]">{rankingData.titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#4B5563]">
            {rankingData.description}
          </p>
        </div>

        {/* Share Button */}
        <button
          className="
            flex items-center gap-3
            self-start
            rounded-xl
            border border-[#E5E7EB]
            bg-white
            px-6 py-4
            text-[16px]
            font-semibold
            hover:bg-gray-50
            transition
          "
        >
          <FaShareAlt className="text-[18px]" />

          <span>Share</span>
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 flex flex-wrap gap-4">
        {rankingData.stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                flex items-center gap-4
                rounded-2xl
                border border-[#E7E7E7]
                bg-white
                px-5 py-4
                shadow-[0_2px_6px_rgba(0,0,0,0.03)]
                min-w-[135px]
              "
            >
              <Icon className={`text-[26px] ${stat.iconColor}`} />

              <div>
                <div className="text-[28px] font-bold leading-none text-black">
                  {stat.value}
                </div>

                <div className="mt-1 text-[15px] text-[#6B7280]">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RankingHeader;
