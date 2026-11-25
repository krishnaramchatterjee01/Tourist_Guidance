import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import SmartImage from './common/SmartImage';

const SliderSection = forwardRef(function SliderSection(
  {
    id,
    className = 'section home-slider-section',
    ariaLabel,
    tag,
    title,
    subtitle,
    sliderType, // 'union-territories', 'explore', 'top-places'
    slides,
    bottomLink, // { url, text }
    interval = 3500,
    duration = 0.8
  },
  ref
) {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const autoplayTimerRef = useRef(null);
  const currentTimelineRef = useRef(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (prefersReducedMotion || document.hidden || slides.length <= 1) return;

    autoplayTimerRef.current = setTimeout(() => {
      goTo((currentIndexRef.current + 1) % slides.length, 'next');
    }, interval);
  };

  const setSlideInteractive = (slide, isInteractive) => {
    if (!slide) return;
    const focusables = slide.querySelectorAll('a, button, input, [tabindex]');
    focusables.forEach((el) => {
      if (isInteractive) {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
  };

  const goTo = (targetIndex, direction = 'next') => {
    if (isAnimatingRef.current) return;
    if (targetIndex === currentIndexRef.current) return;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    isAnimatingRef.current = true;
    stopAutoplay();

    const currSlide = slideRefs.current[currentIndexRef.current];
    const nextSlide = slideRefs.current[targetIndex];

    if (!currSlide || !nextSlide) {
      setCurrentIndex(targetIndex);
      isAnimatingRef.current = false;
      startAutoplay();
      return;
    }

    if (prefersReducedMotion) {
      currSlide.classList.remove('is-active');
      currSlide.setAttribute('aria-hidden', 'true');
      currSlide.style.visibility = 'hidden';
      setSlideInteractive(currSlide, false);

      nextSlide.classList.add('is-active');
      nextSlide.setAttribute('aria-hidden', 'false');
      nextSlide.style.visibility = 'visible';
      setSlideInteractive(nextSlide, true);

      setCurrentIndex(targetIndex);
      isAnimatingRef.current = false;
      startAutoplay();
      return;
    }

    if (currentTimelineRef.current) {
      currentTimelineRef.current.kill();
    }

    const outX = direction === 'next' ? -100 : 100;
    const inStartX = direction === 'next' ? 100 : -100;

    gsap.killTweensOf([currSlide, nextSlide]);
    gsap.set(nextSlide, { xPercent: inStartX, visibility: 'visible', zIndex: 2 });
    gsap.set(currSlide, { zIndex: 1 });

    currentTimelineRef.current = gsap.timeline({
      defaults: { duration, ease: 'power2.inOut' },
      onComplete: () => {
        gsap.set(currSlide, { visibility: 'hidden', zIndex: 0, xPercent: 100 });
        gsap.set(nextSlide, { zIndex: 1, xPercent: 0 });

        currSlide.classList.remove('is-active');
        currSlide.setAttribute('aria-hidden', 'true');
        setSlideInteractive(currSlide, false);

        nextSlide.classList.add('is-active');
        nextSlide.setAttribute('aria-hidden', 'false');
        setSlideInteractive(nextSlide, true);

        setCurrentIndex(targetIndex);
        isAnimatingRef.current = false;
        currentTimelineRef.current = null;
        startAutoplay();
      }
    });

    currentTimelineRef.current
      .to(currSlide, { xPercent: outX }, 0)
      .to(nextSlide, { xPercent: 0 }, 0);
  };

  useImperativeHandle(ref, () => ({
    revealCard: (name) => {
      const q = name.trim().toLowerCase();
      const idx = slides.findIndex((s) => {
        const dest = (s.destination || '').toLowerCase();
        const t = (s.title || '').toLowerCase();
        return dest.includes(q) || t.includes(q) || q.includes(dest) || q.includes(t);
      });
      if (idx !== -1) {
        if (idx !== currentIndexRef.current) {
          const dir = idx > currentIndexRef.current ? 'next' : 'prev';
          goTo(idx, dir);
        }
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return true;
      }
      return false;
    }
  }));

  // Initial GSAP setup
  useEffect(() => {
    slideRefs.current.forEach((slide, idx) => {
      if (!slide) return;
      if (idx === 0) {
        slide.classList.add('is-active');
        slide.setAttribute('aria-hidden', 'false');
        gsap.set(slide, { xPercent: 0, visibility: 'visible', zIndex: 1 });
        setSlideInteractive(slide, true);
      } else {
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
        gsap.set(slide, { xPercent: 100, visibility: 'hidden', zIndex: 0 });
        setSlideInteractive(slide, false);
      }
    });

    startAutoplay();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAutoplay();
      if (currentTimelineRef.current) currentTimelineRef.current.kill();
      gsap.killTweensOf(slideRefs.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slides]);

  // Touch Swipe
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let touchDeltaY = 0;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDeltaX = 0;
      touchDeltaY = 0;
      stopAutoplay();
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      touchDeltaY = e.touches[0].clientY - touchStartY;
    };

    const onTouchEnd = () => {
      const absX = Math.abs(touchDeltaX);
      const absY = Math.abs(touchDeltaY);

      if (absX > 40 && absX > absY) {
        if (touchDeltaX < 0) {
          goTo((currentIndexRef.current + 1) % slides.length, 'next');
        } else {
          goTo((currentIndexRef.current - 1 + slides.length) % slides.length, 'prev');
        }
      } else {
        startAutoplay();
      }
    };

    const onTouchCancel = () => startAutoplay();

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [slides]);

  const isUT = sliderType === 'union-territories';
  const isExplore = sliderType === 'explore';
  const isPlaces = sliderType === 'top-places';

  return (
    <section className={className} id={id} aria-label={ariaLabel}>
      <div className="section-header" data-animate="fade-up">
        <span className="section-tag">{tag}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      <div
        className="slider-container"
        data-slider={sliderType}
        ref={containerRef}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onFocusCapture={stopAutoplay}
        onBlurCapture={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget)) {
            startAutoplay();
          }
        }}
      >
        <div
          className="slider-viewport"
          ref={viewportRef}
          aria-live="off"
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
        >
          <div className="slider-track">
            {slides.map((slide, idx) => {
              if (isUT) {
                return (
                  <div
                    key={`${slide.title}-${idx}`}
                    ref={(el) => (slideRefs.current[idx] = el)}
                    className={`slider-slide carousel-card ${idx === 0 ? 'is-active' : ''}`}
                    role="group"
                    aria-roledescription="slide"
                    data-destination={slide.destination || slide.title}
                  >
                    <SmartImage
                      src={slide.image}
                      alt={slide.alt || slide.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="carousel-overlay">
                      <span className="type-badge ut">{slide.badge || 'Union Territory'}</span>
                      <h3>{slide.title}</h3>
                      <p>{slide.desc}</p>
                      <Link
                        to={slide.buttonUrl}
                        className="btn explore-btn"
                      >
                        {slide.buttonText || 'Explore Union Territory'}
                      </Link>
                    </div>
                  </div>
                );
              }

              if (isExplore) {
                return (
                  <div
                    key={`${slide.title}-${idx}`}
                    ref={(el) => (slideRefs.current[idx] = el)}
                    className={`slider-slide explore-card ${idx === 0 ? 'is-active' : ''}`}
                    role="group"
                    aria-roledescription="slide"
                    data-destination={slide.destination || slide.title}
                  >
                    <div className="card-image">
                      <SmartImage
                        src={slide.image}
                        alt={slide.alt || slide.title}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="card-body">
                      <span className="type-badge">{slide.badge}</span>
                      <h3>{slide.title}</h3>
                      <span className="card-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {slide.location}
                      </span>
                      <p>{slide.desc}</p>
                      <Link
                        to={slide.buttonUrl}
                        className="btn explore-btn"
                        data-place={slide.destination || slide.title}
                      >
                        {slide.buttonText || 'Explore Destination'}
                      </Link>
                    </div>
                  </div>
                );
              }

              // isPlaces
              return (
                <div
                  key={`${slide.title}-${idx}`}
                  ref={(el) => (slideRefs.current[idx] = el)}
                  className={`slider-slide place-card ${idx === 0 ? 'is-active' : ''}`}
                  role="group"
                  aria-roledescription="slide"
                  data-destination={slide.destination || slide.title}
                >
                  <div className="card-image">
                    <SmartImage
                      src={slide.image}
                      alt={slide.alt || slide.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="card-body">
                    <span className="type-badge">{slide.badge}</span>
                    <h3>{slide.title}</h3>
                    <span className="card-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {slide.location}
                    </span>
                    <p>{slide.desc}</p>
                    <Link
                      to={slide.buttonUrl}
                      className="btn explore-btn"
                      data-place={slide.destination || slide.title}
                    >
                      {slide.buttonText || 'Explore Wonder'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="slider-dots" role="tablist" aria-label={`${title} slider navigation`}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`slider-dot ${idx === currentIndex ? 'is-active' : ''}`}
              role="tab"
              aria-label={`Go to slide ${idx + 1} of ${slides.length}`}
              aria-selected={idx === currentIndex}
              onClick={(e) => {
                e.preventDefault();
                if (idx !== currentIndex) {
                  const dir = idx > currentIndex ? 'next' : 'prev';
                  goTo(idx, dir);
                }
              }}
            />
          ))}
        </div>
      </div>

      {bottomLink && (
        <div style={{ textAlign: 'center', marginTop: '36px' }} data-animate="fade-up">
          <Link to={bottomLink.url} className="btn btn-outline">
            {bottomLink.text}
          </Link>
        </div>
      )}
    </section>
  );
});

export default SliderSection;
