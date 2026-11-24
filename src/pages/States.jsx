import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { regionsData } from '../data/regionsData';
import SmartImage from '../components/common/SmartImage';

const TABS = [
  { key: 'all', label: 'All (36)' },
  { key: 'state', label: '28 States' },
  { key: 'ut', label: '8 Union Territories' }
];

export default function States() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.title = 'Explore India by State — 28 States & 8 Union Territories';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const filteredRegions = regionsData.filter((region) => {
    const q = searchQuery.trim().toLowerCase();
    const matchCategory = selectedCategory === 'all' || region.category === selectedCategory;
    const matchQuery =
      !q ||
      region.name.toLowerCase().includes(q) ||
      (region.capital && region.capital.toLowerCase().includes(q)) ||
      region.desc.toLowerCase().includes(q);

    return matchCategory && matchQuery;
  });

  const getTargetUrl = (region) => {
    const raw = region.buttonUrl || region.url;
    if (!raw) return '/states.html';
    return raw.startsWith('/') ? raw : `/${raw}`;
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchParams({});
  };

  return (
    <>
      {/* ===== DIRECTORY HERO ===== */}
      <header className="directory-hero">
        <div className="ambient-glow">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
          <div className="glow-3"></div>
        </div>

        <div className="directory-hero-content">
          <span className="directory-badge">Complete Pan-India Directory</span>
          <h1 className="directory-title">Explore India by State</h1>
          <p className="directory-subtitle">
            Discover the 28 vibrant states and 8 union territories of India, each rich in distinctive culture, heritage, and landscapes.
          </p>

          {/* Instant Filter Search Bar */}
          <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              id="state-search-input"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search states, capitals, or union territories..."
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="search-btn"
                id="state-search-clear"
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{ display: 'block' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Segmented Category Filter Tabs */}
          <div className="filter-tabs-container">
            <div className="filter-tabs" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`filter-tab ${selectedCategory === tab.key ? 'active' : ''}`}
                  data-category={tab.key}
                  role="tab"
                  onClick={() => setSelectedCategory(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN STATES GRID SECTION ===== */}
      <main className="section" style={{ paddingTop: 0 }}>
        <div className="directory-stats-bar" style={{ maxWidth: '1200px', margin: '0 auto 32px' }}>
          <div className="directory-count">
            Showing <span id="visible-count">{filteredRegions.length}</span> of 36 Regions
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Click any card to explore
          </div>
        </div>

        <div
          className="states-grid"
          id="states-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
        >
          {filteredRegions.map((region, idx) => {
            const targetUrl = getTargetUrl(region);
            return (
              <div
                key={`${region.name}-${idx}`}
                className="state-card"
                data-category={region.category}
                data-name={region.name}
                data-capital={region.capital}
                onClick={() => navigate(targetUrl)}
                style={{ cursor: 'pointer' }}
              >
                <SmartImage
                  src={region.image}
                  alt={region.alt || region.name}
                  loading="lazy"
                />
                <div className="state-overlay">
                  <h3>{region.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginBottom: '12px' }}>
                    {region.desc}
                  </p>
                  <Link
                    to={targetUrl}
                    className="btn state-btn"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {region.buttonText || (region.category === 'state' ? 'Explore Districts' : 'Explore Territory')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRegions.length === 0 && (
          <div className="no-results-card" id="no-states-found" style={{ display: 'block' }}>
            <div className="no-results-icon">🔍</div>
            <h3>No States or UTs Found</h3>
            <p id="no-states-text">
              We couldn't find any state or union territory matching your search. Try another query or clear filters.
            </p>
            <button className="btn" id="reset-state-search-btn" type="button" onClick={handleReset}>
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </main>
    </>
  );
}
