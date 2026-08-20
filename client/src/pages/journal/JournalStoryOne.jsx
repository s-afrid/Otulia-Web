import React, { useEffect } from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import LuxuryCarCostArticle from "../../components/journal/Stories/StoryOne";

function JournalStoryOne() {
  useEffect(() => {
    document.title = "The True Cost of Owning a Luxury Car | Otulia Journal";
    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <LuxuryCarCostArticle />
    </div>
  );
}

export default JournalStoryOne;
