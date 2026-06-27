const blogPosts = [
  {
    id: 1,
    tag: "Handpicked by JE",
    category: "Real Estate",
    title:
      "Six Senses Comporta Brings Branded Wellness Residences to Portugal's Elite Atlantic Coast",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/06/Savills-hero-375x250.webp",
    author: "Sandie Braeckman",
    date: "10 June",
    readTime: "6",
  },
  {
    id: 2,
    tag: "Unique Living",
    category: "Real Estate",
    title:
      "Dakota Johnson Parts With Carl Maston's Midcentury Masterpiece Above Chateau Marmont for $6 Million",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/06/Dakota-Johnson-375x250.webp",
    author: "Sandie Braeckman",
    date: "10 June",
    readTime: "5",
  },
  {
    id: 3,
    tag: "Unique Living",
    category: "Real Estate",
    title: "Inside Selena Gomez's Encino Compound, Once Built for Tom Petty",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/06/Selena-Gomez-hero-375x250.webp",
    author: "Sandie Braeckman",
    date: "10 June",
    readTime: "4",
  },
  {
    id: 4,
    tag: "Handpicked by JE",
    category: "Real Estate",
    title:
      "Villa Infinity Mare: A Cliffside Coastal Masterpiece Overlooking the Mediterranean",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/06/Evohe-hero-375x250.webp",
    author: "Sandie Braeckman",
    date: "10 June",
    readTime: "5",
  },
  {
    id: 5,
    tag: null,
    category: "Real Estate",
    title:
      "Selling Marbella: A Market Guide for Luxury Real Estate Professionals",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/06/2200xxs-1-1-380x214.webp",
    author: "Andrew Bateman",
    date: "10 June",
    readTime: "2",
  },
  {
    id: 6,
    tag: null,
    category: "Real Estate",
    title:
      "Everything Is Brand: The Agent's Playbook for Visibility, Trust & Growth in the Age of AI",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/02/First-team_hero-375x250.webp",
    author: "Andrew Bateman",
    date: "10 June",
    readTime: "2",
  },
  {
    id: 7,
    tag: null,
    category: "Real Estate",
    title:
      "Marketing to the Top 5%: How to Find, Reach and Win the Luxury Buyer",
    image:
      "https://www.jamesedition.com/stories/wp-content/uploads/2026/05/2200xxs-8-375x250.webp",
    author: "Andrew Bateman",
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
    author: "Andrew Bateman",
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
  return (
    <a href="#" className="group flex flex-col bg-white">
      {/* Image */}
      <div className="overflow-hidden rounded-sm mb-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[190px] object-cover group-hover:scale-[1.03] transition-transform duration-500"
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
    </a>
  );
}

export default function BlogCards() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-25 pb-16">
        {/* Section divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2">
            Latest Stories
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-14">
          <button className="px-10 py-3 border border-black text-xs font-semibold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-200">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}
