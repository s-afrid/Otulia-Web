import React, { useEffect } from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import VerifyLuxuryCarHistoryArticle from "../../components/journal/Stories/StoryTwo";

function JournalStoryTwo() {
  useEffect(() => {
    document.title = "How to Verify a Luxury Car's History and Authenticity | Otulia Journal";
    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <VerifyLuxuryCarHistoryArticle />
    </div>
  );
}

export default JournalStoryTwo;
