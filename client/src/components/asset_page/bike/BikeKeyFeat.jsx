import React from 'react';
import fuelCapacity from '../../../assets/productpage/fuelcapacity.png'
import speed from '../../../assets/productpage/speed.png'
import bikecc from '../../../assets/productpage/bikecc.png'

const BikeKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  
  const specItems = [
    { label: 'Engine', value: kSpecs.engineCapacity, icon: bikecc },
    { label: 'Mileage', value: kSpecs.mileage, icon: speed },
    { label: 'Fuel', value: kSpecs.fuelType, icon: fuelCapacity }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  return (
    <div className="w-full px-2 md:px-4 py-6 bg-white">
      
      {/* Changed layout to flex-col and items-center to stack and center */}
      <div className="flex flex-col items-center gap-8 montserrat">
        
        {/* Heading - Centered and Full Width */}
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-black text-center w-full playfair-display">
          Key Specifications
        </h2>

        {/* Specifications Grid - Justified Center */}
        <div className="flex flex-wrap justify-center gap-6 w-full montserrat">
          {specItems.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
              <img className='w-16 h-auto object-contain' src={spec.icon} alt={spec.label} />
              <span className="text-lg md:text-xl font-bold text-black">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BikeKeyFeatures;