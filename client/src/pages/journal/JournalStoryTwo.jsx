import React from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import VerifyLuxuryCarHistoryArticle from "../../components/journal/Stories/StoryTwo";

function JournalStoryTwo() {
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
