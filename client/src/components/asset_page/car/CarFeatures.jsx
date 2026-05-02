import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const CarFeatures = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper function to check if a value is valid
  const isValid = (value) => value && value !== "-" && value !== 0 && value !== "0";

  // 3. Collect all valid specifications into an array
  const allSpecs = [
    { label: "Make:", value: item?.brand, isLink: true },
    { label: "Model:", value: specs.model, isLink: true },
    { label: "Variant:", value: item?.variant || specs.variant },
    { label: "Series:", value: specs.series },
    { label: "Body:", value: specs.body },
    { label: "Year:", value: specs.yearOfConstruction },
    { label: "Listing Type:", value: item?.type },
    { 
      label: "Location:", 
      value: item?.location, 
      isLink: true, 
      icon: <span className="text-lg">📍</span>
    },
    { label: "Mileage:", value: specs.mileage },
    { label: "Top Speed:", value: specs.topSpeed },
    { label: "Power:", value: specs.power },
    { label: "Engine Type:", value: specs.engineType || specs.engine },
    { label: "Cylinder capacity:", value: specs.cylinderCapacity },
    { label: "CO2 emissions:", value: specs.co2Emission },
    { label: "Consumption:", value: specs.consumption },
    { label: "Steering:", value: specs.steering },
    { label: "Transmission:", value: specs.transmission },
    { label: "Drive:", value: specs.drive },
    { label: "Fuel:", value: specs.fuel },
    { label: "Configuration:", value: specs.configuration },
    { label: "Interior material:", value: specs.interiorMaterial },
    { label: "Interior color:", value: specs.interiorColor },
    { label: "Exterior color:", value: specs.exteriorColor, isLink: true },
    { label: "Manufacturer color code:", value: specs.manufacturerColorCode },
    { label: "Matching numbers:", value: specs.matchingNumbers },
    { label: "Condition:", value: specs.condition },
    { label: "New / used:", value: specs.usageStatus },
    { label: "Accident Free:", value: specs.accidentFree },
    { label: "Accident History:", value: specs.accidentHistory },
    { label: "Country of first delivery:", value: specs.countryOfFirstDelivery },
    { label: "Number of vehicle owners:", value: specs.numberOfOwners },
  ].filter(spec => isValid(spec.value));

  // 4. Split allSpecs into two equal columns
  const midPoint = Math.ceil(allSpecs.length / 2);
  const leftColumnAll = allSpecs.slice(0, midPoint);
  const rightColumnAll = allSpecs.slice(midPoint);

  // 5. Limit visible items (e.g., 6 per column)
  const LIMIT = 6;
  const leftColumnVisible = leftColumnAll.slice(0, LIMIT);
  const rightColumnVisible = rightColumnAll.slice(0, LIMIT);

  const SpecRow = ({ label, value, isLink = false, icon = null }) => (
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

  return (
    <div className="w-full px-[2%] py-10 bg-white montserrat">
      <div className="flex justify-between items-end mb-10">
        <h3 className="text-2xl md:text-3xl font-normal canela text-black">Vehicle Specifications</h3>
        {allSpecs.length > LIMIT * 2 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-black font-bold border-b border-black hover:text-gray-600 hover:border-gray-600 transition-all text-[10px] uppercase tracking-[0.2em] pb-1"
          >
            View All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
        <div className="flex flex-col">
          {leftColumnVisible.map((spec, idx) => (
            <SpecRow key={idx} {...spec} />
          ))}
        </div>
        <div className="flex flex-col">
          {rightColumnVisible.map((spec, idx) => (
            <SpecRow key={idx} {...spec} />
          ))}
        </div>
      </div>

      {/* VIEW ALL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold canela">All Car Specifications</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {allSpecs.map((spec, idx) => (
                  <SpecRow key={idx} {...spec} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarFeatures;