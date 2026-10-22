import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiSliders } from 'react-icons/fi';

// Each filter chip opens a small menu. `multi` filters keep a comma-separated list (e.g. amenities).
const FILTERS = [
  { key: 'type', label: 'Type', options: ['House', 'Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Estate', 'Chalet', 'Land', 'Castle', 'Chateau', 'Farm Ranch', 'Private Island'] },
  { key: 'priceRange', label: 'Price', options: ['$500K - $1M', '$1M - $2M', '$2M - $5M', '$5M - $10M', '$10M - $25M', '$25M+'] },
  { key: 'bedrooms', label: 'Beds', options: ['1+', '2+', '3+', '4+', '5+', '6+'] },
  { key: 'bathrooms', label: 'Baths', options: ['1+', '2+', '3+', '4+', '5+'] },
  { key: 'architecture', label: 'Style', options: ['Modern', 'Classic', 'Mediterranean', 'Colonial'] },
  { key: 'amenities', label: 'Amenities', multi: true, options: ['Pool', 'Garden', 'Terrace', 'Sea View', 'Waterfront', 'Beachfront', 'Garage', 'Fireplace', 'Wine Cellar', 'Fitness Center / Gym', 'Tennis Court', 'Helipad'] },
];

const EstateFilterBar = ({ filters, onChange, hideType = false }) => {
  const [openKey, setOpenKey] = useState(null);
  const barRef = useRef(null);

  // Close the open menu when clicking anywhere outside the bar.
  useEffect(() => {
    const close = (event) => { if (!barRef.current?.contains(event.target)) setOpenKey(null); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const visibleFilters = FILTERS.filter((filter) => !(hideType && filter.key === 'type'));
  const activeCount = visibleFilters.filter((filter) => filters[filter.key]).length + (filters.acquisition === 'rent' ? 1 : 0);

  const selectOption = (filter, option) => {
    if (filter.multi) {
      const current = filters[filter.key] ? filters[filter.key].split(',') : [];
      const next = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
      onChange({ ...filters, [filter.key]: next.join(',') });
      return;
    }
    onChange({ ...filters, [filter.key]: filters[filter.key] === option ? '' : option });
    setOpenKey(null);
  };

  const chipLabel = (filter) => {
    const value = filters[filter.key];
    if (!value) return filter.label;
    if (filter.multi) return `${filter.label} (${value.split(',').length})`;
    return filter.key === 'bedrooms' ? `${value} Beds` : filter.key === 'bathrooms' ? `${value} Baths` : value;
  };

  const clearAll = () => onChange(hideType ? { type: filters.type, sort: filters.sort } : { sort: filters.sort });

  return (
    <div ref={barRef} className="relative z-30 flex flex-wrap items-center gap-2 border-b border-gray-200 py-3">
      <span className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#111] px-4 text-sm font-medium text-white">
        <FiSliders /> Filters
        {activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black">{activeCount}</span>}
      </span>

      {/* Buy / Rent toggle */}
      <div className="flex h-9 shrink-0 rounded-full border border-gray-300 p-0.5">
        {['buy', 'rent'].map((mode) => {
          const active = (filters.acquisition || 'buy') === mode;
          return (
            <button key={mode} type="button" onClick={() => onChange({ ...filters, acquisition: mode === 'rent' ? 'rent' : '' })}
              className={`rounded-full px-3.5 text-sm capitalize transition ${active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              {mode}
            </button>
          );
        })}
      </div>

      {visibleFilters.map((filter) => {
        const isActive = Boolean(filters[filter.key]);
        const isOpen = openKey === filter.key;
        const selected = filters[filter.key] ? filters[filter.key].split(',') : [];
        return (
          <div key={filter.key} className="relative shrink-0">
            <button type="button" onClick={() => setOpenKey(isOpen ? null : filter.key)} aria-expanded={isOpen}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm transition ${isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-800 hover:border-gray-900'}`}>
              {chipLabel(filter)}
              <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                <ul className="max-h-72 overflow-y-auto">
                  {filter.options.map((option) => {
                    const checked = selected.includes(option);
                    return (
                      <li key={option}>
                        <button type="button" onClick={() => selectOption(filter, option)}
                          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          {filter.key === 'bedrooms' || filter.key === 'bathrooms' ? `${option} ${filter.label}` : option}
                          {checked && <FiCheck className="text-gray-900" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {isActive && (
                  <button type="button" onClick={() => { onChange({ ...filters, [filter.key]: '' }); setOpenKey(null); }}
                    className="mt-1 w-full border-t border-gray-100 px-4 pt-2 text-left text-sm font-medium text-gray-900 underline">
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="shrink-0 px-2 text-sm font-medium text-gray-900 underline underline-offset-4">
          Clear all
        </button>
      )}
    </div>
  );
};

export default EstateFilterBar;
