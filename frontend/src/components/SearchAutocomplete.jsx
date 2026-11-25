import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDestinations } from '../services/api';

export default function SearchAutocomplete({ onCardMatch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const blurTimerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const trimmed = val.trim();

    if (!trimmed) {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      searchDestinations(trimmed, { signal: controller.signal, limit: 8 })
        .then((results) => {
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setActiveIndex(-1);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setSuggestions([]);
            setIsOpen(false);
          }
        });
    }, 250);
  };

  const selectItem = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    setActiveIndex(-1);

    if (item.url) {
      const target = item.url.startsWith('/') ? item.url : `/${item.url}`;
      navigate(target);
      return;
    }

    if (onCardMatch && onCardMatch(item.name)) {
      return;
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      selectItem(suggestions[activeIndex]);
      return;
    }

    if (suggestions.length > 0) {
      selectItem(suggestions[0]);
      return;
    }

    navigate(`/states.html?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectItem(suggestions[activeIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (suggestions.length > 0 && query.trim()) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div className="search-container" id="search-container" style={{ position: 'relative' }}>
      <div className="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        id="search-input"
        className="search-input"
        placeholder="Search destinations, states, or experiences..."
        autoComplete="off"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="autocomplete-dropdown"
      />

      <button
        type="button"
        id="search-button"
        className="search-btn"
        onClick={handleSearchSubmit}
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="autocomplete-dropdown"
          className="autocomplete-dropdown"
          role="listbox"
          style={{ display: 'block' }}
        >
          {suggestions.map((item, idx) => (
            <li
              key={item.id || `${item.name}-${idx}`}
              className={`autocomplete-item ${idx === activeIndex ? 'active' : ''}`}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={() => selectItem(item)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="item-name" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.name}
                </span>
                <span className="item-desc" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {item.subtitle || item.type}
                </span>
              </div>
              <span className="item-type-badge" style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '12px',
                background: 'rgba(0, 113, 227, 0.1)',
                color: 'var(--accent)'
              }}>
                {item.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
