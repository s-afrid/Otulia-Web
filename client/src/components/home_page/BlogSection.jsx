import React from "react";
import { useNavigate } from "react-router-dom";
import mainPostimg from "../../assets/journal/blog_seven/hero.png";
import sidePostone from "../../assets/journal/blog_eight/hero.png";
import sidePostTwo from "../../assets/journal/blog_nine/hero.png";
import sidePostThree from "../../assets/journal/blog_ten/hero.png";

const BlogSection = () => {
  const navigate = useNavigate();

  const mainPost = {
    title: "McLaren Just Unveiled Its First New Supercar Since 2024",
    date: "30 June 2026",
    snippet:
      "The company's first new car since 2024 is the ultimate evolution of the 720S.",
    image: mainPostimg,
    navigate:
      "/journal/mclaren-just-unveiled-its-first-new-supercar-since-2024",
  };

  const sidePosts = [
    {
      title: "The 2027 Ferrari 12Cilindri Manuale in Photos",
      date: "16 July 2026",
      snippet: "It's the first Prancing Horse with a stick shift since 2012.",
      image: sidePostone,
      navigate: "/journal/photos-2027-ferrari-12cilindri-manuale",
    },
    {
      title:
        "Justin and Hailey Bieber Just Bought a $12 Million N.Y.C. Pied-\u00e0-Terre",
      date: "16 July 2026",
      snippet:
        "The four-bedroom apartment sits in a curvaceous West Village building overlooking the Hudson River.",
      image: sidePostTwo,
      navigate: "/journal/justin-hailey-bieber-buy-west-village-condo",
    },
    {
      title: "Inside Novak Djokovic's Global Property Portfolio",
      date: "16 July 2026",
      snippet:
        "The Serbian tennis star has owned homes in Monaco, Serbia, Spain, Greece, and the U.S.",
      image: sidePostThree,
      navigate: "/journal/novak-djokovic-property-portfolio",
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
