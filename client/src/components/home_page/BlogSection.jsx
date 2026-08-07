import React from "react";
import { useNavigate } from "react-router-dom";
// import mainPostimg from "../../assets/journal/blog_seven/hero.png";
// import sidePostone from "../../assets/journal/blog_eight/hero.png";
// import sidePostTwo from "../../assets/journal/blog_nine/hero.png";
// import sidePostThree from "../../assets/journal/blog_ten/hero.png";

import mainPostimg from "../../assets/journal/blog_eleven/hero.webp";
import sidePostone from "../../assets/journal/blog_twelve/hero_image.webp";
import sidePostTwo from "../../assets/journal/blog_thirteen/hero.webp";
import sidePostThree from "../../assets/journal/blog_fourteen/hero.webp";

const BlogSection = () => {
  const navigate = useNavigate();

  const mainPost = {
    title:
      "From Ferrari to Bugatti: Inside Erling Haaland's Multimillion-Dollar Car Collection",
    date: "28 July 2026",
    snippet:
      "Goal-scoring records and Birkin bags aren't the only things the soccer star collects.",
    image: mainPostimg,
    navigate: "/journal/erling-haaland-multimillion-dollar-car-collection",
  };

  const sidePosts = [
    {
      title:
        "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai",
      date: "28 July 2026",
      snippet:
        "Binghatti Developers has welcomed another global icon to its international portfolio of buyers, as...",
      image: sidePostone,
      navigate: "/journal/terry-crews-binghatti-aquarise-dubai",
    },
    {
      title: "Inside Zendaya and Tom Holland's $22 Million Property Portfolio",
      date: "28 July 2026",
      snippet:
        "The longtime couple's real estate holdings include multiple California properties, a luxury Brooklyn condo, and a renovated London home.",
      image: sidePostTwo,
      navigate: "/journal/zendaya-tom-holland-property-portfolio",
    },
    {
      title:
        "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise",
      date: "28 July 2026",
      snippet:
        "On a test drive in Germany, the 2027 Porsche Cayenne Turbo Coupe Electric floored us with its ability to summon more muscle than the 918 Spyder.",
      image: sidePostThree,
      navigate: "/journal/porsche-cayenne-turbo-coupe-electric-road-test",
    },
  ];

  return (
    <section className="w-full px-3 md:px-6 py-6 bg-white">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl canela text-black">Our Blog</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Main Post */}
        <a
          href={mainPost.navigate}
          target="_blank"
          className="relative group cursor-pointer overflow-hidden aspect-[16/10]"
        >
          <img
            src={mainPost.image}
            alt={mainPost.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <span className="text-white/80 text-sm font-medium mb-4 block tracking-wide uppercase">
              {mainPost.date}
            </span>
            <h3 className="text-3xl text-white font-serif font-bold leading-tight mb-4 group-hover:underline decoration-1 underline-offset-4">
              {mainPost.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed max-w-xl">
              {mainPost.snippet}
            </p>
          </div>
        </a>

        {/* Right: Side Posts */}
        <div className="flex flex-col gap-10">
          {sidePosts.map((post, idx) => (
            <a
              key={idx}
              href={post.navigate}
              target="_blank"
              className="flex gap-6 group cursor-pointer"
            >
              <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-tight">
                  {post.date}
                </span>
                <h4 className="text-lg font-bold text-black leading-snug mb-2 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                  {post.snippet}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
