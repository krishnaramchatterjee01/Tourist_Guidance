import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SearchAutocomplete from '../components/SearchAutocomplete';
import SliderSection from '../components/SliderSection';
import { homeSlidersData } from '../data/homeSlidersData';

export default function Home() {
  const utSliderRef = useRef(null);
  const exploreSliderRef = useRef(null);
  const placesSliderRef = useRef(null);

  useEffect(() => {
    document.title = 'Explore India — Discover Breathtaking Destinations';

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const navbarInner = document.querySelector('.navbar-inner');
      const heroBadge = document.querySelector('.hero-badge');
      const heroTitle = document.querySelector('.hero-title');
      const heroSubtitle = document.querySelector('.hero-subtitle');
      const searchContainer = document.querySelector('.search-container');
      const firstSection = document.querySelector('#carousel-section');

      if (navbarInner) {
        heroTl.fromTo(
          navbarInner,
          { y: -35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform,opacity' },
          0.1
        );
      }

      if (heroBadge) {
        heroTl.fromTo(
          heroBadge,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: 'transform,opacity' },
          0.2
        );
      }

      if (heroTitle) {
        heroTl.fromTo(
          heroTitle,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform,opacity' },
          0.35
        );
      }

      if (heroSubtitle) {
        heroTl.fromTo(
          heroSubtitle,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, clearProps: 'transform,opacity' },
          0.5
        );
      }

      if (searchContainer) {
        heroTl.fromTo(
          searchContainer,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, clearProps: 'transform,opacity' },
          0.65
        );
      }

      if (firstSection) {
        heroTl.fromTo(
          firstSection,
          { opacity: 0 },
          { opacity: 1, duration: 1, clearProps: 'opacity' },
          0.8
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleCardMatch = (name) => {
    if (utSliderRef.current && utSliderRef.current.revealCard(name)) return true;
    if (exploreSliderRef.current && exploreSliderRef.current.revealCard(name)) return true;
    if (placesSliderRef.current && placesSliderRef.current.revealCard(name)) return true;
    return false;
  };

  // Ensure button URLs have leading slash for router navigation
  const formatSlides = (slides) => {
    return slides.map((s) => ({
      ...s,
      buttonUrl: s.buttonUrl?.startsWith('/') ? s.buttonUrl : `/${s.buttonUrl || ''}`
    }));
  };

  return (
    <main>
      {/* ===== 3. HERO SECTION WITH SEARCH ===== */}
      <header className="hero" id="hero">
        <div className="ambient-glow">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
          <div className="glow-3"></div>
        </div>

        <div className="hero-content">
          <span className="hero-badge">Discover Incredible India</span>
          <h1 className="hero-title">Experience the Timeless Soul of India</h1>
          <p className="hero-subtitle">
            Immerse yourself in centuries of living heritage, royal palaces, sacred ghats, tranquil backwaters, and pristine peaks.
          </p>

          <SearchAutocomplete onCardMatch={handleCardMatch} />
        </div>
      </header>

      {/* ===== 4. UNION TERRITORIES ADVERTISEMENT SLIDER ===== */}
      <SliderSection
        ref={utSliderRef}
        id="carousel-section"
        className="section carousel-section home-slider-section"
        ariaLabel="Union Territories Advertisement Slider"
        tag="Union Territories"
        title="Wonders Across India"
        subtitle="Discover the diverse landscapes and timeless heritage of India's 8 Union Territories."
        sliderType="union-territories"
        slides={formatSlides(homeSlidersData.unionTerritories)}
      />

      {/* ===== 5. DISCOVER YOUR NEXT ADVENTURE SLIDER ===== */}
      <SliderSection
        ref={exploreSliderRef}
        id="explore"
        className="section home-slider-section"
        ariaLabel="Featured Journeys Slider"
        tag="Featured Journeys"
        title="Discover Your Next Adventure"
        subtitle="Explore the most breathtaking destinations across India."
        sliderType="explore"
        slides={formatSlides(homeSlidersData.explore)}
        bottomLink={{ url: '/explore.html', text: 'Explore All Destinations' }}
      />

      {/* ===== 6. INDIA'S MOST LOVED DESTINATIONS SLIDER ===== */}
      <SliderSection
        ref={placesSliderRef}
        id="top-places"
        className="section home-slider-section"
        ariaLabel="Iconic Wonders Slider"
        tag="Iconic Wonders"
        title="India's Most Loved Destinations"
        subtitle="Discover timeless heritage, monumental architecture, and wonders celebrated around the world."
        sliderType="top-places"
        slides={formatSlides(homeSlidersData.topPlaces)}
        bottomLink={{ url: '/top-places.html', text: 'View All Iconic Attractions' }}
      />
    </main>
  );
}
