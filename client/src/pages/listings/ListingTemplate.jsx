import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SEO from '../../components/SEO';
import { FiChevronRight } from 'react-icons/fi';

const ListingTemplate = ({ 
  pageTitle, 
  pageDescription, 
  breadcrumb, 
  filterParams,
  children 
}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Build query string from filterParams
        const queryString = new URLSearchParams(filterParams).toString();
        const response = await fetch(`/api/listings?${queryString}`);
        
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filterParams]);

  return (
    <div className='relative w-full overflow-x-hidden'>
      <SEO 
        title={pageTitle}
        description={pageDescription}
      />
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="w-full bg-gray-50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-600 hover:text-[#D48D2A] transition-colors">
              Home
            </a>
            {breadcrumb.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <FiChevronRight className="text-gray-400" />
                {item.path ? (
                  <a 
                    href={item.path} 
                    className="text-gray-600 hover:text-[#D48D2A] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-[#D48D2A] font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="w-full px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {/* {pageTitle} */}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </div>

      {/* Content Area */}
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading listings...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <img 
                    src={listing.images?.[0] || '/placeholder.jpg'} 
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{listing.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#D48D2A]">
                        ${listing.price?.toLocaleString()}
                      </span>
                      <a 
                        href={`/asset/${listing.category}/${listing._id}`}
                        className="bg-[#D48D2A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#b8731f] transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No listings available in this category.</p>
            </div>
          )}
        </div>
      </div>

      {children && <div className="w-full">{children}</div>}
    </div>
  );
};

export default ListingTemplate;
