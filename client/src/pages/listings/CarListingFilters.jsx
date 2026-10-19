const FILTERS = [
  { key: 'category', label: 'Category' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'priceRange', label: 'Price' },
  { key: 'bodyType', label: 'Body type' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'fuelType', label: 'Fuel type' },
  { key: 'exteriorColor', label: 'Exterior color' },
];

const OPTIONS = {
  category: (values) => values,
  model: (values) => values,
  year: (values) => values,
  priceRange: (values) => values,
  bodyType: ['SUV', 'Sedan', 'Coupe', 'Convertible', 'Roadster', 'Hatchback', 'Wagon', 'Truck'],
  transmission: ['Automatic', 'Manual', 'Semi-automatic'],
  fuelType: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
  exteriorColor: ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Gold', 'Other'],
};

const CarListingFilters = ({ filters, onChange, filterOptions, modelOptions, yearOptions, priceRanges, modelDisabled = false }) => {
  const optionValues = { category: Object.keys(filterOptions), model: modelOptions, year: yearOptions, priceRange: priceRanges };
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <section aria-label="Filter car listings" className="mb-8 border-y border-gray-200 py-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onChange({})}
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${hasFilters ? 'bg-[#171717] text-white hover:bg-black' : 'bg-[#171717] text-white'}`}>
            All filters
          </button>
          {FILTERS.map(({ key, label }) => (
            <label key={key} className="relative inline-flex">
              <span className="sr-only">{label}</span>
              <select value={filters[key] || ''} disabled={key === 'model' && modelDisabled} onChange={(event) => setFilter(key, event.target.value)}
                className={`min-h-11 min-w-[118px] appearance-none rounded-full border py-2.5 pl-4 pr-9 text-sm outline-none transition focus:border-gray-500 ${filters[key] ? 'border-gray-500 bg-gray-100 font-medium text-gray-900' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'}`}>
                <option value="">{label}</option>
                {(typeof OPTIONS[key] === 'function' ? OPTIONS[key](optionValues[key] || []) : OPTIONS[key] || [])
                  .filter((option, index, list) => option && list.indexOf(option) === index)
                  .map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </label>
          ))}
        </div>
        <label className="relative inline-flex shrink-0 xl:ml-auto">
          <span className="sr-only">Sort listings</span>
          <select value={filters.sort || ''} onChange={(event) => setFilter('sort', event.target.value)}
            className="min-h-11 min-w-[140px] appearance-none rounded-full border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-sm text-gray-800 outline-none hover:border-gray-400 focus:border-gray-500">
            <option value="">Sort by</option>
            <option value="Newest">Newest</option>
            <option value="Low to High">Price: low to high</option>
            <option value="High to Low">Price: high to low</option>
            <option value="Oldest">Oldest</option>
          </select>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </label>
      </div>
      {hasFilters && <p className="mt-3 text-xs text-gray-500">Filters update the listings automatically. Use “All filters” to clear them.</p>}
    </section>
  );
};

export default CarListingFilters;
