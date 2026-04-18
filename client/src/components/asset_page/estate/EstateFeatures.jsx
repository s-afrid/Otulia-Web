import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const EstateFeatures = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Safe access to nested objects
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper function to check if a value is valid
  const isValid = (value) => value && value !== "-" && value !== 0 && value !== "0";

  // 3. Collect all valid specifications into an array
  const allSpecs = [
    { label: "Property Name:", value: item?.propertyName || item?.title },
    { label: "Property Type:", value: specs.propertyType || keySpecs.propertyType },
    { label: "Listing Type:", value: item?.type },
    { label: "Year Built:", value: specs.yearOfConstruction },
    {
      label: "Location:",
      value: item?.location || (specs.city && specs.country ? `${specs.city}, ${specs.country}` : null),
      isLink: true,
      icon: <span className="text-lg">📍</span>
    },
    { label: "Address:", value: specs.address },
    { label: "Neighborhood:", value: specs.areaNeighborhood },
    { label: "Latitude:", value: specs.latitude },
    { label: "Longitude:", value: specs.longitude },
    { label: "Configuration:", value: specs.configuration },
    { label: "Condition:", value: specs.condition },
    { label: "Usage Status:", value: specs.usageStatus },
    { label: "Built-up Area:", value: specs.builtUpArea || keySpecs.builtUpArea },
    { label: "Land Area:", value: specs.landArea || keySpecs.landArea },
    { label: "Bedrooms:", value: specs.bedrooms || keySpecs.bedrooms },
    { label: "Bathrooms:", value: specs.bathrooms || keySpecs.bathrooms },
    { label: "Floors:", value: specs.floors || keySpecs.floors },
    { label: "Furnishing:", value: specs.furnishingStatus },
    { label: "Architecture Style:", value: specs.architectureStyle },
    { label: "Interior Material:", value: specs.interiorMaterial },
    { label: "Interior Color Theme:", value: specs.interiorColorTheme },
    { label: "Exterior Finish:", value: specs.exteriorFinish },
    { label: "Climate Control:", value: specs.climateControl },
  ].filter(spec => isValid(spec.value));

  // Add Amenities
  const amenitiesList = ['Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Gym', 'Wine Cellar', 'Home Theater', 'Elevator'].filter(a => item?.amenities?.includes(a));
  amenitiesList.forEach(amenity => {
    allSpecs.push({ label: amenity, value: "Yes" });
  });

  // Add Smart Tech & Views
  const smartHomeList = ['Lighting', 'Climate', 'Entertainment', 'Voice Assistant', 'Blinds'].filter(s => item?.smartHomeSystems?.includes(s));
  smartHomeList.forEach(tech => {
    allSpecs.push({ label: `${tech} Control:`, value: "Yes" });
  });

  if (item?.viewTypes?.length > 0) {
    allSpecs.push({
      label: "View Type:",
      value: item.viewTypes.map(v => `${v} View`).join(', ')
    });
  }

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
        <h3 className="text-2xl font-bold">Property Specifications</h3>
        {allSpecs.length > LIMIT * 2 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-black font-bold border-b-2 border-black hover:text-gray-600 hover:border-gray-600 transition-all text-sm uppercase tracking-widest"
          >
            View All
          </button>
        )}
      </div>

      {/* Grid Layout to ensure equal rows and no blank spaces */}
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
              <h2 className="text-2xl font-bold playfair-display">All Property Specifications</h2>
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

export default EstateFeatures;