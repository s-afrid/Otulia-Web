import React from 'react';
import { 
  IoSpeedometerOutline, 
  IoFuelOutline, 
  IoBedOutline, 
  IoBathtubOutline, 
  IoResizeOutline 
} from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";

const YachtKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  
  const specItems = [
    { label: 'Length', value: kSpecs.length, icon: <IoResizeOutline className="w-7 h-7" /> },
    { label: 'Bathrooms', value: kSpecs.bathrooms, icon: <IoBathtubOutline className="w-7 h-7" /> },
    { label: 'Fuel', value: kSpecs.fuelCapacity, icon: <IoFuelOutline className="w-7 h-7" /> },
    { label: 'Engine', value: kSpecs.engineType, icon: <MdOutlineSettings className="w-7 h-7" /> },
    { label: 'Bedrooms', value: kSpecs.bedrooms, icon: <IoBedOutline className="w-7 h-7" /> },
    { label: 'Top Speed', value: kSpecs.topSpeed, icon: <IoSpeedometerOutline className="w-7 h-7" /> }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  // Helper Component for a Feature Card
  const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-6 border border-gray-100 rounded-lg px-8 py-6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow cursor-default font-poppins">
      {/* Icon Container */}
      <div className="flex justify-center items-center text-gray-800 shrink-0">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex flex-col gap-1">
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label || 'Specification'}</span>
         <span className="text-xl font-medium text-black">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full px-[4%] py-16 bg-white">
      
      {/* Header Box - Line with Centered Text */}
      <div className="relative flex items-center justify-center mb-16">
        <span className="absolute left-0 text-[10px] font-bold text-[#B58252] uppercase tracking-[0.2em] bg-white z-10 pr-4">HIGHLIGHTS</span>
        <div className="w-full h-px bg-gray-200"></div>
        <div className="absolute bg-white px-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-normal canela text-black whitespace-nowrap">
            Key Specifications
          </h2>
          <span className="text-[#B58252] text-xs mt-2">♦</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {specItems.map((spec, index) => (
          <FeatureCard 
            key={index}
            label={spec.label}
            value={spec.value}
            icon={spec.icon}
          />
        ))}
      </div>

    </div>
  );
};

export default YachtKeyFeatures;