import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";

function JournalHome() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    if (activeCategory) {
      document.title = `${activeCategory} Journal | Otulia`;
    } else {
      document.title = "Journal | Otulia";
    }

    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <HeroSection />
      <BlogCards activeCategory={activeCategory} />
    </div>
  );
}

export default JournalHome;
