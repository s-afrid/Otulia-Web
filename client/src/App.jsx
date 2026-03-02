import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Standard import for Home to ensure fast initial paint
import Home from "./pages/Home";

// Lazy imports for other pages
const CartPage = lazy(() => import("./pages/CartPage"));
const Shop = lazy(() => import("./pages/Shop"));
const Rent = lazy(() => import("./pages/Rent"));
const Community = lazy(() => import("./pages/Community"));
const Seller = lazy(() => import("./pages/Seller"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Categorty = lazy(() => import("./pages/Categorty"));
const Asset = lazy(() => import("./pages/Asset"));
const Blogs = lazy(() => import("./pages/Blogs"));

// Company pages
const About = lazy(() => import("./pages/company_pages/About"));
const Reviews = lazy(() => import("./pages/company_pages/Reviews"));
const FAQ = lazy(() => import("./pages/company_pages/FAQ"));

// Auth pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ContactSales = lazy(() => import("./pages/ContactSales"));

// User pages
const Profile = lazy(() => import("./pages/Profile"));
const Success = lazy(() => import("./pages/Success"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Favorites = lazy(() => import("./pages/Favorites"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DocumentViewer = lazy(() => import("./pages/DocumentViewer"));

// Policy pages
const Terms = lazy(() => import("./pages/policies/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const Shipping = lazy(() => import("./pages/policies/Shipping"));
const Returns = lazy(() => import("./pages/policies/Returns"));
const CookiePolicy = lazy(() => import("./pages/policies/CookiePolicy"));

import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";
import SplashScreen from "./components/SplashScreen";
import { CartProvider } from "./contexts/CartContext";

// Simple fallback while lazy components load
const PageLoader = () => <div className="w-full h-screen bg-white"></div>;

function App() {
  const location = useLocation();
  const hideFooterRoutes = ['/admin', '/admin/view-document', '/login', '/signup', '/inventory'];
  const shouldShowFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <CartProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/category/*" element={<Categorty />} />
          <Route path="/asset/:category/:id" element={<Asset />} />
          <Route path="/blogs" element={<Blogs />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Routes for company pages */}
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* User routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<Success />} />
          <Route path="/listings" element={<MyListings />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/view-document" element={<DocumentViewer />} />

          {/* Policy Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactSales />} />
        </Routes>
      </Suspense>
      {shouldShowFooter && <Footer />}
    </CartProvider>
  )
}

export default App
