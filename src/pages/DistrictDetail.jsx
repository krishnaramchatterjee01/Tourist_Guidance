import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getDistrictBySlug, getStateData } from '../data/districtsData';
import AttractionModal from '../components/AttractionModal';
import SmartImage from '../components/common/SmartImage';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

export default function DistrictDetail() {
  const { districtSlug: paramSlug } = useParams();
  const [searchParams] = useSearchParams();

  const slug = (paramSlug || searchParams.get('name') || searchParams.get('district') || 'darjeeling')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-');

  const stateHint = searchParams.get('state') || '';

  const district = useMemo(() => {
    return getDistrictBySlug(slug, stateHint);
  }, [slug, stateHint]);

  const [activeSpot, setActiveSpot] = useState(null);

  const stateName = district?.stateName || 'West Bengal';
  const stateSlug = district?.stateSlug || 'west-bengal';
  const backUrl = `/west-bengal.html?state=${stateSlug}`;

  useEffect(() => {
    if (district) {
      document.title = `${district.name} — Explore ${stateName} Tourism`;
    } else {
      document.title = 'District Not Found — Explore India';
    }
    window.scrollTo(0, 0);
  }, [district, stateName]);

  const otherDistricts = useMemo(() => {
    if (!district) return [];
    const stateData = getStateData(stateSlug);
    if (!stateData?.districts) return [];
    return stateData.districts
      .filter((d) => d.slug !== district.slug)
      .slice(0, 4);
  }, [district, stateSlug]);

  const rawBg = district ? (district.heroImage || district.image) : '';
  const heroBg = useBackgroundImage(rawBg);

  if (!district) {
    return (
      <main>
        <div className="no-results-card" id="district-not-found" style={{ maxWidth: '600px', margin: '160px auto' }}>
          <div className="no-results-icon">🗺️</div>
          <h2>District Not Found</h2>
          <p id="not-found-desc">
            We could not find the requested district. Please select from our verified state district directories.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/states.html" className="btn" style={{ padding: '12px 24px' }}>
              Browse All 28 States
            </Link>
            <Link to="/west-bengal.html?state=andhra-pradesh" className="btn" style={{ padding: '12px 24px' }}>
              Andhra Pradesh (28)
            </Link>
            <Link to="/west-bengal.html" className="btn" style={{ padding: '12px 24px' }}>
              West Bengal (23)
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* ===== DISTRICT HERO BANNER ===== */}
      <header
        className="district-detail-hero"
        id="district-hero"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        <div className="district-hero-overlay"></div>

        <div className="district-hero-inner">
          {/* Back to State Button */}
          <Link to={backUrl} className="back-to-wb-btn" id="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span id="back-btn-text">Back to {stateName} Districts</span>
          </Link>

          {/* Breadcrumbs */}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <Link to={backUrl} id="breadcrumb-state-link">
              {stateName}
            </Link>
            <span className="separator">/</span>
            <span className="current" id="breadcrumb-district-name">
              {district.name}
            </span>
          </nav>

          <h1 className="district-hero-title" id="district-name">
            {district.name}
          </h1>
          <p className="district-hero-tagline" id="district-tagline">
            {district.tagline}
          </p>

          {/* District Meta Chips */}
          <div className="district-meta-chips" id="district-meta-chips">
            <span className="meta-chip" id="chip-hq">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"></path>
                <path d="M9 8h1"></path>
                <path d="M9 12h1"></path>
                <path d="M9 16h1"></path>
                <path d="M14 8h1"></path>
                <path d="M14 12h1"></path>
                <path d="M14 16h1"></path>
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
              </svg>
              <strong>HQ:</strong> <span id="val-hq">{district.headquarters || 'N/A'}</span>
            </span>
            <span className="meta-chip" id="chip-division">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span id="val-division">{district.division || 'N/A'}</span>
            </span>
            <span className="meta-chip" id="chip-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <strong>Best Time:</strong> <span id="val-time">{district.bestTimeToVisit || 'October – March'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ===== DISTRICT OVERVIEW SECTION ===== */}
      <section className="district-overview-section">
        <div className="district-overview-card">
          <h2>
            About <span id="overview-district-title">{district.name}</span>
          </h2>
          <p id="district-full-description">{district.fullDescription}</p>
        </div>
      </section>

      {/* ===== POPULAR TOURIST ATTRACTIONS SECTION ===== */}
      <section className="attractions-section">
        <div className="attractions-header">
          <span className="section-tag">Must-Visit Spots</span>
          <h2 className="section-title">Popular Tourist Attractions</h2>
          <p className="section-subtitle">
            Verified attractions, monuments, scenic viewpoints, and Google Maps navigations.
          </p>
        </div>

        <div className="attractions-grid" id="attractions-grid">
          {!district.attractions || district.attractions.length === 0 ? (
            <div
              className="no-attractions-card"
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                gridColumn: '1 / -1',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%'
              }}
            >
              <div style={{ fontSize: '2.4rem', marginBottom: '14px' }}>📍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Tourist destinations will be added soon.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Detailed verified spots, heritage monuments, and navigation guides for {district.name} district are being curated for this directory.
              </p>
              <Link
                to={backUrl}
                className="btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
              >
                &larr; Back to {stateName} Districts
              </Link>
            </div>
          ) : (
            district.attractions.map((spot, idx) => {
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                spot.mapsQuery || `${spot.name}, ${spot.location}`
              )}`;

              return (
                <div key={`${spot.name}-${idx}`} className="attraction-card">
                  <div className="attraction-media">
                    <SmartImage src={spot.image} alt={spot.name} loading="lazy" />
                    {spot.category && (
                      <span
                        className="attraction-category-badge"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          color: '#ffffff',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {spot.category}
                      </span>
                    )}
                  </div>
                  <div className="attraction-body">
                    <h3 className="attraction-name">{spot.name}</h3>
                    <span className="attraction-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {spot.location}
                    </span>
                    <p className="attraction-desc">{spot.description}</p>
                    <div className="attraction-highlights">
                      <strong>✨ Highlights:</strong> {spot.highlights}
                    </div>
                    {spot.accommodation && (
                      <div
                        className="attraction-stay"
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-tertiary)',
                          marginBottom: '18px',
                          lineHeight: 1.45,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: 'var(--accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          🏨 Stay:
                        </span>{' '}
                        <span>{spot.accommodation}</span>
                      </div>
                    )}
                    <div className="attraction-actions">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-maps"
                        aria-label={`View ${spot.name} on Google Maps`}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                          <line x1="8" y1="2" x2="8" y2="18"></line>
                          <line x1="16" y1="6" x2="16" y2="22"></line>
                        </svg>
                        Google Maps
                      </a>
                      <button
                        className="btn-detail open-modal-btn"
                        type="button"
                        onClick={() => setActiveSpot(spot)}
                        aria-label={`Explore details for ${spot.name}`}
                      >
                        Explore Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ===== OTHER DISTRICTS CAROUSEL SECTION ===== */}
      {otherDistricts.length > 0 && (
        <section className="other-districts-section">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <span className="section-tag">Continue Exploring</span>
            <h3 className="section-title" id="other-districts-title" style={{ fontSize: '2rem' }}>
              Other Districts in {stateName}
            </h3>
          </div>
          <div className="other-districts-grid" id="other-districts-grid">
            {otherDistricts.map((od) => {
              const spotCount = od.attractions?.length || 0;
              const countText = spotCount > 0 ? `${spotCount} Popular Spots` : 'Directory Profile';

              return (
                <Link
                  key={od.slug}
                  to={`/district.html?name=${od.slug}&state=${stateSlug}`}
                  className="other-district-card"
                >
                  <SmartImage src={od.image} alt={od.name} loading="lazy" />
                  <div className="other-district-overlay">
                    <h4>{od.name}</h4>
                    <p>{countText} • {od.headquarters}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Attraction Modal */}
      <AttractionModal spot={activeSpot} onClose={() => setActiveSpot(null)} />
    </main>
  );
}
