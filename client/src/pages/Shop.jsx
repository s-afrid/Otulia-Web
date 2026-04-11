import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard';
import SharedFilterBar from '../components/SharedFilterBar';
import FilterBar from '../components/category_page/category_sections/cars/FilterBar';
import PropertyFilterBar from '../components/category_page/category_sections/estates/PropertyFilterBar';
import carFilterOptions from '../json/car_filter_options.json';
import bikeFilterOptions from '../json/bike_filter_options.json';
import yachtFilterOptions from '../json/yacht_filter_options.json';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const categories = [
    { name: 'All', endpoint: 'combined', clientName: 'All' },
    { name: 'Cars', endpoint: 'cars', clientName: 'Car' },
    { name: 'Real Estate', endpoint: 'estates', clientName: 'Estate' },
    { name: 'Bikes', endpoint: 'bikes', clientName: 'Bike' },
    { name: 'Yachts', endpoint: 'yachts', clientName: 'Yacht' },
  ];

  // Helper function to determine category
  const getCategoryFromItem = (item) => {
    if (item.category) {
      const cat = item.category.toLowerCase();
      if (['vehicles', 'car', 'carasset'].includes(cat)) return 'Car';
      if (['bikes', 'bike', 'bikeasset'].includes(cat)) return 'Bike';
      if (['yachts', 'yacht', 'yachtasset'].includes(cat)) return 'Yacht';
      if (['estates', 'estate', 'real estate', 'estateasset'].includes(cat)) return 'Estate';
    }
    return 'Unknown';
  };

  useEffect(() => {
    fetchData(page);
  }, [activeCategory, filters, query, page]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, filters, query]);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('acquisition', 'buy');
      params.append('page', pageNum);
      params.append('limit', 9);

      if (filters.location) params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      // Handle Price Range
      if (filters.priceRange && filters.priceRange !== 'Any Price') {
        const range = filters.priceRange.replace(/\$/g, '').replace(/,/g, '');
        if (range.includes('–') || range.includes('-')) {
          const parts = range.split(/[–-]/);
          const multiplier = (val) => val.includes('m') ? 1000000 : (val.includes('k') ? 1000 : 1);
          params.append('minPrice', parseFloat(parts[0]) * multiplier(parts[0].toLowerCase()));
          params.append('maxPrice', parseFloat(parts[1]) * multiplier(parts[1].toLowerCase()));
        } else if (range.includes('+')) {
          const val = range.replace('+', '').toLowerCase();
          params.append('minPrice', parseFloat(val) * (val.includes('m') ? 1000000 : (val.includes('k') ? 1000 : 1)));
        }
      }

      // Other filters
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.category && filters.category !== 'Any') params.append('category', filters.category);
      if (filters.type && filters.type !== 'Any') params.append('propertyType', filters.type);
      if (filters.bedrooms && filters.bedrooms !== 'Any') params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms && filters.bathrooms !== 'Any') params.append('bathrooms', filters.bathrooms);

      let endpoint = 'combined';
      if (!query) {
        const category = categories.find(c => c.name === activeCategory);
        endpoint = category ? category.endpoint : 'combined';
      } else {
        params.append('q', query);
      }

      const response = await fetch(`/api/assets/${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();

      let data = result.data || result;
      const pagination = result.pagination || { totalPages: 1 };

      // If in search mode and a category is selected (other than All), filter client-side
      if (query && activeCategory !== 'All') {
        const targetCategory = categories.find(c => c.name === activeCategory)?.clientName;
        data = data.filter(item => getCategoryFromItem(item) === targetCategory);
      }

      setListings(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className='relative w-full overflow-x-hidden pt-24 min-h-screen bg-white'>
      <SEO 
        title={query ? `Search: ${query}` : (activeCategory === 'All' ? 'Buy & Rent Luxury Assets' : `Shop Luxury ${activeCategory}`)}
        description={`Browse our exclusive collection of luxury ${activeCategory.toLowerCase()} for sale on Otulia.`}
      />
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
        {activeCategory === 'Real Estate' ? (
          <PropertyFilterBar onFilter={handleSearch} initialLocation={filters.location} />
        ) : activeCategory === 'Cars' ? (
          <FilterBar onFilter={handleSearch} filterOptions={carFilterOptions} priceRanges={['$50K – $100K', '$100K – $200K', '$200K – $400K', '$400K – $750K', '$750K – $1.5M', '$1.5M – $3M', '$3M+']} initialLocation={filters.location} />
        ) : activeCategory === 'Bikes' ? (
          <FilterBar onFilter={handleSearch} filterOptions={bikeFilterOptions} priceRanges={['$15K – $30K', '$30K – $60K', '$60K – $120K', '$120K – $250K', '$250K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Yachts' ? (
          <FilterBar onFilter={handleSearch} filterOptions={yachtFilterOptions} priceRanges={['$100K – $250K', '$250K – $500K', '$500K – $1M', '$1M – $2M', '$2M – $5M', '$5M+']} initialLocation={filters.location} />
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((item, idx) => (
                <AssetCard key={item._id} item={item} />
              ))}
            </div>

            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Shop;
