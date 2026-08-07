import mainPostimg from "/src/assets/journal/blog_seven/hero.png";
import sidePostone from "/src/assets/journal/blog_eight/hero.png";
import sidePostTwo from "/src/assets/journal/blog_nine/hero.png";
import sidePostThree from "/src/assets/journal/blog_ten/hero.png";
import novak from "/src/assets/journal/blog_ten/hero.png";
import haaland from "/src/assets/journal/blog_eleven/hero.webp";
import terry from "/src/assets/journal/blog_twelve/hero_image.webp";
import zendaya from "/src/assets/journal/blog_thirteen/hero.webp";
import porsche from "/src/assets/journal/blog_fourteen/hero.webp";
import { Link } from "react-router-dom";

const heroArticles = [
  {
    id: 1,
    tag: "Ownership Guides",
    category: "Cars",
    title:
      "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai",
    excerpt:
      "Binghatti Developers has welcomed another global icon to its international portfolio of buyers, as Hollywood actor and television personality Terry Crews officially signed for an apartment at Binghatti Aquarise during the project's grand launch in Dubai.",
    image: terry,
    featured: true,
  },
  {
    id: 2,
    tag: "Celebrity Real Estate",
    category: "Real Estate",
    title: "Inside Zendaya and Tom Holland's $22 Million Property Portfolio",
    excerpt:
      "The longtime couple's real estate holdings include multiple California properties, a luxury Brooklyn condo, and a renovated London home.",
    image: zendaya,
    featured: false,
    link: "/journal/zendaya-tom-holland-property-portfolio",
  },
  {
    id: 3,
    tag: "Real Estate News",
    category: "Real Estate",
    title:
      "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise",
    excerpt:
      "On a test drive in Germany, the 2027 Porsche Cayenne Turbo Coupe Electric floored us with its ability to summon more muscle than the 918 Spyder.",
    image: porsche,
    featured: false,
    link: "/journal/porsche-cayenne-turbo-coupe-electric-road-test",
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
          <Link
            to="/journal/terry-crews-binghatti-aquarise-dubai"
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
          </Link>

          {/* Side stack */}
          <div className="flex flex-col gap-8">
            {sideArticles.map((article, idx) => (
              <Link
                key={article.id}
                to={article.link}
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
              </Link>
            ))}

            {/* Extra featured card */}
            <Link
              to="/journal/erling-haaland-multimillion-dollar-car-collection"
              className="group block pt-2"
            >
              <div className="overflow-hidden rounded-sm mb-4">
                <img
                  src={haaland}
                  className="w-full h-[170px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
                  Celebrity Collection
                </span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 montserrat">
                  Cars
                </span>
              </div>
              <h3
                className="text-sm font-bold leading-snug text-gray-900 group-hover:text-[#c8a96e] transition-colors"
                style={{
                  fontFamily: "'Kaisei Decol', serif",
                }}
              >
                "From Ferrari to Bugatti: Inside Erling Haaland's
                Multimillion-Dollar Car Collection"
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
