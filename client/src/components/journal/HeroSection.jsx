const heroArticles = [
  {
    id: 1,
    tag: "Local Knowledge",
    category: "Real Estate",
    title: "The Unveiled Elegance of Arezzo: A True Tuscan Sanctuary",
    excerpt:
      "From Renaissance art and medieval hilltop villages to rolling vineyards and sun-drenched olive groves, the province of Arezzo offers an authentic, unhurried way of life in one of Italy's most captivating landscapes.",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/05/Best-Realty_hero-1240x826.webp",
    featured: true,
  },
  {
    id: 2,
    tag: "Handpicked by JE",
    category: "Real Estate",
    title:
      "Belgravia Townhouse on Wilton Crescent: Six Floors of Exceptional Living",
    excerpt:
      "Masterfully renovated and furnished to a remarkable standard, this seven-bedroom residence on one of London's most prestigious crescents delivers exceptional design, wellness amenities, and an unrivaled Belgravia address.",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/04/Sothebys-Dubai-UK_hero-1240x826.webp",
    featured: false,
  },
  {
    id: 3,
    tag: "Market Trends",
    category: "Real Estate",
    title:
      "Lake Maggiore: Northern Italy's Rising Luxury Destination for International Buyers",
    excerpt:
      "As global attention shifts from saturated lake markets, Lake Maggiore offers a unique combination of heritage architecture, strategic positioning, and long-term investment potential across its shores.",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/05/BHHS-Palazzo_hero-1240x826.webp",
    featured: false,
  },
];

const categoryTabs = [
  "Real Estate",
  "Cars",
  "Yachts",
  "Watches",
  "Lifestyle",
  "Guides",
];

const tagPills = [
  "Unique Living",
  "Handpicked by JE",
  "Market Trends",
  "Local Knowledge",
  "The Insider",
  "Business Lens",
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
          <a href="#" className="group block">
            <div className="overflow-hidden rounded-sm">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-[480px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
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
                href="#"
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
                    className="w-[140px] h-[100px] object-cover group-hover:scale-[1.03] transition-transform duration-500"
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
            <a href="#" className="group block pt-2">
              <div className="overflow-hidden rounded-sm mb-4">
                <img
                  src="https://www.jamesedition.com/stories/wp-content/uploads/2026/03/Celebtiry-homes_hero-1240x826.webp"
                  alt="Celebrity Homes"
                  className="w-full h-[170px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
                  Unique Living
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
                From 1920s Paris to Modern Malibu: Star-Linked Homes Define a
                Century of Cinematic Luxury
              </h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
