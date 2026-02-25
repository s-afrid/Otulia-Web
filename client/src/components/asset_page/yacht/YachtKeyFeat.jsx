import React from 'react';
import sqrtFt from '../../../assets/productpage/sqft.png'
import bathRoom from '../../../assets/productpage/bathroom.png'
import fuelCapacity from '../../../assets/productpage/fuelcapacity.png'
import power from '../../../assets/productpage/power.png'
import bedRoom from '../../../assets/productpage/bedroom.png'
import speed from '../../../assets/productpage/speed.png'

const YachtKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  
  const specItems = [
    { label: null, value: kSpecs.length, icon: sqrtFt },
    { label: 'Bathrooms', value: kSpecs.bathrooms, icon: bathRoom },
    { label: null, value: kSpecs.fuelCapacity, icon: fuelCapacity },
    { label: 'Engine', value: kSpecs.engineType, icon: power },
    { label: 'Bedrooms', value: kSpecs.bedrooms, icon: bedRoom },
    { label: 'TopSpeed', value: kSpecs.topSpeed, icon: speed }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  // Helper component for a single feature card
  const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-[#006d77] transition-colors cursor-default montserrat">
      {/* Icon Container */}
      <div className="text-[#006d77]">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex gap-1 items-baseline">
         {label && <span className="text-lg font-bold montserrat text-black">{label}:</span>}
         <span className="text-lg font-bold montserrat text-black">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-8 bg-white">
      
      {/* Header Section */}
      <div className="flex justify-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold playfair-display text-[#8b7355] border border-[#8b7355] px-8 py-2 rounded-md inline-block">
          Key Features
        </h2>
      </div>

      {/* Grid Layout: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specItems.map((spec, index) => (
          <FeatureCard 
            key={index}
            label={spec.label}
            value={spec.value}
            icon={<img className='w-15 h-15 object-contain' src={spec.icon} alt={spec.label || 'Feature'} />}
          />
        ))}
      </div>
    </div>
  );
};

export default YachtKeyFeatures;