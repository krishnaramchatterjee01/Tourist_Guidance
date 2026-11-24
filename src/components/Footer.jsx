import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span>Explore India</span>
          </Link>
          <p>
            Your premier Apple-inspired travel discovery platform for uncovering the culture, monuments, nature, and majestic diversity of India.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore Destinations</Link></li>
            <li><Link to="/states">States &amp; UTs</Link></li>
            <li><Link to="/top-places">Top Places</Link></li>
          </ul>
        </div>

        {/* Column 3: Explore States */}
        <div className="footer-column">
          <h4>Explore States</h4>
          <ul>
            <li><Link to="/state/west-bengal">West Bengal (23 Districts)</Link></li>
            <li><Link to="/state/andhra-pradesh">Andhra Pradesh (28 Districts)</Link></li>
            <li><Link to="/states">All 28 States</Link></li>
            <li><Link to="/states">8 Union Territories</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div className="footer-column">
          <h4>Contact &amp; Support</h4>
          <ul>
            <li><a href="mailto:hello@exploreindia.com">hello@exploreindia.com</a></li>
            <li><a href="tel:+911123456789">+91 11 2345 6789</a></li>
            <li><span>New Delhi, 110001, India</span></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="social-links">
          {/* Instagram */}
          <a href="#" className="social-link" aria-label="Instagram" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          {/* Twitter / X */}
          <a href="#" className="social-link" aria-label="Twitter / X" title="Twitter / X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="social-link" aria-label="Facebook" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" className="social-link" aria-label="YouTube" title="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
        <p className="copyright">&copy; 2026 Explore India. All rights reserved. Designed with Apple-inspired precision.</p>
      </div>
    </footer>
  );
}
