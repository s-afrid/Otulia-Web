import React from 'react';
import power from '../../../assets/productpage/power.png'
import speed from '../../../assets/productpage/speed.png'
import engine from '../../../assets/productpage/engine.png'

const CarKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  const specs = item?.specification || {};
  
  const specItems = [
    { label: 'Power', value: kSpecs.power || specs.power, icon: power },
    { label: 'Top Speed', value: kSpecs.topSpeed || specs.topSpeed, icon: speed },
    { label: 'Engine', value: kSpecs.engineType || specs.engineType || specs.engine, icon: engine }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  return (
    <div className="w-full px-2 md:px-4 py-6 bg-white self-center">

      {/* Changed flex-row to flex-col to stack title on top */}
      <div className="flex flex-col items-center gap-8">

        {/* Heading - Centered and full width */}
        <h2 className="text-2xl md:text-3xl font-bold playfair-display text-black text-center w-full">
          Key Specifications
        </h2>

        {/* Specifications Grid - Justified Center */}
        <div className="flex flex-wrap justify-center gap-6 w-full montserrat">
          {specItems.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
              <img className='w-12 h-auto object-contain' src={spec.icon} alt={spec.label} />
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

export default CarKeyFeatures;