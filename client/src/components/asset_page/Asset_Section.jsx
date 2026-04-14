import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import Car_Section from "./car/Car_Section";
import Estate_Section from "./estate/Estate_Section";
import YachtDetail_Section from "./yacht/Yacht_Section";
import BikeDetail_Section from "./bike/Bike_Section";

const Asset_Section = () => {
  const path = useLocation()
  const navigate = useNavigate();
  const patharray = path.pathname.split('/')
  const cat = patharray[2]

  return (
    <div className="flex flex-col">
      <div className="w-full px-2 md:px-4 pt-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-black hover:bg-gray-100 rounded-md transition-all font-medium montserrat cursor-pointer w-fit"
        >
          <HiArrowLeft className="text-xl" />
          <span>Back</span>
        </button>
      </div>

      {(cat === 'car' || cat === 'cars') && (
        <Car_Section key={path.pathname} />
      )}

      {(cat === 'estate' || cat === 'estates') && (
        <Estate_Section key={path.pathname} />
      )}

      {(cat === 'yacht' || cat === 'yachts') && (
        <YachtDetail_Section key={path.pathname} />
      )}

      {(cat === 'bike' || cat === 'bikes') && (
        <BikeDetail_Section key={path.pathname} />
      )}
    </div>
  );
};

export default Asset_Section;

