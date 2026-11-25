import React, { forwardRef, useState, useRef } from 'react';
import defaultFallbackImage from '../../assets/images/destination-placeholder.svg';

// Safe terminal fallback (transparent 1x1 data URI) to prevent infinite loops if fallback fails
const TERMINAL_FALLBACK =
  'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201%201%22%2F%3E';

const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;

/**
 * SmartImage — Centralized, resilient image component with automatic fallback handling.
 *
 * Supports all standard <img> attributes, forwardRef, loading, decoding, fetchPriority,
 * srcSet, sizes, onLoad, and onError callbacks.
 * Never introduces extra wrapper elements; preserves exact DOM structure and CSS styles.
 */
const SmartImage = forwardRef(function SmartImage(
  {
    src,
    alt = '',
    className,
    style,
    fallbackSrc = defaultFallbackImage,
    srcSet,
    sizes,
    loading,
    decoding,
    fetchPriority,
    onLoad,
    onError,
    ...restProps
  },
  ref
) {
  const isOriginalValid = isValidString(src);

  // Track error state and fallback status
  const [imgState, setImgState] = useState({
    source: src,
    hasError: !isOriginalValid,
    fallbackFailed: false
  });

  // Track current source to discard stale asynchronous error events
  const currentSrcRef = useRef(src);

  // Sync state if src prop changes during component lifecycle
  if (imgState.source !== src) {
    currentSrcRef.current = src;
    setImgState({
      source: src,
      hasError: !isOriginalValid,
      fallbackFailed: false
    });
  }

  const handleError = (e) => {
    // Discard stale error events from previously rendered image sources
    if (imgState.source !== currentSrcRef.current) {
      return;
    }

    if (!imgState.hasError) {
      // Original image failed: switch to fallback image
      setImgState((prev) => ({
        ...prev,
        hasError: true
      }));
    } else {
      // Fallback image failed: enter safe terminal state to prevent loops
      if (!imgState.fallbackFailed) {
        setImgState((prev) => ({
          ...prev,
          fallbackFailed: true
        }));
      }
    }

    if (typeof onError === 'function') {
      onError(e);
    }
  };

  const handleLoad = (e) => {
    if (typeof onLoad === 'function') {
      onLoad(e);
    }
  };

  // Select effective source
  let effectiveSrc;
  if (imgState.fallbackFailed) {
    effectiveSrc = TERMINAL_FALLBACK;
  } else if (imgState.hasError) {
    effectiveSrc = fallbackSrc || defaultFallbackImage;
  } else {
    effectiveSrc = src;
  }

  // Prevent responsive image sources from overriding fallback if original failed
  const effectiveSrcSet = imgState.hasError ? undefined : srcSet;
  const effectiveSizes = imgState.hasError ? undefined : sizes;

  return (
    <img
      ref={ref}
      src={effectiveSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={effectiveSrcSet}
      sizes={effectiveSizes}
      onLoad={handleLoad}
      onError={handleError}
      data-fallback={imgState.hasError ? 'true' : undefined}
      {...restProps}
    />
  );
});

export default SmartImage;
export { defaultFallbackImage };
