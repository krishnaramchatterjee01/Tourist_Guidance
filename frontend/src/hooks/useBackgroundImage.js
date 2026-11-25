import { useState, useEffect } from 'react';
import defaultFallbackImage from '../assets/images/destination-placeholder.svg';

const isValidString = (val) => typeof val === 'string' && val.trim().length > 0;

/**
 * useBackgroundImage — Reusable React hook for handling CSS background-image fallback.
 * Attempts to load the original image first; falls back to the local SVG placeholder on failure.
 * Cleans up pending image event listeners on unmount/source change to prevent memory leaks and stale state.
 */
export function useBackgroundImage(src, fallbackSrc = defaultFallbackImage) {
  const isValid = isValidString(src);
  const resolvedFallback = fallbackSrc || defaultFallbackImage;
  const [bgUrl, setBgUrl] = useState(isValid ? src : resolvedFallback);

  useEffect(() => {
    if (!isValid) {
      setBgUrl(resolvedFallback);
      return;
    }

    setBgUrl(src); // Attempt original image first

    let isCancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!isCancelled) {
        setBgUrl(src);
      }
    };

    img.onerror = () => {
      if (!isCancelled) {
        setBgUrl(resolvedFallback);
      }
    };

    img.src = src;

    return () => {
      isCancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, resolvedFallback, isValid]);

  return bgUrl;
}

export default useBackgroundImage;
