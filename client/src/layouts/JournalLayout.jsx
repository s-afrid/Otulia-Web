import { Outlet } from "react-router-dom";
import PrimaryNavbar from "../components/journal/PrimaryNav";
import SecondaryNavbar from "../components/journal/SecondaryNav";

function JournalLayout() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <PrimaryNavbar />
      <SecondaryNavbar />
      <Outlet />
    </div>
  );
}

export default JournalLayout;
