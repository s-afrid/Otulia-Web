import React from 'react';

const EstateFeatures = ({ item }) => {
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
            className={`text-sm md:text-base font-medium text-black ${isLink ? 'underline decoration-gray-400 cursor-pointer hover:text-gray-600' : ''
              }`}
          >
            {value}
          </span>
        </div>
      </div>
    );
  };

  const amenitiesList = ['Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Gym', 'Wine Cellar', 'Home Theater', 'Elevator'].filter(a => item?.amenities?.includes(a));
  const smartHomeList = ['Lighting', 'Climate', 'Entertainment', 'Voice Assistant', 'Blinds'].filter(s => item?.smartHomeSystems?.includes(s));

  return (
    <div className="w-full px-6 md:px-10 py-8 bg-white montserrat">

      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">Property Specifications</h3>

      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="columns-1 lg:columns-2 gap-x-16 space-y-0">

        {/* General Info & Location */}
        <div className="flex flex-col break-inside-avoid">
          {/* General Fields from "Estate Details" */}
          <SpecRow label="Property Name:" value={item?.propertyName || item?.title} />
          <SpecRow label="Property Type:" value={specs.propertyType || keySpecs.propertyType} />
          <SpecRow label="Listing Type:" value={item?.type} />
          <SpecRow label="Year Built:" value={specs.yearOfConstruction} />

          {/* Location Details */}
          <SpecRow
            label="Location:"
            value={item?.location || (specs.city && specs.country ? `${specs.city}, ${specs.country}` : null)}
            isLink
            icon={<span className="text-lg">📍</span>}
          />
          <SpecRow label="Address:" value={specs.address} />
          <SpecRow label="Neighborhood:" value={specs.areaNeighborhood} />
          <SpecRow label="Latitude:" value={specs.latitude} />
          <SpecRow label="Longitude:" value={specs.longitude} />
          <SpecRow label="Configuration:" value={specs.configuration} />
          <SpecRow label="Condition:" value={specs.condition} />
          <SpecRow label="Usage Status:" value={specs.usageStatus} />
        </div>

        {/* Amenities */}
        {amenitiesList.length > 0 && (
          <div className="pt-6 break-inside-avoid">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Amenities</h4>
            {amenitiesList.map(amenity => (
              <SpecRow key={amenity} label={amenity} value="Yes" />
            ))}
          </div>
        )}

        {/* Dimensions, Specs & Materials */}
        <div className="flex flex-col break-inside-avoid">
          {/* Dimensions */}
          <SpecRow label="Built-up Area:" value={specs.builtUpArea || keySpecs.builtUpArea} />
          <SpecRow label="Land Area:" value={specs.landArea || keySpecs.landArea} />

          {/* Room Counts */}
          <SpecRow label="Bedrooms:" value={specs.bedrooms || keySpecs.bedrooms} />
          <SpecRow label="Bathrooms:" value={specs.bathrooms || keySpecs.bathrooms} />
          <SpecRow label="Floors:" value={specs.floors || keySpecs.floors} />

          {/* Features & Finish */}
          <SpecRow label="Furnishing:" value={specs.furnishingStatus} />
          <SpecRow label="Architecture Style:" value={specs.architectureStyle} />
          <SpecRow label="Interior Material:" value={specs.interiorMaterial} />
          <SpecRow label="Interior Color Theme:" value={specs.interiorColorTheme} />
          <SpecRow label="Exterior Finish:" value={specs.exteriorFinish} />
          <SpecRow label="Climate Control:" value={specs.climateControl} />
        </div>

        {/* Smart Tech & Views */}
        {(smartHomeList.length > 0 || (item?.viewTypes && item.viewTypes.length > 0)) && (
          <div className="pt-6 break-inside-avoid">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Smart Home & Views</h4>
            {smartHomeList.map(tech => (
              <SpecRow key={tech} label={`${tech} Control:`} value="Yes" />
            ))}
            <SpecRow
              label="View Type:"
              value={item?.viewTypes?.length > 0 ? item.viewTypes.map(v => `${v} View`).join(', ') : null}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default EstateFeatures;