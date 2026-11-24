import React, { useEffect } from 'react';

export default function AttractionModal({ spot, onClose }) {
  useEffect(() => {
    if (spot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && spot) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [spot, onClose]);

  if (!spot) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    spot.mapsQuery || `${spot.name}, ${spot.location}`
  )}`;

  return (
    <div
      className={`attraction-modal-overlay ${spot ? 'active' : ''}`}
      id="attraction-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!spot}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="attraction-modal">
        <button
          className="modal-close-btn"
          id="modal-close-btn"
          aria-label="Close attraction details"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-media">
          <img id="modal-img" src={spot.image} alt={spot.name} />
        </div>

        <div className="modal-body">
          <h3 className="modal-title" id="modal-title">{spot.name}</h3>
          <span className="modal-location" id="modal-location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span id="modal-loc-text">{spot.location}</span>
          </span>

          <p className="modal-desc" id="modal-desc">{spot.description}</p>

          <div className="modal-highlights" id="modal-highlights">
            <strong>Key Highlights:</strong> <span id="modal-high-text">{spot.highlights || '-'}</span>
          </div>

          {spot.accommodation && (
            <div
              className="modal-accommodation"
              id="modal-accommodation"
              style={{
                display: 'block',
                marginBottom: '20px',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}
            >
              <strong>🏨 Verified Stays:</strong> <span id="modal-stay-text">{spot.accommodation}</span>
            </div>
          )}

          <a
            id="modal-maps-link"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-maps"
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            Open Location in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
