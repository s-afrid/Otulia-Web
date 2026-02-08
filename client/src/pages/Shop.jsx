import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard';
import SharedFilterBar from '../components/SharedFilterBar';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const categories = [
    { name: 'All', endpoint: 'combined' },
    { name: 'Cars', endpoint: 'cars' },
    { name: 'Real Estate', endpoint: 'estates' },
    { name: 'Bikes', endpoint: 'bikes' },
    { name: 'Yachts', endpoint: 'yachts' },
  ];

  useEffect(() => {
    fetchListings();
  }, [activeCategory, filters, query]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (query) { // If there's a search query, always use the combined endpoint
        endpoint = 'combined';
      } else { // Otherwise, use the category-specific endpoint
        const category = categories.find(c => c.name === activeCategory);
        endpoint = category ? category.endpoint : 'combined';
      }

      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (query) params.append('q', query);

      const response = await fetch(`/api/assets/${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
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
      <div className="bg-white text-black py-16 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 font-serif">
          {query ? `Search Results for "${query}"` : 'Luxury Collection'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans">
          {query ? `Showing results for your search query.` : 'Discover the world\'s most prestigious assets across all categories.'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-[-40px] relative z-10">
        <SharedFilterBar onSearch={handleSearch} />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 py-8 overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap font-medium ${activeCategory === cat.name
              ? 'bg-black text-white border-black shadow-lg'
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
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-500">Loading listings...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No assets found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item, idx) => (
              <AssetCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
