import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DestinationModal({ item, onClose, type = 'explore' }) {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && item) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isExplore = type === 'explore';
  const highlights = item.highlights ? item.highlights.split(',').map((h) => h.trim()) : [];
  
  const exploreLink =
    item.name === 'Darjeeling' || item.name === 'West Bengal'
      ? '/district/darjeeling?state=west-bengal'
      : `/coming-soon?title=${encodeURIComponent(item.name)}`;

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.mapQuery || `${item.name}, ${item.location || ''}`
  )}`;

  return (
    <div
      className={`detail-modal-overlay ${item ? 'active' : ''}`}
      id="detail-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="detail-modal-card">
        <button
          className="detail-modal-close"
          id="modal-close-btn"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="detail-modal-image">
          <img id="modal-img" src={item.img} alt={item.name} />
          <span className="detail-modal-badge" id="modal-badge">
            {item.badge || (isExplore ? 'Destination' : 'Attraction')}
          </span>
        </div>

        <div className="detail-modal-content">
          <h3 className="detail-modal-title" id="modal-title">{item.name}</h3>
          <span className="detail-modal-location" id="modal-location">
            {item.state || item.location}
          </span>
          <p className="detail-modal-desc" id="modal-desc">{item.desc}</p>

          {isExplore && (
            <div className="detail-modal-meta">
              {highlights.length > 0 && (
                <div className="detail-modal-meta-item">
                  <span className="detail-modal-meta-label">Highlights</span>
                  <div className="detail-modal-tags" id="modal-highlights">
                    {highlights.map((h, idx) => (
                      <span key={idx} className="detail-modal-tag">{h}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.best && (
                <div className="detail-modal-meta-item">
                  <span className="detail-modal-meta-label">Best Time to Visit</span>
                  <span className="detail-modal-meta-value" id="modal-best-time">{item.best}</span>
                </div>
              )}
            </div>
          )}

          <div className="detail-modal-actions">
            {isExplore ? (
              <Link to={exploreLink} className="btn btn-primary" id="modal-explore-link">
                Explore More &rarr;
              </Link>
            ) : (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id="modal-maps-link"
              >
                Open in Google Maps &rarr;
              </a>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              id="modal-dismiss-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
