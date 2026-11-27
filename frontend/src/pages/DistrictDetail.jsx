import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getDistrictDetails, getStateBySlug } from '../services/api';
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

  const stateHint = (searchParams.get('state') || 'west-bengal').toLowerCase().trim().replace(/_/g, '-');

  const [district, setDistrict] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSpot, setActiveSpot] = useState(null);

  const fetchDetails = useCallback((signal) => {
    setLoading(true);
    setError(null);

    Promise.all([
      getDistrictDetails(stateHint, slug, { signal }),
      getStateBySlug(stateHint, { signal })
    ])
      .then(([distData, stData]) => {
        setDistrict(distData);
        setStateData(stData);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to connect to the database');
          setLoading(false);
        }
      });
  }, [stateHint, slug]);

  useEffect(() => {
    const controller = new AbortController();
    fetchDetails(controller.signal);
    return () => controller.abort();
  }, [fetchDetails]);

  const stateName = district?.stateName || stateData?.name || 'West Bengal';
  const stateSlug = district?.stateSlug || stateData?.slug || stateHint;
  const backUrl = `/west-bengal.html?state=${stateSlug}`;

  useEffect(() => {
    if (district) {
      document.title = `${district.name} — Explore ${stateName} Tourism`;
    } else if (!loading) {
      document.title = 'District Not Found — Explore India';
    }
    window.scrollTo(0, 0);
  }, [district, stateName, loading]);

  const otherDistricts = useMemo(() => {
    if (!district || !stateData?.districts) return [];
    return stateData.districts
      .filter((d) => d.slug !== district.slug)
      .slice(0, 4);
  }, [district, stateData]);

  const rawBg = district?.heroImage || district?.image || `/images/states/${stateSlug}.jpg`;
  const heroBg = useBackgroundImage(rawBg);

  if (loading) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 113, 227, 0.2)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Loading district profile and tourist attractions...
          </p>
        </div>
      </main>
    );
  }

  if (error || !district) {
    return (
      <main>
        <div className="no-results-card" id="district-not-found" style={{ maxWidth: '600px', margin: '160px auto' }}>
          <div className="no-results-icon">🗺️</div>
          <h2>{error ? 'Service Unavailable' : 'District Not Found'}</h2>
          <p id="not-found-desc">
            {error || 'We could not find the requested district. Please select from our verified state district directories.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {error ? (
              <button className="btn" type="button" onClick={() => fetchDetails()} style={{ padding: '12px 24px' }}>
                Retry Connection
              </button>
            ) : (
              <>
                <Link to="/states.html" className="btn" style={{ padding: '12px 24px' }}>
                  Browse All 28 States
                </Link>
                <Link to="/west-bengal.html?state=andhra-pradesh" className="btn" style={{ padding: '12px 24px' }}>
                  Andhra Pradesh (28)
                </Link>
                <Link to="/west-bengal.html" className="btn" style={{ padding: '12px 24px' }}>
                  West Bengal (23)
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  const attractions = district.attractions || [];

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
              <strong>HQ:</strong> {district.headquarters || district.name}
            </span>
            <span className="meta-chip" id="chip-div">
              <strong>Division:</strong> {district.division}
            </span>
            <span className="meta-chip" id="chip-season">
              <strong>Best Time:</strong> {district.bestTimeToVisit || 'October to March'}
            </span>
            <span className="meta-chip" id="chip-spots">
              <strong>Attractions:</strong> {attractions.length} Popular Spots
            </span>
          </div>
        </div>
      </header>

      {/* ===== OVERVIEW & FAST FACTS SECTION ===== */}
      <section className="district-overview-section">
        <div className="district-overview-grid">
          <div className="overview-text-block">
            <span className="section-tag">District Profile</span>
            <h2 className="section-title">About {district.name}</h2>
            <p className="district-full-desc" id="district-full-desc">
              {district.fullDescription || district.shortDescription}
            </p>
          </div>

          <div className="facts-card">
            <h3>District Fast Facts</h3>
            <ul className="facts-list" id="facts-list">
              <li>
                <span className="fact-label">State</span>
                <span className="fact-val">{stateName}</span>
              </li>
              <li>
                <span className="fact-label">Administrative HQ</span>
                <span className="fact-val">{district.headquarters || district.name}</span>
              </li>
              <li>
                <span className="fact-label">Division</span>
                <span className="fact-val">{district.division}</span>
              </li>
              <li>
                <span className="fact-label">Best Visiting Season</span>
                <span className="fact-val">{district.bestTimeToVisit || 'October to March'}</span>
              </li>
              {district.knownFor && (
                <li>
                  <span className="fact-label">Celebrated For</span>
                  <span className="fact-val">{district.knownFor}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== POPULAR TOURIST ATTRACTIONS SECTION ===== */}
      <section className="district-attractions-section">
        <div className="attractions-header">
          <span className="section-tag">Explore Top Sights</span>
          <h2 className="section-title" id="attractions-title">
            Must-Visit Places in {district.name}
          </h2>
          <p className="section-subtitle">
            Curated list of prominent tourist landmarks, heritage monuments, and natural getaways.
          </p>
        </div>

        <div className="attractions-grid" id="attractions-grid">
          {attractions.length === 0 ? (
            <div className="no-attractions-card" id="no-attractions">
              <p>
                Comprehensive tourist attraction itineraries for {district.name} are currently being curated by our editorial team. Check back soon for detailed guides!
              </p>
            </div>
          ) : (
            attractions.map((spot, idx) => {
              const googleMapsUrl = spot.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                spot.mapQuery || `${spot.name}, ${district.name}, ${stateName}`
              )}`;

              return (
                <div key={`${spot.name}-${idx}`} className="attraction-card">
                  <div className="attraction-media">
                    <SmartImage src={spot.image} alt={spot.name} loading="lazy" />
                    <span className="attraction-category">{spot.category}</span>
                  </div>
                  <div className="attraction-body">
                    <h3 className="attraction-name">{spot.name}</h3>
                    <p className="attraction-desc">{spot.description}</p>
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
              const spotCount = od.attractionsCount || 0;
              const countText = spotCount > 0 ? `${spotCount} Popular Spots` : 'Directory Profile';

              return (
                <Link
                  key={od.slug}
                  to={`/district.html?name=${od.slug}&state=${stateSlug}`}
                  className="other-district-card"
                >
                  <SmartImage
                    src={od.thumbnailUrl || od.image}
                    alt={od.name}
                    loading="lazy"
                    onlineImageId={od.onlineImageId}
                    photographer={od.photographer}
                    license={od.license}
                  />
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
