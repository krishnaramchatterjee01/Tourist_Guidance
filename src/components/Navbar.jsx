import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleSearchShortcut = (e) => {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchInput.focus(), 450);
      }
    } else {
      navigate('/#search');
    }
  };

  const isHomeActive = location.pathname === '/' || location.pathname === '/index.html';
  const isExploreActive = location.pathname.startsWith('/explore');
  const isStatesActive = location.pathname.startsWith('/states') || location.pathname.startsWith('/state') || location.pathname.includes('west-bengal');
  const isTopPlacesActive = location.pathname.startsWith('/top-places');

  return (
    <>
      {/* ===== 1. FLOATING GLASS NAVBAR ===== */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <span>Explore India</span>
          </Link>

          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : '')}>
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/states" className={({ isActive }) => (isActive || isStatesActive ? 'active' : '')}>
                States
              </NavLink>
            </li>
            <li>
              <NavLink to="/top-places" className={({ isActive }) => (isActive ? 'active' : '')}>
                Top Places
              </NavLink>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Search icon toggle (focuses homepage search bar) */}
            <button
              className="search-toggle"
              id="search-toggle-btn"
              onClick={handleSearchShortcut}
              aria-label="Open search bar"
              title="Search destinations"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Theme toggle (Dark / Light) */}
            <button
              className="theme-toggle"
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              type="button"
            >
              <svg className="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="21" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg className="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>

            {/* Hamburger toggle */}
            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              id="hamburger-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== 2. MOBILE MENU OVERLAY ===== */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} id="mobile-menu" aria-hidden={!isMobileMenuOpen}>
        <button className="mobile-menu-close" id="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu" type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/explore" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          Explore
        </NavLink>
        <NavLink to="/states" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive || isStatesActive ? 'active' : ''}`}>
          States
        </NavLink>
        <NavLink to="/top-places" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          Top Places
        </NavLink>
      </div>
    </>
  );
}
