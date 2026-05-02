import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const YachtFeatures = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper function to check if a value is valid
  const isValid = (value) => value && value !== "-" && value !== 0 && value !== "0";

  // 3. Collect all valid specifications into an array
  const allSpecs = [
    { label: "Builder:", value: item?.builder || specs.brandBuilder, isLink: true },
    { label: "Model:", value: specs.model, isLink: true },
    { label: "Yacht Type:", value: specs.yachtType },
    { label: "Year:", value: specs.yearOfConstruction },
    { label: "Listing Type:", value: item?.type },
    { 
      label: "Location:", 
      value: item?.location, 
      isLink: true, 
      icon: <span className="text-lg">📍</span>
    },
    { label: "Length:", value: keySpecs.length || specs.length },
    { label: "Beam:", value: keySpecs.beam || specs.beam },
    { label: "Draft:", value: keySpecs.draft || specs.draft },
    { label: "Engine / Power:", value: specs.enginePower },
    { label: "Engine Type:", value: keySpecs.engineType || specs.engineType },
    { label: "Cruising Speed:", value: keySpecs.cruisingSpeed || specs.cruisingSpeed },
    { label: "Top Speed:", value: keySpecs.topSpeed || specs.topSpeed },
    { label: "Fuel Capacity:", value: keySpecs.fuelCapacity },
    { label: "Fuel Consumption:", value: specs.fuelConsumption },
    { label: "Usage Hours:", value: specs.usageHours },
    { label: "Condition:", value: specs.condition },
    { label: "Usage Status:", value: specs.usageStatus },
    { label: "Matching Numbers:", value: specs.matchingNumbers },
    { label: "Country of First Delivery:", value: specs.countryOfFirstDelivery },
    { label: "Number of Owners:", value: specs.numberOfOwners },
    { label: "Fuel Type:", value: specs.fuelType },
    { label: "Transmission:", value: specs.transmission },
    { label: "Hull Material:", value: specs.hullMaterial },
    { label: "Configuration:", value: specs.configuration },
    { label: "Interior Material:", value: specs.interiorMaterial },
    { label: "Interior Color:", value: specs.interiorColor },
    { label: "Exterior Color:", value: specs.exteriorColor, isLink: true },
    { label: "Manufacturer color code:", value: specs.manufacturerColorCode },
    { label: "Bedrooms / Cabins:", value: keySpecs.bedrooms },
    { label: "Guest Capacity:", value: keySpecs.guestCapacity || specs.guestCapacity },
    { label: "Crew Capacity:", value: keySpecs.crewCapacity || specs.crewCapacity },
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
        <h3 className="text-2xl md:text-3xl font-normal canela text-black">Yacht Specifications</h3>
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
              <h2 className="text-2xl font-bold canela">All Yacht Specifications</h2>
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

export default YachtFeatures;