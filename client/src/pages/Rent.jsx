import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AssetCard from '../components/AssetCard'
import FilterBar from '../components/category_page/category_sections/cars/FilterBar'
import PropertyFilterBar from '../components/category_page/category_sections/estates/PropertyFilterBar'
import carFilterOptions from '../json/car_filter_options.json'
import bikeFilterOptions from '../json/bike_filter_options.json'
import yachtFilterOptions from '../json/yacht_filter_options.json'
import SharedFilterBar from '../components/SharedFilterBar';

const Rent = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const [searchParams] = useSearchParams();

  // EFFECT: Initialize filters from URL
  useEffect(() => {
    const loc = searchParams.get('location');
    if (loc) {
      setFilters(prev => ({ ...prev, location: loc }));
    }
  }, [searchParams]);

  // EFFECT: Reset filters when changing category
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      brand: '',
      model: '',
      category: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      architecture: '',
      priceRange: '',
    }));
  }, [activeCategory]);

  const categories = [
    { name: 'All', endpoint: 'combined' },
    { name: 'Cars', endpoint: 'cars' },
    { name: 'Real Estate', endpoint: 'estates' },
    { name: 'Bikes', endpoint: 'bikes' },
    { name: 'Yachts', endpoint: 'yachts' },
  ];

  useEffect(() => {
    fetchListings();
  }, [activeCategory, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const category = categories.find(c => c.name === activeCategory);
      const endpoint = category ? category.endpoint : 'combined';

      const params = new URLSearchParams();
      params.append('acquisition', 'rent');

      // Basic filters
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      // Advanced Filters from FilterBar
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.category && filters.category !== 'Any') {
        params.append('category', filters.category);
      }

      // Price Range Parsing
      if (filters.priceRange && filters.priceRange !== 'Any Price') {
        const pr = filters.priceRange;
        if (pr.includes('+')) {
          const min = parseInt(pr.replace(/£|\$|K|M|\+/g, '')) * (pr.includes('M') ? 1000000 : 1000);
          params.set('minPrice', min);
        } else if (pr.includes('–') || pr.includes('-')) {
          const [minStr, maxStr] = pr.split(/ – | - /);
          const min = parseInt(minStr.replace(/£|\$|K|M/g, '')) * (minStr.includes('M') ? 1000000 : 1000);
          const max = parseInt(maxStr.replace(/£|\$|K|M/g, '')) * (maxStr.includes('M') ? 1000000 : 1000);
          params.set('minPrice', min);
          params.set('maxPrice', max);
        }
      }

      // Property Filters
      if (filters.type && filters.type !== 'Any') params.append('propertyType', filters.type);
      if (filters.bedrooms && filters.bedrooms !== 'Any') params.append('bedrooms', filters.bedrooms.replace('+', ''));
      if (filters.bathrooms && filters.bathrooms !== 'Any') params.append('bathrooms', filters.bathrooms.replace('+', ''));
      if (filters.architecture && filters.architecture !== 'Any') params.append('architecture', filters.architecture);

      const response = await fetch(`/api/assets/${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch rental listings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className='relative w-full overflow-x-hidden pt-24 min-h-screen bg-white'>
      <Navbar hideSearch={true} />
      {/* Simple Hero */}
      <div className="bg-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 font-serif">Rent Exclusive Assets</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-sans">Experience luxury without ownership. Choose from our premium collection of cars, estates, yachts, and bikes.</p>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 relative z-10">
        {activeCategory === 'Real Estate' ? (
          <PropertyFilterBar onFilter={handleSearch} initialLocation={filters.location} />
        ) : activeCategory === 'Cars' ? (
          <FilterBar onFilter={handleSearch} filterOptions={carFilterOptions} priceRanges={['£50K – £100K', '£100K – £200K', '£200K – £400K', '£400K – £750K', '£750K – £1.5M', '£1.5M – £3M', '£3M+']} initialLocation={filters.location} />
        ) : activeCategory === 'Bikes' ? (
          <FilterBar onFilter={handleSearch} filterOptions={bikeFilterOptions} priceRanges={['£15K – £30K', '£30K – £60K', '£60K – £120K', '£120K – £250K', '£250K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Yachts' ? (
          <FilterBar onFilter={handleSearch} filterOptions={yachtFilterOptions} priceRanges={['£100K – £250K', '£250K – £500K', '£500K – £1M', '£1M – £2M', '£2M – £5M', '£5M+']} initialLocation={filters.location} />
        ) : (
          <SharedFilterBar onSearch={handleSearch} initialLocation={filters.location} />
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 py-8 overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap font-medium ${activeCategory === cat.name
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading rentals...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No rental listings found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((item, idx) => (
              <AssetCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rent
