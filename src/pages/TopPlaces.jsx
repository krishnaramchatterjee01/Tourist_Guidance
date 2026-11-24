import React, { useState, useEffect } from 'react';
import { topPlacesData } from '../data/topPlacesData';
import DestinationModal from '../components/DestinationModal';

const CATEGORIES = [
  { key: 'all', label: 'All Places' },
  { key: 'unesco', label: 'UNESCO Heritage' },
  { key: 'marvel', label: 'Architectural Marvels' },
  { key: 'nature', label: 'Natural Wonders' },
  { key: 'shrine', label: 'Sacred Shrines' }
];

export default function TopPlaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    document.title = "Explore India — India's Most Loved Destinations";
    window.scrollTo(0, 0);
  }, []);

  const filteredPlaces = topPlacesData.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);

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
          <span className="directory-badge">Timeless Indian Landmarks</span>
          <h1 className="directory-title">India's Most Loved Destinations</h1>
          <p className="directory-subtitle">
            Experience world-renowned architectural wonders, sacred sanctuaries, and awe-inspiring heritage sites across the nation.
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
              id="places-search-input"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iconic monuments, temples, or wonders..."
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="search-btn"
                id="places-search-clear"
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

      {/* ===== PLACES GRID SECTION ===== */}
      <main className="section" style={{ paddingTop: 0 }}>
        <div className="directory-stats-bar" style={{ maxWidth: '1200px', margin: '0 auto 32px' }}>
          <div className="directory-count">
            Showing <span id="visible-count">{filteredPlaces.length}</span> Iconic Attractions
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Interactive details &amp; direct Google Maps directions
          </div>
        </div>

        <div className="places-grid" id="places-grid">
          {filteredPlaces.map((item, idx) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              item.mapQuery || `${item.name}, ${item.location}`
            )}`;

            return (
              <div
                key={`${item.name}-${idx}`}
                className="place-card"
                data-category={item.category}
                data-name={item.name}
                data-loc={item.location}
                data-img={item.img}
                data-map={item.mapQuery}
              >
                <div className="card-image">
                  <img src={item.img} alt={item.name} loading="lazy" />
                </div>
                <div className="card-body">
                  <span className="type-badge">{item.badge}</span>
                  <h3>{item.name}</h3>
                  <span className="card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {item.location}
                  </span>
                  <p>{item.desc}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn explore-btn open-place-modal"
                      style={{ flex: 1 }}
                      onClick={() => setActiveModalItem(item)}
                    >
                      Details
                    </button>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '10px 16px' }}
                      title="View on Google Maps"
                    >
                      Maps ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="no-results-card" id="no-places-found" style={{ display: 'block' }}>
            <div className="no-results-icon">🔍</div>
            <h3>No Iconic Places Found</h3>
            <p id="no-places-text">
              We couldn't find any attractions matching your search. Please check your spelling or clear filters.
            </p>
            <button className="btn" id="reset-places-search-btn" type="button" onClick={handleReset}>
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      <DestinationModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        type="top-places"
      />
    </>
  );
}
