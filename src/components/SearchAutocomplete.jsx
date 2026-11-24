import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDatabase, getStateDirectoryUrl, isDarjeelingQuery } from '../data/searchData';

export default function SearchAutocomplete({ onCardMatch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const blurTimerRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const trimmed = val.trim().toLowerCase();

    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const matches = searchDatabase.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(trimmed);
      const stateMatch = item.state ? item.state.toLowerCase().includes(trimmed) : false;
      const typeMatch = item.type ? item.type.toLowerCase().includes(trimmed) : false;
      return nameMatch || stateMatch || typeMatch;
    }).slice(0, 8);

    setSuggestions(matches);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const selectItem = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    setActiveIndex(-1);

    // 1. State directory check
    const stateUrl = getStateDirectoryUrl(item.name);
    if (stateUrl) {
      navigate(stateUrl);
      return;
    }

    // 2. Darjeeling direct check
    if (isDarjeelingQuery(item.name)) {
      navigate('/district.html?name=darjeeling');
      return;
    }

    // 3. Check homepage slider card match
    if (onCardMatch && onCardMatch(item.name)) {
      return;
    }

    // 4. Direct URL navigation
    if (item.url) {
      navigate(item.url);
      return;
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    // If an item in suggestions is highlighted with keyboard
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      selectItem(suggestions[activeIndex]);
      return;
    }

    // Check state directory
    const stateUrl = getStateDirectoryUrl(trimmed);
    if (stateUrl) {
      navigate(stateUrl);
      return;
    }

    // Check Darjeeling
    if (isDarjeelingQuery(trimmed)) {
      navigate('/district.html?name=darjeeling');
      return;
    }

    // Check homepage card match
    if (onCardMatch && onCardMatch(trimmed)) {
      setIsOpen(false);
      return;
    }

    // Find first matching item in search database
    const match = searchDatabase.find(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      selectItem(match);
      return;
    }

    // Fallback: search in states page
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

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (query.trim()) {
      handleInputChange({ target: { value: query } });
    }
  };

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          id="search-input"
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search Indian states, iconic monuments, heritage sites, or PIN codes..."
          autoComplete="off"
          spellCheck="false"
          aria-label="Search destinations"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        <button
          className="search-btn"
          id="search-btn"
          type="button"
          onClick={handleSearchSubmit}
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      <div
        className={`search-suggestions ${isOpen ? 'visible' : ''}`}
        id="search-suggestions"
        ref={suggestionsRef}
        role="listbox"
        aria-label="Search suggestions"
      >
        {isOpen && suggestions.length === 0 && (
          <div className="suggestion-item" style={{ justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'default' }}>
            <span>No destinations found matching your query</span>
          </div>
        )}

        {isOpen && suggestions.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={`suggestion-item ${idx === activeIndex ? 'active' : ''}`}
            data-index={idx}
            data-name={item.name}
            data-url={item.url || ''}
            onMouseDown={(e) => {
              e.preventDefault();
              selectItem(item);
            }}
            role="option"
            aria-selected={idx === activeIndex}
          >
            <span className="suggestion-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span className="suggestion-name">{item.name}</span>
            <span className="suggestion-type">{item.type}</span>
            <span className="suggestion-state">{item.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
