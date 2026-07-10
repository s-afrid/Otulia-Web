import { Link } from "react-router-dom";
import true_cost from "/src/assets/journal/true_cost.png";
import verify from "/src/assets/journal/verify.png";
import sell_faster from "/src/assets/journal/sell_faster.png";
import trends from "/src/assets/journal/trends.png";
import jumbo from "/src/assets/journal/jumbo.png";
import exotic_car from "/src/assets/journal/exotic_car.png";

const blogPosts = [
  {
    id: 1,
    tag: "Ownership Guides",
    category: "Cars",
    title: "The True Cost of Owning a Luxury Car: Beyond the Purchase Price",
    image: true_cost,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "9",
    link: "/journal/the-true-cost-of-owning-a-luxurycar",
  },
  {
    id: 2,
    tag: "Buyer Protection",
    category: "Cars",
    title:
      "How to Verify a Luxury Car's History and Authenticity Before You Buy",
    image: verify,
    author: "Otulia Editorial Team",
    date: "26 June",
    readTime: "8",
    link: "/journal/how-to-verify-a-luxury-car-history-and-authenticity-before-you-buy",
  },
  {
    id: 3,
    tag: "Seller Playbook",
    category: "Real Estate",
    title: "How to Stage a Luxury Home to Sell Faster (and for More)",
    image: sell_faster,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/how-to-stage-a-luxury-home-to-sell-faster",
  },
  {
    id: 4,
    tag: "Market Intelligence",
    category: "Real Estate",
    title:
      "Luxury Real Estate Trends 2026: What Buyers and Sellers Need to Know",
    image: trends,
    author: "Otulia Editorial Team",
    date: "25 June",
    readTime: "8",
    link: "/journal/luxury-real-estate-trends-2026-what-buyers-and-sellers-need-to-know",
  },
  {
    id: 5,
    tag: "Financing Guide",
    category: "Real Estate",
    title:
      "Jumbo Loans Explained: What Buyers Need to Know Before Financing a Luxury Home",
    image: jumbo,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/jumbo-loans-explained-what-buyers-need-to-know-before-financing-a-luxury-home",
  },
  {
    id: 6,
    tag: "Collector Insight",
    category: "Cars",
    title:
      "Which Exotic Cars Hold Their Value Best? A Guide to Investment-Grade Vehicles",
    image: exotic_car,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/which-exotic-cars-hold-their-value-best-a-guide-to-investment-grade-vehicles",
  },
  {
    id: 7,
    tag: null,
    category: "Real Estate",
    title:
      "Marketing to the Top 5%: How to Find, Reach and Win the Luxury Buyer",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/05/2200xxs-8-375x250.webp",
    author: "Otulia Editorial Team",
    date: "10 June",
    readTime: "< 1",
  },
  {
    id: 8,
    tag: null,
    category: "Real Estate",
    title:
      "The Bermuda Rebirth: A Professional's Guide to Tax-Neutral Residency and Luxury Real Estate",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/05/2200xxs-9-375x250.webp",
    author: "Otulia Editorial Team",
    date: "9 June",
    readTime: "< 1",
  },
];

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block mr-1"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BlogCard({ post }) {
  const CardWrapper = post.link ? Link : "div";
  const wrapperProps = post.link ? { to: post.link } : {};

  return (
    <CardWrapper {...wrapperProps} className="group flex flex-col bg-white">
      {/* Image */}
      <div className="overflow-hidden rounded-sm mb-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[190px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-2">
        {post.tag && (
          <>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
              {post.tag}
            </span>
            <span className="text-gray-300 text-xs">·</span>
          </>
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 montserrat">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-[16px] leading-[1.15] text-gray-900 group-hover:text-[#c8a96e] transition-colors mb-3 font-extrabold flex-1"
        style={{
          fontFamily: "'Kaisei Decol', serif",
        }}
      >
        {post.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-100 montserrat">
        <span>{post.date}</span>
        <span>by</span>
        <span className="text-gray-500 font-normal">{post.author}</span>
        <span className="ml-auto flex items-center text-gray-400">
          <ClockIcon />
          {post.readTime} min.
        </span>
      </div>
    </CardWrapper>
  );
}

export default function BlogCards({ activeCategory = null }) {
  const filteredPosts = activeCategory
    ? blogPosts.filter((post) => post.category === activeCategory)
    : blogPosts;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-25 pb-16">
        {/* Section divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2">
            {activeCategory ? `${activeCategory} Stories` : "Latest Stories"}
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Cards grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-16">
            No stories in this category yet — check back soon.
          </p>
        )}

        {/* Load More */}
        {/* <div className="flex justify-center mt-14">
          <button className="px-10 py-3 border border-black text-xs font-semibold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-200">
            Load More
          </button>
        </div> */}
      </div>
    </section>
  );
}
