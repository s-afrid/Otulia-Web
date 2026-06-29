import React from "react";
import {
  FaChevronRight,
  FaShareAlt,
  FaTrophy,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";

function RankingHeader({ data }) {
  const stats = [
    {
      icon: FaTrophy,
      value: data.nominees,
      label: "Nominees",
      iconColor: "text-[#C9920E]",
    },
    {
      icon: FaUsers,
      value: data.votes,
      label: "Total Votes",
      iconColor: "text-white",
    },
    {
      icon: FaRegCalendarAlt,
      value: data.updated,
      label: "Last Updated",
      iconColor: "text-white",
    },
  ];
  return (
    <section className="bg-transparent pt-[110px] pb-12">
      {/* Breadcrumb + Share */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#A1A1AA] mb-5">
            {data.breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>

                {index !== data.breadcrumbs.length - 1 && (
                  <FaChevronRight className="text-[11px]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em]">
            <span className="text-white">{data.titleMain} </span>

            <span className="text-[#C9920E]">{data.titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[650px] text-[18px] leading-[1.65] text-[#A1A1AA]">
            {data.description}
          </p>
        </div>

        {/* Share Button */}
        <button
          className="
            flex items-center gap-3
            self-start
            rounded-xl
            border border-zinc-800
            bg-zinc-900/50
            text-white
            px-6 py-4
            text-[16px]
            font-semibold
            hover:bg-zinc-800
            transition
          "
        >
          <FaShareAlt className="text-[18px]" />

          <span>Share</span>
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 flex flex-wrap gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                flex items-center gap-4
                rounded-xl
                border border-zinc-800
                bg-zinc-900/40
                px-8 py-4
                min-w-[135px]
              "
            >
              <Icon className={`text-[24px] ${stat.iconColor}`} />

              <div>
                <div className="text-[20px] font-bold leading-none text-white">
                  {stat.value}
                </div>

                <div className="mt-1 text-[12px] text-[#A1A1AA]">
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
