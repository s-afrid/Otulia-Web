import Navbar from "../components/Navbar";
import Hero from "../components/home_page/Hero";
import CategorySection from "../components/home_page/CategorySection";
import TrendingListings from "../components/home_page/TrendingListings";
import MostPopularAssets from "../components/home_page/MostPopularAssets";
import BlogSection from "../components/home_page/BlogSection";
import BrandCarousel from "../components/home_page/BrandCarousel";
import PopularLinks from "../components/home_page/PopularLinks";
import SEO, { BRAND_TITLE } from "../components/SEO";

const Home = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      <SEO
        title={BRAND_TITLE}
        description="Otulia is the global luxury marketplace to buy and sell luxury cars, real estate, yachts and bikes from verified dealers and private sellers."
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
