import React, { useState, useEffect } from 'react';
import { exploreData } from '../data/exploreData';
import DestinationModal from '../components/DestinationModal';
import SmartImage from '../components/common/SmartImage';

const CATEGORIES = [
  { key: 'all', label: 'All Destinations' },
  { key: 'mountains', label: 'Mountains & Valleys' },
  { key: 'heritage', label: 'Royal Heritage' },
  { key: 'coastal', label: 'Coastal & Beaches' },
  { key: 'spiritual', label: 'Spiritual & Sacred' }
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    document.title = 'Explore India — Curated Indian Travel Destinations';
    window.scrollTo(0, 0);
  }, []);

  const filteredDestinations = exploreData.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      (item.highlights && item.highlights.toLowerCase().includes(q));

    return matchCategory && matchQuery;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
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
          <span className="directory-badge">Curated Indian Travel Experiences</span>
          <h1 className="directory-title">Discover Your Next Adventure</h1>
          <p className="directory-subtitle">
            Explore breathtaking getaways across India, curated by landscape and travel style.
          </p>

          {/* Search Bar */}
          <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              id="explore-search-input"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, states, or themes..."
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="search-btn"
                id="explore-search-clear"
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{ display: 'block' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="filter-tabs-container">
            <div className="filter-tabs" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`filter-tab ${selectedCategory === cat.key ? 'active' : ''}`}
                  data-category={cat.key}
                  role="tab"
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ===== DESTINATIONS GRID SECTION ===== */}
      <main className="section" style={{ paddingTop: 0 }}>
        <div className="directory-stats-bar" style={{ maxWidth: '1200px', margin: '0 auto 32px' }}>
          <div className="directory-count">
            Showing <span id="visible-count">{filteredDestinations.length}</span> Destinations
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Click any card to view details
          </div>
        </div>

        <div className="explore-grid" id="explore-grid">
          {filteredDestinations.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="explore-card"
              data-category={item.category}
              data-name={item.name}
              data-state={item.state}
              data-img={item.img}
              data-best={item.best}
              data-highlights={item.highlights}
            >
              <div className="card-image">
                <SmartImage src={item.img} alt={item.name} loading="lazy" />
              </div>
              <div className="card-body">
                <span className="type-badge">{item.badge}</span>
                <h3>{item.name}</h3>
                <span className="card-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {item.state}
                </span>
                <p>{item.desc}</p>
                <button
                  type="button"
                  className="btn explore-btn open-modal-btn"
                  onClick={() => setActiveModalItem(item)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="no-results-card" id="no-explore-found" style={{ display: 'block' }}>
            <div className="no-results-icon">🔍</div>
            <h3>No Destinations Found</h3>
            <p id="no-explore-text">
              We couldn't find any destinations matching your search. Please check your spelling or clear filters.
            </p>
            <button className="btn" id="reset-explore-search-btn" type="button" onClick={handleReset}>
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      <DestinationModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        type="explore"
      />
    </>
  );
}
