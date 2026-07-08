const heroArticles = [
  {
    id: 1,
    tag: "Ownership Guides",
    category: "Cars",
    title: "The True Cost of Owning a Luxury Car: Beyond the Purchase Price",
    excerpt:
      "A six-figure price tag is the easiest number to plan for. The harder numbers — depreciation, insurance, and maintenance — are the ones that decide whether a luxury car is affordable to keep, not just to buy.",
    image: "../../src/assets/journal/true_cost.png",
    featured: true,
  },
  {
    id: 2,
    tag: "Buyer Protection",
    category: "Cars",
    title:
      "How to Verify a Luxury Car's History and Authenticity Before You Buy",
    excerpt:
      "Masterfully renovated and furnished to a remarkable standard, this seven-bedroom residence on one of London's most prestigious crescents delivers exceptional design, wellness amenities, and an unrivaled Belgravia address.",
    image: "../../src/assets/journal/verify.png",
    featured: false,
    link: "/journal/how-to-verify-a-luxury-car-history-and-authenticity-before-you-buy",
  },
  {
    id: 3,
    tag: "Seller Playbook",
    category: "Real Estate",
    title: "How to Stage a Luxury Home to Sell Faster",
    excerpt:
      "Staged luxury homes priced at $2 million-plus sell up to 45% faster than the market average. The investment is almost always small relative to the gain — but where and how you stage matters as much as whether you stage at all.",
    image: "./../src/assets/journal/sell_faster.png",
    featured: false,
    link: "/journal/how-to-stage-a-luxury-home-to-sell-faster",
  },
];

export default function HeroSection() {
  const featured = heroArticles[0];
  const sideArticles = heroArticles.slice(1);

  return (
    <section className="w-full bg-white font-sans">
      {/* Hero Grid */}
      <div className="mx-auto px-25 py-10">
        {/* Two-column layout: large featured + stacked side */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Featured (large left) */}
          <a
            href="/journal/the-true-cost-of-owning-a-luxurycar"
            className="group block"
          >
            <div className="overflow-hidden rounded-sm">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-[600px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
                  {featured.tag}
                </span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500 montserrat">
                  {featured.category}
                </span>
              </div>
              <h2
                className="text-3xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#c8a96e] transition-colors"
                style={{
                  fontFamily: "'Kaisei Decol', serif",
                }}
              >
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {featured.excerpt}
              </p>
            </div>
          </a>

          {/* Side stack */}
          <div className="flex flex-col gap-8">
            {sideArticles.map((article, idx) => (
              <a
                key={article.id}
                href={article.link}
                className={`group flex gap-5 ${
                  idx < sideArticles.length - 1
                    ? "pb-8 border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex-shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-[140px] h-[100px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
                      {article.tag}
                    </span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 montserrat">
                      {article.category}
                    </span>
                  </div>
                  <h3
                    className="text-[14px] font-semibold text-gray-900 group-hover:text-[#c8a96e] transition-colors "
                    style={{
                      fontFamily: "'Kaisei Decol', serif",
                    }}
                  >
                    {article.title}
                  </h3>
                </div>
              </a>
            ))}

            {/* Extra featured card */}
            <a
              href="/journal/luxury-real-estate-trends-2026-what-buyers-and-sellers-need-to-know"
              className="group block pt-2"
            >
              <div className="overflow-hidden rounded-sm mb-4">
                <img
                  src="../../src/assets/journal/trends.png"
                  className="w-full h-[170px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
                  Market Intelligence
                </span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 montserrat">
                  Real Estate
                </span>
              </div>
              <h3
                className="text-sm font-bold leading-snug text-gray-900 group-hover:text-[#c8a96e] transition-colors"
                style={{
                  fontFamily: "'Kaisei Decol', serif",
                }}
              >
                Luxury Real Estate Trends 2026: What Buyers and Sellers Need to
                Know
              </h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
