import React, { useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Category_Navbar from '../components/category_page/Category_Navbar'; // Fixed path potentially
import Cars_Section from '../components/category_page/category_sections/cars/Cars_Section';
import Yacht_Section from '../components/category_page/category_sections/yachts/Yacht_Section';
import Bike_Section from '../components/category_page/category_sections/bikes/Bike_Section';
import Estate_Section from '../components/category_page/category_sections/estates/Estate_Section'
import SEO from '../components/SEO';
import { useSnackbar } from '../contexts/SnackbarContext';

const Categorty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (location.pathname.includes('/category/yachts') || location.pathname.includes('/category/bikes')) {
      showSnackbar("COMING SOON");
      navigate('/category/cars', { replace: true });
    }
  }, [location.pathname]);

  const getSeoData = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const categoryIndex = pathSegments.indexOf('category');
    const categorySegment = categoryIndex !== -1 && pathSegments[categoryIndex + 1] 
      ? pathSegments[categoryIndex + 1].toLowerCase() 
      : '';

    const categoryNames = {
      cars: 'Cars',
      estates: 'Estates',
      yachts: 'Yachts',
      bikes: 'Bikes',
    };

    const categoryName = categoryNames[categorySegment] || (categorySegment ? categorySegment.charAt(0).toUpperCase() + categorySegment.slice(1) : '');

    const searchParams = new URLSearchParams(location.search);
    const brand = searchParams.get('brand');
    const loc = searchParams.get('location');
    const type = searchParams.get('type');
    const acquisition = searchParams.get('acquisition');

    if (!categoryName) {
      return {
        title: 'Explore Luxury Collections',
        description: "Discover the world's most exclusive cars, yachts, estates, and bikes.",
      };
    }

    const isRent = acquisition && acquisition.toLowerCase() === 'rent';
    const actionPrefix = isRent ? 'Rent ' : '';

    let title = `${actionPrefix}Luxury ${categoryName}`;

    if (brand && loc) {
      title = `${actionPrefix}${brand} in ${loc} - Luxury ${categoryName}`;
    } else if (brand) {
      title = `${actionPrefix}${brand} - Luxury ${categoryName}`;
    } else if (loc) {
      title = `${actionPrefix}Luxury ${categoryName} in ${loc}`;
    } else if (type) {
      title = `${actionPrefix}${type} - Luxury ${categoryName}`;
    }

    return {
      title,
      description: `Discover exclusive luxury ${categoryName.toLowerCase()} on Otulia.`,
    };
  };

  const { title: seoTitle, description: seoDescription } = getSeoData();

  return (
    <div className='relative w-full overflow-x-hidden'>
      <SEO title={seoTitle} description={seoDescription} />
      <Category_Navbar />

      <Routes>
        {/* Default redirect: If user goes to just "/trending", send them to cars */}
        <Route path="/" element={<Navigate to="cars" replace />} />

        {/* Relative Paths: No need to repeat "/trending" */}
        {/* These will match /trending/cars, /trending/estates, etc. */}
        <Route path="cars" element={<Cars_Section />} />
        <Route path="estates" element={<Estate_Section />} />
        <Route path="yachts" element={<Yacht_Section />} />
        <Route path="bikes" element={<Bike_Section />} />
      </Routes>
    </div>
  )
}

export default Categorty

