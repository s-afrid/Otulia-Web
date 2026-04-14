import React from 'react';

const BikeFeatures = ({ item }) => {
  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper to format price
  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
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
            className={`text-sm md:text-base font-medium text-black ${
              isLink ? 'underline decoration-gray-400 cursor-pointer hover:text-gray-600' : ''
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
      
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">Bike Specifications</h3>

      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="columns-1 lg:columns-2 gap-x-16 space-y-0">
        
        {/* Identity, Engine & Chassis */}
        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">General Info</h4>
          <SpecRow label="Brand:" value={item?.brand || specs.brand} isLink />
          <SpecRow label="Model:" value={specs.model} isLink />
          <SpecRow label="Variant:" value={item?.variant || specs.variant} />
          <SpecRow label="Year:" value={specs.yearOfConstruction || specs.year} />
          <SpecRow label="Listing Type:" value={item?.type} />
          <SpecRow 
            label="Location:" 
            value={item?.location} 
            isLink 
            icon={<span className="text-lg">📍</span>}
          />
        </div>

        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">Engine & Performance</h4>
          <SpecRow label="Engine Type:" value={specs.engineType} />
          <SpecRow label="Engine Capacity:" value={keySpecs.engineCapacity || specs.engineCapacityCC} />
          <SpecRow label="Max Power:" value={specs.maxPower} />
          <SpecRow label="Max Torque:" value={specs.maxTorque} />
          <SpecRow label="Fuel System:" value={specs.fuelSystem} />
          <SpecRow label="Mileage:" value={keySpecs.mileage || specs.mileageKM} />
          <SpecRow label="Fuel Type:" value={keySpecs.fuelType || specs.fuelType} />
          <SpecRow label="Transmission:" value={keySpecs.transmission || specs.transmission} />
        </div>

        {/* Safety, Wheels & Condition */}
        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">Chassis & Suspension</h4>
          <SpecRow label="Frame:" value={specs.frame} />
          <SpecRow label="Front Suspension:" value={specs.frontSuspension} />
          <SpecRow label="Front Brake:" value={specs.frontBrake} />
          <SpecRow label="Rear Brake:" value={specs.rearBrake} />
        </div>

        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">Safety & Electronics</h4>
          <SpecRow label="ABS:" value={specs.abs} />
          <SpecRow label="Traction Control:" value={specs.tractionControl} />
          <SpecRow label="Ride Modes:" value={specs.rideModes} />
          <SpecRow label="Immobilizer:" value={specs.immobilizer} />
        </div>

        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">Wheels & Tyres</h4>
          <SpecRow label="Front Wheel:" value={specs.frontWheel} />
          <SpecRow label="Rear Wheel:" value={specs.rearWheel} />
          <SpecRow label="Tyre Type:" value={specs.tyreType} />
        </div>

        <div className="flex flex-col break-inside-avoid">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mt-4">Condition & Others</h4>
          <SpecRow label="Color:" value={keySpecs.color || specs.color} />
          <SpecRow label="Condition:" value={specs.condition || specs.usageStatus} />
          <SpecRow label="Ownership Count:" value={specs.ownershipCount} />
          <SpecRow label="Accident History:" value={specs.accidentHistory} />
        </div>

      </div>
    </div>
  );
};

export default BikeFeatures;