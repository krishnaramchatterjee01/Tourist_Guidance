import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ComingSoon() {
  const [searchParams] = useSearchParams();
  const rawTitle = searchParams.get('title') || '';
  const decodedTitle = rawTitle ? decodeURIComponent(rawTitle) : 'Destination Coming Soon';

  useEffect(() => {
    document.title = `${decodedTitle} — Explore India`;
    window.scrollTo(0, 0);
  }, [decodedTitle]);

  return (
    <main>
      <header className="cs-hero">
        <div className="ambient-glow">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
          <div className="glow-3"></div>
        </div>

        <div className="cs-card">
          <div className="cs-icon">✨</div>
          <span className="hero-badge" style={{ marginBottom: '12px' }}>
            Curated Exploration Portal
          </span>
          <h1 className="cs-title" id="destination-title">
            {decodedTitle}
          </h1>
          <p className="cs-subtitle" id="destination-desc">
            Our travel research team is meticulously curating verified tourist spots, high-resolution photography, historical heritage insights, and Google Maps navigation for this destination.
          </p>

          <div className="cs-highlight-box">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Live &amp; Fully Interactive Now: West Bengal
            </h4>
            <p>
              You can currently explore all <strong>23 official districts of West Bengal</strong> with verified attractions, maps coordinates, and district search.
            </p>
          </div>

          <div className="cs-actions">
            <Link to="/west-bengal.html" className="btn" style={{ padding: '12px 28px' }}>
              Explore West Bengal (23 Districts)
            </Link>
            <Link to="/states.html" className="btn btn-outline" style={{ padding: '12px 28px' }}>
              All States &amp; UTs
            </Link>
            <Link to="/" className="btn btn-outline" style={{ padding: '12px 28px' }}>
              Return Home
            </Link>
          </div>
        </div>
      </header>
    </main>
  );
}
