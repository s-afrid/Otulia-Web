import React from "react";
import HeroSection from "../../components/journal/HeroSection";
import BlogCards from "../../components/journal/BlogCards";
import PrimaryNavbar from "../../components/journal/PrimaryNav";
import SecondaryNavbar from "../../components/journal/SecondaryNav";
import InvestmentGradeExoticCarsArticle from "../../components/journal/Stories/StorySix";

function JournalStorySix() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* <NavbarJournal hideSearch={true} /> */}
      <PrimaryNavbar />
      <SecondaryNavbar />

      <InvestmentGradeExoticCarsArticle />
    </div>
  );
}

export default JournalStorySix;
