import React from 'react';
import bedRoom from '../../../assets/productpage/bedroom.png'
import sqrtFt from '../../../assets/productpage/sqft.png'
import bathRoom from '../../../assets/productpage/bathroom.png'
import land from '../../../assets/productpage/land.png'
import floor from '../../../assets/productpage/floor.png'
import garage from '../../../assets/productpage/garage.png'


const EstateKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  
  const specItems = [
    { label: 'Land Area', value: kSpecs.landArea, icon: land },
    { label: 'Bathrooms', value: kSpecs.bathrooms, icon: bathRoom },
    { label: 'Built Area', value: kSpecs.builtUpArea, icon: sqrtFt },
    { label: 'Bedrooms', value: kSpecs.bedrooms, icon: bedRoom },
    { label: 'Floors', value: kSpecs.floors, icon: floor },
    { label: 'Garage', value: kSpecs.garageCapacity, icon: garage }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  // Helper Component for a Feature Card
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
    <div className="w-full px-2 md:px-4 py-8 bg-white font-sans">
      
      {/* Header Box - Centered with Gold Border */}
      <div className="flex justify-center mb-10">
        <div className="border border-[#B8860B] rounded-lg px-8 py-3 inline-block">
          <h2 className="text-2xl md:text-3xl font-bold playfair-display text-[#8B7355] text-center">
            Key Features of Property
          </h2>
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {specItems.map((spec, index) => (
          <FeatureCard 
            key={index}
            label={spec.label}
            value={spec.value}
            icon={<img className='w-15 h-15 object-contain' src={spec.icon} alt={spec.label} />}
          />
        ))}
      </div>
    </div>
  );
};

export default EstateKeyFeatures;