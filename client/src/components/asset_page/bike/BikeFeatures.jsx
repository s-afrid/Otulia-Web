import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const BikeFeatures = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper function to check if a value is valid
  const isValid = (value) => value && value !== "-" && value !== 0 && value !== "0";

  // 3. Collect all valid specifications into an array
  const allSpecs = [
    { label: "Brand:", value: item?.brand || specs.brand, isLink: true },
    { label: "Model:", value: specs.model, isLink: true },
    { label: "Variant:", value: item?.variant || specs.variant },
    { label: "Year:", value: specs.yearOfConstruction || specs.year },
    { label: "Listing Type:", value: item?.type },
    { 
      label: "Location:", 
      value: item?.location, 
      isLink: true, 
      icon: <span className="text-lg">📍</span>
    },
    { label: "Engine Type:", value: specs.engineType },
    { label: "Engine Capacity:", value: keySpecs.engineCapacity || specs.engineCapacityCC },
    { label: "Max Power:", value: specs.maxPower },
    { label: "Max Torque:", value: specs.maxTorque },
    { label: "Fuel System:", value: specs.fuelSystem },
    { label: "Mileage:", value: keySpecs.mileage || specs.mileageKM },
    { label: "Fuel Type:", value: keySpecs.fuelType || specs.fuelType },
    { label: "Transmission:", value: keySpecs.transmission || specs.transmission },
    { label: "Frame:", value: specs.frame },
    { label: "Front Suspension:", value: specs.frontSuspension },
    { label: "Front Brake:", value: specs.frontBrake },
    { label: "Rear Brake:", value: specs.rearBrake },
    { label: "ABS:", value: specs.abs },
    { label: "Traction Control:", value: specs.tractionControl },
    { label: "Ride Modes:", value: specs.rideModes },
    { label: "Immobilizer:", value: specs.immobilizer },
    { label: "Front Wheel:", value: specs.frontWheel },
    { label: "Rear Wheel:", value: specs.rearWheel },
    { label: "Tyre Type:", value: specs.tyreType },
    { label: "Color:", value: keySpecs.color || specs.color },
    { label: "Condition:", value: specs.condition || specs.usageStatus },
    { label: "Ownership Count:", value: specs.ownershipCount },
    { label: "Accident History:", value: specs.accidentHistory },
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
    <div className="w-full px-6 md:px-10 py-8 bg-white montserrat">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Bike Specifications</h3>
        {allSpecs.length > LIMIT * 2 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-black font-bold border-b-2 border-black hover:text-gray-600 hover:border-gray-600 transition-all text-sm uppercase tracking-widest"
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
              <h2 className="text-2xl font-bold playfair-display">All Bike Specifications</h2>
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

export default BikeFeatures;