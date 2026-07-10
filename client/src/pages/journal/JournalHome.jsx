import React from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";

function JournalHome() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <HeroSection />
      <BlogCards activeCategory={activeCategory} />
    </div>
  );
}

export default JournalHome;
