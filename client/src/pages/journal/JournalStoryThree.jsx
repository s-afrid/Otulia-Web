import React from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import LuxuryHomeStagingArticle from "../../components/journal/Stories/StoryThree";

function JournalStoryThree() {
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
