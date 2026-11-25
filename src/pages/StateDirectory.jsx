import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getStateData } from '../data/districtsData';
import { getDistrictImage } from '../data/districtImages';
import SmartImage from '../components/common/SmartImage';

export default function StateDirectory() {
  const { stateSlug: paramSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeSlug = (paramSlug || searchParams.get('state') || 'west-bengal')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-');

  const stateData = useMemo(() => {
    return getStateData(activeSlug);
  }, [activeSlug]);

  const [query, setQuery] = useState('');
  const [autocompleteMatches, setAutocompleteMatches] = useState([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);

  const allDistricts = stateData?.districts || [];
  const stateName = stateData?.state || 'West Bengal';
  const stateSlug = stateData?.slug || 'west-bengal';
  const totalCount = allDistricts.length;

  useEffect(() => {
    document.title = `Explore ${stateName} — ${totalCount} Districts | Explore India`;
    window.scrollTo(0, 0);
  }, [stateName, totalCount]);

  const filteredDistricts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allDistricts;

    return allDistricts.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        (d.headquarters && d.headquarters.toLowerCase().includes(q)) ||
        (d.division && d.division.toLowerCase().includes(q)) ||
        (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
        (d.tagline && d.tagline.toLowerCase().includes(q))
      );
    });
  }, [allDistricts, query]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const q = val.trim().toLowerCase();

    if (!q) {
      setAutocompleteMatches([]);
      setIsAutocompleteOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const matches = allDistricts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.headquarters && d.headquarters.toLowerCase().includes(q))
    ).slice(0, 6);

    setAutocompleteMatches(matches);
    setIsAutocompleteOpen(matches.length > 0);
    setActiveSuggestionIndex(-1);
  };

  const handleSelectDistrict = (d) => {
    setQuery(d.name);
    setIsAutocompleteOpen(false);
    navigate(`/district.html?name=${d.slug}&state=${stateSlug}`);
  };

  const handleReset = () => {
    setQuery('');
    setAutocompleteMatches([]);
    setIsAutocompleteOpen(false);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (isAutocompleteOpen && autocompleteMatches.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev + 1) % autocompleteMatches.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev - 1 + autocompleteMatches.length) % autocompleteMatches.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && autocompleteMatches[activeSuggestionIndex]) {
          handleSelectDistrict(autocompleteMatches[activeSuggestionIndex]);
        } else if (autocompleteMatches.length > 0) {
          handleSelectDistrict(autocompleteMatches[0]);
        }
        return;
      }
      if (e.key === 'Escape') {
        setIsAutocompleteOpen(false);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredDistricts.length > 0) {
        handleSelectDistrict(filteredDistricts[0]);
      }
    }
  };

  return (
    <>
      {/* ===== WEST BENGAL / STATE HERO ===== */}
      <header
        className="wb-hero has-state-bg"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.82) 100%), url('/images/states/${stateSlug}.jpg')`
        }}
      >
        <div className="ambient-glow">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
          <div className="glow-3"></div>
        </div>

        <div className="wb-hero-content">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <Link to="/states.html">States</Link>
            <span className="separator">/</span>
            <span className="current" id="breadcrumb-state">
              {stateName}
            </span>
          </nav>

          <span className="hero-badge" id="hero-badge">
            State Tourism Portal
          </span>
          <h1 className="wb-title" id="wb-title">
            Explore {stateName}
          </h1>
          <p className="wb-subtitle" id="wb-subtitle">
            {stateData.description || `Discover the Beauty of ${stateName}'s ${totalCount} Districts`}
          </p>

          {/* Key Quick Stats */}
          <div className="state-stats-bar" id="state-stats-bar">
            <div className="stat-item">
              <strong>{totalCount}</strong> Districts
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>{stateData.capital || 'Capital'}</strong> Capital
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>Official LGD</strong> Verified
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>Explore India</strong> Directory
            </div>
          </div>
        </div>
      </header>

      {/* ===== DISTRICT SEARCH SECTION ===== */}
      <section className="district-search-section">
        <div className="district-search-bar">
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            id="district-search-input"
            ref={searchInputRef}
            className="district-search-input"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={`Search districts in ${stateName}...`}
            autoComplete="off"
            spellCheck="false"
          />
          {/* Clear search button */}
          <button
            className="search-clear-btn"
            id="search-clear-btn"
            onClick={handleReset}
            aria-label="Clear search query"
            title="Clear"
            type="button"
            style={{ display: query ? 'flex' : 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Autocomplete Dropdown */}
          <div
            className={`district-autocomplete ${isAutocompleteOpen && autocompleteMatches.length > 0 ? 'visible' : ''}`}
            id="district-autocomplete"
          >
            {isAutocompleteOpen &&
              autocompleteMatches.map((d, idx) => {
                const spotCount = d.attractions?.length || 0;
                const spotText = spotCount > 0 ? `${spotCount} Spots` : 'Official District';
                return (
                  <div
                    key={`${d.slug}-${idx}`}
                    className={`district-suggestion-item ${idx === activeSuggestionIndex ? 'active' : ''}`}
                    data-slug={d.slug}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectDistrict(d);
                    }}
                  >
                    <span className="item-title">
                      📍 {d.name}
                    </span>
                    <span className="item-meta">
                      HQ: {d.headquarters || d.name} • {spotText}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Filter Counter Bar */}
        <div className="filter-summary">
          <span id="filter-status-text">
            Browse all {totalCount} official districts across {stateName}
          </span>
          <span className="district-counter-badge" id="district-counter">
            Showing {filteredDistricts.length} of {totalCount} Districts
          </span>
        </div>
      </section>

      {/* ===== DISTRICTS GRID ===== */}
      <main className="districts-container">
        <div className="districts-grid" id="districts-grid">
          {filteredDistricts.map((d) => {
            const hasAttractions = d.attractions && d.attractions.length > 0;
            const countText = hasAttractions ? `${d.attractions.length} Popular Spots` : 'Directory Profile';
            const targetUrl = `/district.html?name=${d.slug}&state=${stateSlug}`;

            return (
              <article
                key={d.slug}
                className="district-card"
                data-name={d.name.toLowerCase()}
                data-slug={d.slug}
                tabIndex={0}
                role="button"
                aria-label={`Explore ${d.name} district`}
                onClick={() => navigate(targetUrl)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(targetUrl);
                  }
                }}
              >
                <div className="district-card-media">
                  <SmartImage src={getDistrictImage(d, stateData)} alt={`${d.name} scenery`} loading="lazy" />
                  <span className="district-badge">{d.division || 'Official District'}</span>
                </div>
                <div className="district-card-body">
                  <h3 className="district-card-title">{d.name}</h3>
                  <span className="district-tagline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {d.tagline}
                  </span>
                  <p className="district-desc">{d.shortDescription}</p>
                  <div className="district-card-footer">
                    <span className="attractions-count">{countText}</span>
                    <Link
                      to={targetUrl}
                      className="district-card-btn"
                      tabIndex={-1}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explore District
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* No Match State */}
        {filteredDistricts.length === 0 && (
          <div className="no-results-card visible" id="no-results-card" style={{ display: 'block' }}>
            <div className="no-results-icon">🔍</div>
            <h3>No District Found</h3>
            <p id="no-results-text">
              We couldn't find any district matching your search. Please check your spelling or clear the search.
            </p>
            <button className="btn" id="reset-filter-btn" type="button" onClick={handleReset}>
              View All {totalCount} Districts
            </button>
          </div>
        )}
      </main>
    </>
  );
}
