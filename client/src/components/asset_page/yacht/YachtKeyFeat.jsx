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

  // Helper Component for a Feature Card
 const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-6 border border-gray-100 rounded-lg px-6 py-4 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-default montserrat">
      {/* Icon Container */}
      <div className="w-8 h-8 flex justify-center items-center opacity-80 shrink-0">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex flex-col gap-0.5">
         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label || 'Specification'}</span>
         <span className="text-lg font-medium font-serif text-black">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 md:px-10 py-10 bg-white font-sans max-w-7xl mx-auto">
      
      {/* Header Box - Line with Centered Text */}
      <div className="relative flex items-center justify-center mb-12">
        <span className="absolute left-0 text-[10px] font-bold text-[#B58252] uppercase tracking-[0.2em] bg-white z-10 pr-4">HIGHLIGHTS</span>
        <div className="w-full h-px border-t border-gray-200"></div>
        <div className="absolute bg-white px-6 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-normal canela text-black">
            Key Specifications
          </h2>
          <span className="text-[#B58252] text-[10px] mt-1">♦</span>
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
        {specItems.map((spec, index) => (
          <FeatureCard 
            key={index}
            label={spec.label}
            value={spec.value}
            icon={<img className='w-full h-full object-contain' style={{ filter: 'grayscale(100%) opacity(80%)' }} src={spec.icon} alt={spec.label || 'Feature'} />}
          />
        ))}
      </div>

    </div>
  );
};

export default YachtKeyFeatures;