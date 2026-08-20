import React, { useEffect } from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import LuxuryHomeStagingArticle from "../../components/journal/Stories/StoryThree";

function JournalStoryThree() {
  useEffect(() => {
    document.title = "How to Stage a Luxury Home to Sell Faster | Otulia Journal";
    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <LuxuryHomeStagingArticle />
    </div>
  );
}

export default JournalStoryThree;
