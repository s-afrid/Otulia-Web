import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

function RankingHeader({ data }) {
  if (!data) return null;

  const fallbackBanner = "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1600&auto=format&fit=crop";
  const coverImg = data.bannerImage || data.coverImage || data.categoryImage || fallbackBanner;

  return (
    <section className="bg-transparent pt-1 sm:pt-2 pb-4 sm:pb-6 font-sans">
      {/* Breadcrumb Navigation above banner */}
      {data.breadcrumbs && data.breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-zinc-400 mb-3 font-sans select-none">
          {data.breadcrumbs.map((item, index) => {
            const isLast = index === data.breadcrumbs.length - 1;
            const isHome = index === 0;
            const isRankings = index === 1;
            const isCategoryType = index === 2;

            let linkPath = null;
            if (isHome) linkPath = "/";
            else if (isRankings) linkPath = "/ranking";
            else if (isCategoryType) {
              const catType = item.toLowerCase().replace(/\s+/g, "");
              linkPath = `/ranking/${catType}`;
            }

            return (
              <React.Fragment key={index}>
                {linkPath && !isLast ? (
                  <Link
                    to={linkPath}
                    className="hover:text-[#D6A125] transition-colors duration-150 text-zinc-400 font-medium"
                  >
                    {item}
                  </Link>
                ) : (
                  <span className={isLast ? "text-zinc-200 font-semibold truncate max-w-[240px] sm:max-w-none" : "text-zinc-400"}>
                    {item}
                  </span>
                )}
                {!isLast && (
                  <FaChevronRight className="text-[9px] sm:text-[10px] text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Cover Banner Box */}
      <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl aspect-[2.4/1] sm:aspect-[3/1] md:aspect-[3.6/1] lg:aspect-[4.2/1] xl:aspect-[4.6/1] min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px] max-h-[360px] xl:max-h-[400px] flex items-center bg-black">
        {/* Banner Cover Image */}
        <img
          src={coverImg}
          alt={data.titleMain || "Category Banner"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
          onError={(e) => {
            e.currentTarget.src = fallbackBanner;
          }}
        />

        {/* Subtle Vignette Border Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>
    </section>
  );
}

export default RankingHeader;

