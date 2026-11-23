/**
 * EXPLORE INDIA — CORE APPLICATION JAVASCRIPT
 * Apple-inspired luxury tourism platform
 * Modules: Theme, Floating Navbar, Mobile Menu, Autocomplete Search,
 *          Three Independent GSAP Advertisement Sliders, GSAP Reveal Animations
 */

(function () {
  'use strict';

  /* ============================================================
     1. THEME MANAGER (Light Frosted Glass & Dark Mode)
     ============================================================ */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');

    // Read stored theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    function updateAriaLabel(theme) {
      if (toggle) {
        toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        toggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }
    }

    updateAriaLabel(initialTheme);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.classList.add('transitioning');
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        updateAriaLabel(nextTheme);

        setTimeout(() => {
          document.body.classList.remove('transitioning');
        }, 400);
      });
    }
  }

  /* ============================================================
     2. FLOATING NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    if (!navbar) return;

    let isTicking = false;

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     3. NAVBAR SEARCH SHORTCUT TOGGLE & HASH FOCUS
     ============================================================ */
  function initNavbarSearchToggle() {
    const searchToggle = document.querySelector('.search-toggle') || document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('search-input');

    if (searchToggle && searchInput) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          searchInput.focus();
        }, 450);
      });
    }

    // If page is loaded with #search hash (e.g. redirected from other pages)
    if (window.location.hash === '#search' && searchInput) {
      setTimeout(() => {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }, 500);
    }
  }

  /* ============================================================
     4. MOBILE MENU OVERLAY
     ============================================================ */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn') || document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on clicking any link inside mobile menu
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ============================================================
     5. AUTOCOMPLETE SEARCH SYSTEM
     ============================================================ */
  function initSearch() {
    const input = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('search-btn');
    if (!input || !suggestionsBox) return;

    // Comprehensive Indian tourism dataset
    const searchDatabase = [
      // 28 Indian States
      { name: 'West Bengal', type: 'State', state: 'Eastern India', url: 'west-bengal.html' },
      { name: 'Rajasthan', type: 'State', state: 'Northern India', url: 'coming-soon.html?title=Rajasthan' },
      { name: 'Kerala', type: 'State', state: 'Southern India', url: 'coming-soon.html?title=Kerala' },
      { name: 'Himachal Pradesh', type: 'State', state: 'Northern India', url: 'coming-soon.html?title=Himachal%20Pradesh' },
      { name: 'Goa', type: 'State', state: 'Western Coast', url: 'coming-soon.html?title=Goa' },
      { name: 'Sikkim', type: 'State', state: 'Northeastern India', url: 'coming-soon.html?title=Sikkim' },
      { name: 'Meghalaya', type: 'State', state: 'Northeastern India', url: 'coming-soon.html?title=Meghalaya' },
      { name: 'Uttarakhand', type: 'State', state: 'Northern India', url: 'coming-soon.html?title=Uttarakhand' },
      { name: 'Karnataka', type: 'State', state: 'Southern India', url: 'coming-soon.html?title=Karnataka' },
      { name: 'Tamil Nadu', type: 'State', state: 'Southern India', url: 'coming-soon.html?title=Tamil%20Nadu' },
      { name: 'Maharashtra', type: 'State', state: 'Western India', url: 'coming-soon.html?title=Maharashtra' },
      { name: 'Punjab', type: 'State', state: 'Northern India', url: 'coming-soon.html?title=Punjab' },
      { name: 'Gujarat', type: 'State', state: 'Western India', url: 'coming-soon.html?title=Gujarat' },
      { name: 'Odisha', type: 'State', state: 'Eastern India', url: 'coming-soon.html?title=Odisha' },
      { name: 'Assam', type: 'State', state: 'Northeastern India', url: 'coming-soon.html?title=Assam' },
      { name: 'Madhya Pradesh', type: 'State', state: 'Central India', url: 'coming-soon.html?title=Madhya%20Pradesh' },
      { name: 'Telangana', type: 'State', state: 'Southern India', url: 'coming-soon.html?title=Telangana' },
      { name: 'Andhra Pradesh', type: 'State', state: 'Southern India', url: 'coming-soon.html?title=Andhra%20Pradesh' },

      // 8 Union Territories
      { name: 'Andaman & Nicobar', type: 'Union Territory', state: 'Bay of Bengal Islands', url: 'coming-soon.html?title=Andaman%20and%20Nicobar%20Islands' },
      { name: 'Chandigarh', type: 'Union Territory', state: 'The City Beautiful', url: 'coming-soon.html?title=Chandigarh' },
      { name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'Union Territory', state: 'Western Coast', url: 'coming-soon.html?title=Dadra%20and%20Nagar%20Haveli%20and%20Daman%20and%20Diu' },
      { name: 'Delhi', type: 'Union Territory', state: 'National Capital Territory', url: 'coming-soon.html?title=Delhi%20(National%20Capital%20Territory)' },
      { name: 'Jammu & Kashmir', type: 'Union Territory', state: 'Paradise on Earth', url: 'coming-soon.html?title=Jammu%20and%20Kashmir' },
      { name: 'Ladakh', type: 'Union Territory', state: 'Land of High Passes', url: 'coming-soon.html?title=Ladakh' },
      { name: 'Lakshadweep', type: 'Union Territory', state: 'Arabian Sea Coral Atolls', url: 'coming-soon.html?title=Lakshadweep' },
      { name: 'Puducherry', type: 'Union Territory', state: 'French Riviera of the East', url: 'coming-soon.html?title=Puducherry' },

      // Iconic Tourist Destinations
      { name: 'Taj Mahal', type: 'Tourist Wonder', state: 'Agra, Uttar Pradesh', url: 'top-places.html' },
      { name: 'Golden Temple', type: 'Tourist Wonder', state: 'Amritsar, Punjab', url: 'top-places.html' },
      { name: 'India Gate', type: 'Tourist Wonder', state: 'New Delhi', url: 'top-places.html' },
      { name: 'Hawa Mahal', type: 'Tourist Wonder', state: 'Jaipur, Rajasthan', url: 'top-places.html' },
      { name: 'Dal Lake', type: 'Tourist Wonder', state: 'Srinagar, Jammu & Kashmir', url: 'top-places.html' },
      { name: 'Victoria Memorial', type: 'Tourist Wonder', state: 'Kolkata, West Bengal', url: 'west-bengal.html' },
      { name: 'Udaipur', type: 'Destination', state: 'City of Lakes, Rajasthan', url: 'explore.html' },
      { name: 'Rishikesh', type: 'Destination', state: 'Ganges Valley, Uttarakhand', url: 'explore.html' },
      { name: 'Hampi', type: 'Destination', state: 'UNESCO Ruins, Karnataka', url: 'explore.html' },
      { name: 'Munnar', type: 'Destination', state: 'Tea Gardens, Kerala', url: 'explore.html' },
      { name: 'Darjeeling', type: 'District', state: 'Tea Hills, West Bengal', url: 'district.html?name=darjeeling' },
      { name: 'Manali', type: 'Destination', state: 'Snow Peaks, Himachal', url: 'explore.html' },
      { name: 'Varanasi', type: 'Destination', state: 'Sacred Ganges Ghats, UP', url: 'top-places.html' },

      // Popular PIN Codes
      { name: '110001', type: 'PIN Code', state: 'Connaught Place, New Delhi', url: 'coming-soon.html?title=PIN%20110001' },
      { name: '700001', type: 'PIN Code', state: 'BBD Bagh, Kolkata, West Bengal', url: 'west-bengal.html' },
      { name: '302001', type: 'PIN Code', state: 'Jaipur GPO, Rajasthan', url: 'coming-soon.html?title=Jaipur' },
      { name: '400001', type: 'PIN Code', state: 'Fort, Mumbai, Maharashtra', url: 'coming-soon.html?title=Mumbai' },
      { name: '682001', type: 'PIN Code', state: 'Kochi HPO, Kerala', url: 'coming-soon.html?title=Kochi' }
    ];

    let activeIndex = -1;
    let blurTimer = null;

    function isWestBengalQuery(val) {
      if (!val) return false;
      const clean = val.trim().toLowerCase();
      return clean === 'west bengal' || clean === 'westbengal' || clean === 'wb' || clean === 'bengal';
    }

    function isDarjeelingQuery(val) {
      if (!val) return false;
      const clean = val.trim().toLowerCase();
      return clean === 'darjeeling' || clean === 'darjeeling district';
    }

    function renderSuggestions(matches) {
      if (matches.length === 0) {
        suggestionsBox.innerHTML = `
          <div class="suggestion-item" style="justify-content: center; color: var(--text-tertiary); cursor: default;">
            <span>No destinations found matching your query</span>
          </div>`;
        suggestionsBox.classList.add('visible');
        return;
      }

      activeIndex = -1;
      suggestionsBox.innerHTML = matches.map((item, idx) => `
        <div class="suggestion-item" data-index="${idx}" data-name="${item.name}" data-url="${item.url || ''}">
          <span class="suggestion-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </span>
          <span class="suggestion-name">${item.name}</span>
          <span class="suggestion-type">${item.type}</span>
          <span class="suggestion-state">${item.state}</span>
        </div>
      `).join('');

      suggestionsBox.classList.add('visible');

      // Bind click handlers to newly created items
      suggestionsBox.querySelectorAll('.suggestion-item').forEach((itemEl) => {
        itemEl.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const name = itemEl.getAttribute('data-name');
          const targetUrl = itemEl.getAttribute('data-url');
          if (name) selectItem(name, targetUrl);
        });
      });
    }

    function hideSuggestions() {
      suggestionsBox.classList.remove('visible');
      suggestionsBox.innerHTML = '';
      activeIndex = -1;
    }

    function selectItem(name, directUrl) {
      input.value = name;
      hideSuggestions();

      // West Bengal redirection rule
      if (isWestBengalQuery(name)) {
        window.location.href = 'west-bengal.html';
        return;
      }

      // Darjeeling direct district redirection rule
      if (isDarjeelingQuery(name)) {
        window.location.href = 'district.html?name=darjeeling';
        return;
      }

      // Direct URL redirection if available
      if (directUrl) {
        window.location.href = directUrl;
        return;
      }

      // Check if there is an explore, place, or carousel card on the homepage
      const targetCard = Array.from(document.querySelectorAll('.explore-card, .place-card, .carousel-card')).find((card) => {
        const title = card.querySelector('h3');
        return title && title.textContent.trim().toLowerCase().includes(name.trim().toLowerCase());
      });

      if (targetCard) {
        // If the card is part of a homepage slider, reveal it first
        if (window.homepageSliders && window.homepageSliders.length) {
          for (const slider of window.homepageSliders) {
            if (slider.hasCard(targetCard)) {
              slider.revealCard(targetCard);
              break;
            }
          }
        }

        const scrollTarget = targetCard.closest('.slider-container, section') || targetCard;
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid var(--accent)';
        targetCard.style.outlineOffset = '6px';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 2200);
      } else {
        // Fallback: route to search in states directory
        window.location.href = `states.html?search=${encodeURIComponent(name)}`;
      }
    }

    // Input event
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        hideSuggestions();
        return;
      }

      const matches = searchDatabase.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.state.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      ).slice(0, 7);

      renderSuggestions(matches);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = suggestionsBox.querySelectorAll('.suggestion-item[data-name]');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveHighlight(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentQuery = input.value.trim();
        if (isWestBengalQuery(currentQuery)) {
          window.location.href = 'west-bengal.html';
          return;
        }
        if (isDarjeelingQuery(currentQuery)) {
          window.location.href = 'district.html?name=darjeeling';
          return;
        }
        if (activeIndex >= 0 && items[activeIndex]) {
          const name = items[activeIndex].getAttribute('data-name');
          const targetUrl = items[activeIndex].getAttribute('data-url');
          if (name) selectItem(name, targetUrl);
        } else if (items.length > 0) {
          const name = items[0].getAttribute('data-name');
          const targetUrl = items[0].getAttribute('data-url');
          if (name) selectItem(name, targetUrl);
        } else if (currentQuery) {
          selectItem(currentQuery);
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });

    function updateActiveHighlight(items) {
      items.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add('active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active');
        }
      });
    }

    input.addEventListener('blur', () => {
      blurTimer = setTimeout(hideSuggestions, 220);
    });

    input.addEventListener('focus', () => {
      clearTimeout(blurTimer);
      if (input.value.trim()) {
        input.dispatchEvent(new Event('input'));
      }
    });

    // Search button click handler
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const query = input.value.trim();
        if (!query) {
          input.focus();
        } else if (isWestBengalQuery(query)) {
          window.location.href = 'west-bengal.html';
        } else if (isDarjeelingQuery(query)) {
          window.location.href = 'district.html?name=darjeeling';
        } else {
          selectItem(query);
        }
      });
    }
  }

  /* ============================================================
     6. REUSABLE PREMIUM CAROUSEL CONTROLLER
        - Apple-inspired advertisement sliders
        - Single centered card resting state
        - GSAP synchronized horizontal slide transitions
        - Infinite looping
        - Independent autoplay with hover/focus pause & restart
        - Interactive navigation dots & mobile swipe support
        - Accessible keyboard & screen reader states
     ============================================================ */
  class PremiumCarousel {
    constructor(container, options = {}) {
      this.container = container;
      this.viewport = container.querySelector('.slider-viewport');
      this.track = container.querySelector('.slider-track');
      if (!this.viewport || !this.track) return;

      this.slides = Array.from(this.track.querySelectorAll('.slider-slide'));
      if (this.slides.length === 0) return;

      this.dotsContainer = container.querySelector('.slider-dots');
      this.intervalTime = options.interval || 3500;
      this.duration = options.duration || 0.8;
      this.ease = options.ease || 'power2.inOut';
      this.currentIndex = 0;
      this.isAnimating = false;
      this.autoplayTimer = null;
      this.dots = [];
      this.currentTimeline = null;
      this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Touch tracking
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchDeltaX = 0;
      this.touchDeltaY = 0;

      this.init();
    }

    init() {
      // Setup initial slide visibility, z-index, and accessibility
      this.slides.forEach((slide, idx) => {
        if (idx === 0) {
          slide.classList.add('is-active');
          slide.setAttribute('aria-hidden', 'false');
          if (typeof gsap !== 'undefined') {
            gsap.set(slide, { xPercent: 0, visibility: 'visible', zIndex: 1 });
          } else {
            slide.style.visibility = 'visible';
          }
          this.setSlideInteractive(slide, true);
        } else {
          slide.classList.remove('is-active');
          slide.setAttribute('aria-hidden', 'true');
          if (typeof gsap !== 'undefined') {
            gsap.set(slide, { xPercent: 100, visibility: 'hidden', zIndex: 0 });
          } else {
            slide.style.visibility = 'hidden';
          }
          this.setSlideInteractive(slide, false);
        }
      });

      // Build navigation dots
      this.buildDots();

      // Mobile Touch / Swipe
      this.initSwipe();

      // Pause on hover and keyboard focus
      this.initHoverAndFocus();

      // Pause on page tab hidden
      this.initVisibilityChange();

      // Start autoplay if reduced motion is not preferred
      this.startAutoplay();
    }

    setSlideInteractive(slide, isInteractive) {
      const focusables = slide.querySelectorAll('a, button, input, [tabindex]');
      focusables.forEach(el => {
        if (isInteractive) {
          el.removeAttribute('tabindex');
        } else {
          el.setAttribute('tabindex', '-1');
        }
      });
    }

    buildDots() {
      if (!this.dotsContainer) return;
      this.dotsContainer.innerHTML = '';
      this.dots = [];

      this.slides.forEach((slide, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1} of ${this.slides.length}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');

        dot.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.isAnimating || idx === this.currentIndex) return;
          this.stopAutoplay();
          const direction = idx > this.currentIndex ? 'next' : 'prev';
          this.goTo(idx, direction);
        });

        this.dotsContainer.appendChild(dot);
        this.dots.push(dot);
      });
    }

    updateDots() {
      this.dots.forEach((dot, idx) => {
        const isActive = idx === this.currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    initSwipe() {
      if (!this.viewport) return;

      this.viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchDeltaX = 0;
        this.touchDeltaY = 0;
        this.stopAutoplay();
      }, { passive: true });

      this.viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        this.touchDeltaX = e.touches[0].clientX - this.touchStartX;
        this.touchDeltaY = e.touches[0].clientY - this.touchStartY;
      }, { passive: true });

      this.viewport.addEventListener('touchend', () => {
        const absX = Math.abs(this.touchDeltaX);
        const absY = Math.abs(this.touchDeltaY);

        // Only trigger horizontal swipe if movement exceeds 40px and is predominantly horizontal
        if (absX > 40 && absX > absY) {
          if (this.touchDeltaX < 0) {
            this.next();
          } else {
            this.previous();
          }
        } else {
          this.startAutoplay();
        }
      }, { passive: true });

      this.viewport.addEventListener('touchcancel', () => {
        this.startAutoplay();
      }, { passive: true });
    }

    initHoverAndFocus() {
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
      this.container.addEventListener('focusin', () => this.stopAutoplay());
      this.container.addEventListener('focusout', (e) => {
        // If focus left the slider container entirely
        if (!this.container.contains(e.relatedTarget)) {
          this.startAutoplay();
        }
      });
    }

    initVisibilityChange() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAutoplay();
        } else {
          this.startAutoplay();
        }
      });
    }

    goTo(targetIndex, direction = 'next') {
      if (this.isAnimating) return;
      if (targetIndex === this.currentIndex) return;
      if (targetIndex < 0 || targetIndex >= this.slides.length) return;

      this.isAnimating = true;
      this.stopAutoplay();

      const currSlide = this.slides[this.currentIndex];
      const nextSlide = this.slides[targetIndex];

      // Handle reduced motion preference
      if (this.prefersReducedMotion || typeof gsap === 'undefined') {
        currSlide.classList.remove('is-active');
        currSlide.setAttribute('aria-hidden', 'true');
        currSlide.style.visibility = 'hidden';
        this.setSlideInteractive(currSlide, false);

        nextSlide.classList.add('is-active');
        nextSlide.setAttribute('aria-hidden', 'false');
        nextSlide.style.visibility = 'visible';
        this.setSlideInteractive(nextSlide, true);

        this.currentIndex = targetIndex;
        this.updateDots();
        this.isAnimating = false;
        this.startAutoplay();
        return;
      }

      // Synchronized GSAP transition
      if (this.currentTimeline) {
        this.currentTimeline.kill();
      }

      const outX = direction === 'next' ? -100 : 100;
      const inStartX = direction === 'next' ? 100 : -100;

      gsap.killTweensOf([currSlide, nextSlide]);
      gsap.set(nextSlide, { xPercent: inStartX, visibility: 'visible', zIndex: 2 });
      gsap.set(currSlide, { zIndex: 1 });

      this.currentTimeline = gsap.timeline({
        defaults: { duration: this.duration, ease: this.ease },
        onComplete: () => {
          gsap.set(currSlide, { visibility: 'hidden', zIndex: 0, xPercent: 100 });
          gsap.set(nextSlide, { zIndex: 1, xPercent: 0 });

          currSlide.classList.remove('is-active');
          currSlide.setAttribute('aria-hidden', 'true');
          this.setSlideInteractive(currSlide, false);

          nextSlide.classList.add('is-active');
          nextSlide.setAttribute('aria-hidden', 'false');
          this.setSlideInteractive(nextSlide, true);

          this.currentIndex = targetIndex;
          this.updateDots();
          this.isAnimating = false;
          this.currentTimeline = null;
          this.startAutoplay();
        }
      });

      this.currentTimeline
        .to(currSlide, { xPercent: outX }, 0)
        .to(nextSlide, { xPercent: 0 }, 0);
    }

    next() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.goTo(nextIndex, 'next');
    }

    previous() {
      const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goTo(prevIndex, 'prev');
    }

    startAutoplay() {
      this.stopAutoplay();
      if (this.prefersReducedMotion || document.hidden) return;

      this.autoplayTimer = setTimeout(() => {
        this.next();
      }, this.intervalTime);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearTimeout(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    hasCard(cardEl) {
      return this.slides.some(slide => slide === cardEl || slide.contains(cardEl));
    }

    revealCard(cardEl) {
      const idx = this.slides.findIndex(slide => slide === cardEl || slide.contains(cardEl));
      if (idx !== -1) {
        if (idx !== this.currentIndex) {
          const dir = idx > this.currentIndex ? 'next' : 'prev';
          this.goTo(idx, dir);
        }
        return true;
      }
      return false;
    }

    destroy() {
      this.stopAutoplay();
      if (this.currentTimeline) {
        this.currentTimeline.kill();
      }
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(this.slides);
      }
    }
  }

  /* ============================================================
     7. INITIALIZE HOMEPAGE SLIDERS
     ============================================================ */
  function initHomeSliders() {
    const sliderContainers = document.querySelectorAll('.home-slider-section .slider-container');
    if (!sliderContainers.length) return;

    window.homepageSliders = [];

    sliderContainers.forEach(container => {
      const slider = new PremiumCarousel(container, {
        interval: 3500,
        duration: 0.8,
        ease: 'power2.inOut'
      });
      window.homepageSliders.push(slider);
    });
  }

  /* ============================================================
     8. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
     ============================================================ */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const navbarInner = document.querySelector('.navbar-inner');
    if (navbarInner) {
      heroTl.from(navbarInner, { y: -35, opacity: 0, duration: 0.9 }, 0.1);
    }

    const heroBadge = document.querySelector('.hero-badge');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const searchContainer = document.querySelector('.search-container');
    const firstSection = document.querySelector('#carousel-section');

    if (heroBadge) heroTl.from(heroBadge, { y: 20, opacity: 0, duration: 0.7 }, 0.2);
    if (heroTitle) heroTl.from(heroTitle, { y: 35, opacity: 0, duration: 0.9 }, 0.35);
    if (heroSubtitle) heroTl.from(heroSubtitle, { y: 25, opacity: 0, duration: 0.8 }, 0.5);
    if (searchContainer) heroTl.from(searchContainer, { y: 25, opacity: 0, duration: 0.8 }, 0.65);
    if (firstSection) heroTl.from(firstSection, { opacity: 0, duration: 1 }, 0.8);

    // ScrollTrigger reveals (strictly excluding slider slides to prevent transform conflicts)
    if (typeof ScrollTrigger === 'undefined') return;

    const animatedItems = document.querySelectorAll('[data-animate]:not(.slider-slide)');

    animatedItems.forEach((el) => {
      const type = el.getAttribute('data-animate');
      const delay = parseFloat(el.getAttribute('data-delay')) || 0;

      let fromVars = { opacity: 0, y: 35 };

      switch (type) {
        case 'fade-up':
          fromVars = { opacity: 0, y: 40 };
          break;
        case 'fade-left':
          fromVars = { opacity: 0, x: -40 };
          break;
        case 'fade-right':
          fromVars = { opacity: 0, x: 40 };
          break;
        case 'zoom-in':
          fromVars = { opacity: 0, scale: 0.94 };
          break;
      }

      gsap.fromTo(el,
        { ...fromVars },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ============================================================
     9. INITIALIZATION
     ============================================================ */
  function initializeApp() {
    initTheme();
    initNavbarScroll();
    initNavbarSearchToggle();
    initMobileMenu();
    initSearch();
    initHomeSliders();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

})();