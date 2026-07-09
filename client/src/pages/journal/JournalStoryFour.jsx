import React from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import LuxuryRealEstateTrends2026Article from "../../components/journal/Stories/StoryFour";

function JournalStoryFour() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <LuxuryRealEstateTrends2026Article />
    </div>
  );
}

export default JournalStoryFour;
