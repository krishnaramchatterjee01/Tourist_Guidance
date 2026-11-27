import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Explore from './pages/Explore';
import States from './pages/States';
import TopPlaces from './pages/TopPlaces';
import StateDirectory from './pages/StateDirectory';
import DistrictDetail from './pages/DistrictDetail';
import ComingSoon from './pages/ComingSoon';
import AdminImages from './pages/AdminImages';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change unless hash is present
  useEffect(() => {
    if (location.hash === '#search') {
      setTimeout(() => {
        const el = document.getElementById('search-input');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 350);
    } else if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />

        {/* Explore */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore.html" element={<Explore />} />

        {/* States & Union Territories */}
        <Route path="/states" element={<States />} />
        <Route path="/states.html" element={<States />} />

        {/* Top Places */}
        <Route path="/top-places" element={<TopPlaces />} />
        <Route path="/top-places.html" element={<TopPlaces />} />

        {/* State Directory (West Bengal & Dynamic State Portal) */}
        <Route path="/west-bengal.html" element={<StateDirectory />} />
        <Route path="/state/:stateSlug" element={<StateDirectory />} />
        <Route path="/states/:stateSlug" element={<StateDirectory />} />

        {/* District Detail */}
        <Route path="/district.html" element={<DistrictDetail />} />
        <Route path="/district/:districtSlug" element={<DistrictDetail />} />

        {/* Coming Soon */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/coming-soon.html" element={<ComingSoon />} />

        {/* Centralized Image System Admin Dashboard */}
        <Route path="/admin/images" element={<AdminImages />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
