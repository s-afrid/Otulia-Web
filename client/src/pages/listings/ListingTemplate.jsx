import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SEO from '../../components/SEO';
import AssetCard from '../../components/AssetCard';
import Pagination from '../../components/Pagination';
import { FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 9;

const ListingTemplate = ({ pageTitle, pageDescription, breadcrumb = [], filterParams = {} }) => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);
  const filterKey = JSON.stringify(filterParams);

  const query = useMemo(() => {
    const filters = JSON.parse(filterKey);
    const routeType = filters.type;
    const params = new URLSearchParams({
      assetType: routeType === 'car' ? 'car' : 'estate',
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    if (routeType === 'car') {
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.model) params.set('model', filters.model);
    } else {
      if (filters.country) params.set('country', filters.country);
      if (filters.region) params.set('region', filters.region);
      if (routeType === 'island') params.set('propertyType', 'island');
    }

    return params.toString();
  }, [filterKey, page]);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/assets/landing-listings?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load listings for this page.');
        const result = await response.json();
        setListings(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Could not load listings.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchListings();
    return () => controller.abort();
  }, [query]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <SEO
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          ...breadcrumb,
        ]}
      />
      <Navbar />

      <div className="w-full bg-gray-50 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 transition-colors hover:text-[#D48D2A]">Home</Link>
            {breadcrumb.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                <FiChevronRight className="text-gray-400" />
                {item.path ? (
                  <Link to={item.path} className="text-gray-600 transition-colors hover:text-[#D48D2A]">{item.label}</Link>
                ) : (
                  <span className="font-medium text-[#D48D2A]">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main ref={resultsRef} className="w-full scroll-mt-4 bg-[#f9f9f9] px-4 py-10 sm:px-6 md:px-9 md:py-14">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-8 md:mb-12">
            <h1 className="canela mb-2 text-3xl font-normal text-black md:text-5xl">{pageTitle}</h1>
            <p className="max-w-3xl font-sans text-sm text-gray-500 md:text-base">{pageDescription}</p>
          </header>

          {loading ? (
            <div className="py-24 text-center text-gray-500" role="status">Loading listings…</div>
          ) : error ? (
            <div className="py-24 text-center text-red-600" role="alert">{error}</div>
          ) : listings.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => <AssetCard key={listing._id} item={listing} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="py-24 text-center text-gray-500">No active listings found for this page yet.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingTemplate;
