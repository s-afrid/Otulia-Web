import React from 'react';

const CarFeatures = ({ item }) => {
  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper to format price
  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  // 3. Helper function to render a single row
  const SpecRow = ({ label, value, isLink = false, icon = null }) => {
    if (!value || value === "-" || value === 0 || value === "0") return null;

    return (
      <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 montserrat break-inside-avoid">
        <span className="text-gray-500 font-normal text-sm md:text-base">
          {label}
        </span>
        <div className="flex items-center gap-2 text-right">
          {icon && <span>{icon}</span>}
          <span
            className={`text-sm md:text-base font-medium text-black ${isLink ? 'underline decoration-gray-400 cursor-pointer hover:text-gray-600' : ''
              }`}
          >
            {value}
          </span>
        </div>
      </div>
    );
  };

  return (

    <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-8 bg-white montserrat">
      
      {/* Title (Optional, matches the form header style) */}
      <h3 className="text-2xl font-bold mb-6">Car Details</h3>

      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="columns-1 lg:columns-2 gap-x-16 space-y-0">
        
        {/* General Info */}
        <div className="flex flex-col break-inside-avoid">
          {/* Root Level Fields */}
          <SpecRow label="Make:" value={item?.brand} isLink />
          <SpecRow label="Model:" value={specs.model} isLink />
          <SpecRow label="Variant:" value={item?.variant || specs.variant} />
          <SpecRow label="Series:" value={specs.series} />
          <SpecRow label="Body:" value={specs.body} />
          <SpecRow label="Year:" value={specs.yearOfConstruction} />
          <SpecRow label="Listing Type:" value={item?.type} />
          
          {/* Location with Icon */}
          <SpecRow 
            label="Location:" 
            value={item?.location} 
            isLink 
            icon={<span className="text-lg">📍</span>}
          />
          
          <SpecRow label="Mileage:" value={specs.mileage} />

          <SpecRow label="Top Speed:" value={specs.topSpeed} />
          <SpecRow label="Power:" value={specs.power} />
          <SpecRow label="Engine Type:" value={specs.engineType || specs.engine} />
          <SpecRow label="Cylinder capacity:" value={specs.cylinderCapacity} />
          <SpecRow label="CO2 emissions:" value={specs.co2Emission} />
          <SpecRow label="Consumption:" value={specs.consumption} />
        </div>

        {/* Technical & Condition */}
        <div className="flex flex-col break-inside-avoid">
          <SpecRow label="Steering:" value={specs.steering} />
          <SpecRow label="Transmission:" value={specs.transmission} />
          <SpecRow label="Drive:" value={specs.drive} />
          <SpecRow label="Fuel:" value={specs.fuel} />
          <SpecRow label="Configuration:" value={specs.configuration} />
          <SpecRow label="Interior material:" value={specs.interiorMaterial} />
          <SpecRow label="Interior color:" value={specs.interiorColor} />
          <SpecRow label="Exterior color:" value={specs.exteriorColor} isLink />
          <SpecRow label="Manufacturer color code:" value={specs.manufacturerColorCode} />
          <SpecRow label="Matching numbers:" value={specs.matchingNumbers} />
          <SpecRow label="Condition:" value={specs.condition} />
          <SpecRow label="New / used:" value={specs.usageStatus} />
          <SpecRow label="Accident Free:" value={specs.accidentFree} />
          <SpecRow label="Accident History:" value={specs.accidentHistory} />
          <SpecRow label="Country of first delivery:" value={specs.countryOfFirstDelivery} />
          <SpecRow label="Number of vehicle owners:" value={specs.numberOfOwners} />
        </div>

      </div>
    </div>
  );
};

export default CarFeatures;