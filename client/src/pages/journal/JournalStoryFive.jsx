import React from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import JumboLoanGuideArticle from "../../components/journal/Stories/StoryFive";

function JournalStoryFive() {
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
