import Navbar from "../components/Navbar";
import Hero from "../components/home_page/Hero";
import CategorySection from "../components/home_page/CategorySection";
import TrendingListings from "../components/home_page/TrendingListings";
import MostPopularAssets from "../components/home_page/MostPopularAssets";
import BlogSection from "../components/home_page/BlogSection";
import BrandCarousel from "../components/home_page/BrandCarousel";
import PopularLinks from "../components/home_page/PopularLinks";
import SEO from "../components/SEO";

import { useEffect } from "react";
import welcomeSound from "../assets/sounds/theme.mp3";

const Home = () => {
  useEffect(() => {
    const audio = new Audio(welcomeSound);

    audio.volume = 0.5; // 0.0 to 1.0

    audio.play().catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  return (
    <div className="relative w-full overflow-x-hidden">
      <SEO
        title="Home"
        description="The premier destination for buying and selling editorial-grade luxury cars, yachts, estates, and bikes."
      />
      <Navbar hideSearch={true} />
      <Hero />

      {/* Main Sections Flow */}
      <CategorySection />
      <TrendingListings />
      <MostPopularAssets />
      <BlogSection />
      <BrandCarousel />
      <PopularLinks />
    </div>
  );
};

export default Home;
