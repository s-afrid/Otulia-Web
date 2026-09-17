import React from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import SEO from "../../components/SEO";

function JournalHome() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <SEO
        title={activeCategory ? `${activeCategory} Journal` : "Journal"}
        description="The Otulia Journal: guides and news on luxury cars, luxury real estate, yachts and ownership."
      />
      <HeroSection />
      <BlogCards activeCategory={activeCategory} />
    </div>
  );
}

export default JournalHome;
