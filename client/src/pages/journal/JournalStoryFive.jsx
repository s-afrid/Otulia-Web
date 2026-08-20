import React, { useEffect } from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import JumboLoanGuideArticle from "../../components/journal/Stories/StoryFive";

function JournalStoryFive() {
  useEffect(() => {
    document.title = "Jumbo Loans Explained | Otulia Journal";
    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <JumboLoanGuideArticle />
    </div>
  );
}

export default JournalStoryFive;
