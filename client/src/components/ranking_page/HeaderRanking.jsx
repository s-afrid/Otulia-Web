import React from "react";
import { FaTrophy, FaUsers, FaRegCalendarAlt, FaChevronRight } from "react-icons/fa";

function RankingHeader({ data }) {
  if (!data) return null;

  const { tag, main, sub } = (function getTitleParts(title = "", highlight = "") {
    let main = title.trim();
    let sub = highlight ? highlight.trim() : "";
    let tag = "TOP";

    if (/^best\s+/i.test(main)) {
      main = main.replace(/^best\s+/i, "");
    }

    if (!sub) {
      if (/\s+of\s+\d{4}$/i.test(main)) {
        sub = main.match(/\s+of\s+\d{4}$/i)[0].trim();
        main = main.replace(/\s+of\s+\d{4}$/i, "");
      } else if (/\s+\d{4}$/i.test(main)) {
        sub = "OF " + main.match(/\s+\d{4}$/i)[0].trim();
        main = main.replace(/\s+\d{4}$/i, "");
      } else {
        sub = "OF 2026";
      }
    }

    return {
      tag: tag.toUpperCase(),
      main: main.toUpperCase(),
      sub: sub.toUpperCase(),
    };
  })(data.titleMain || "Hypercars", data.titleHighlight);

  const fallbackBanner = "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1600&auto=format&fit=crop";
  const coverImg = data.bannerImage || data.coverImage || data.categoryImage || fallbackBanner;

  return (
    <section className="bg-transparent pt-2 pb-6 font-sans">
      {/* Breadcrumb Navigation above banner */}
      {data.breadcrumbs && data.breadcrumbs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-zinc-400 mb-3 font-sans">
          {data.breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span className="hover:text-white transition cursor-pointer">{item}</span>
              {index !== data.breadcrumbs.length - 1 && (
                <FaChevronRight className="text-[10px] text-zinc-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Cover Banner Box */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl min-h-[280px] md:min-h-[320px] flex items-center bg-black">
        {/* Banner Cover Image */}
        <img
          src={coverImg}
          alt={data.titleMain || "Category Banner"}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent w-full md:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Content Container inside Banner */}
        <div className="relative z-10 p-5 sm:p-7 md:p-8 max-w-2xl text-white flex flex-col justify-between min-h-full">
          <div>
            {/* TOP tag */}
            <span className="text-[#D48D2A] font-bold text-xs md:text-sm tracking-[0.25em] uppercase mb-0.5 block">
              {tag}
            </span>

            {/* Main Title White */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {main}
            </h1>

            {/* Title Gold */}
            <div className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#D48D2A] leading-none mt-1 mb-3">
              {sub}
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl font-normal mb-5">
              {data.description || "Ranking the world's most extreme machines that push the limits of speed, engineering, and innovation."}
            </p>
          </div>

          {/* Bottom Stats Row inside Banner */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-3 border-t border-zinc-700/50">
            {/* Stat 1: Nominees */}
            <div className="flex items-center gap-2.5">
              <FaTrophy className="text-[#D48D2A] text-base sm:text-lg shrink-0" />
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white block leading-none">
                  {data.nominees || "0"}
                </span>
                <span className="text-[9px] tracking-wider text-zinc-400 font-bold uppercase">
                  NOMINEES
                </span>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-zinc-700/60" />

            {/* Stat 2: Total Votes */}
            <div className="flex items-center gap-2.5">
              <FaUsers className="text-zinc-300 text-base sm:text-lg shrink-0" />
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white block leading-none">
                  {data.votes ? `${data.votes}${data.votes.endsWith('+') || data.votes.endsWith('K') ? '' : '+'}` : "0"}
                </span>
                <span className="text-[9px] tracking-wider text-zinc-400 font-bold uppercase">
                  TOTAL VOTES
                </span>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-zinc-700/60" />

            {/* Stat 3: Last Updated */}
            <div className="flex items-center gap-2.5">
              <FaRegCalendarAlt className="text-zinc-300 text-base sm:text-lg shrink-0" />
              <div>
                <span className="font-extrabold text-xs sm:text-xs text-white block leading-none uppercase">
                  {data.updated || "MAY 2026"}
                </span>
                <span className="text-[9px] tracking-wider text-zinc-400 font-bold uppercase">
                  LAST UPDATED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RankingHeader;
