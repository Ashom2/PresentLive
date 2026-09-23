import { useState } from 'react';
import { useApi } from './useApi';
import { getPresentationAndSlides, isPoll } from '../api/client';

/**
 * Fetches a presentation with its slides and tracks the current slide.
 *
 * @param {string} id - Presentation id.
 * @param {number} [initialIndex=0] - Starting slide index.
 * @returns {{
 *   status: 'loading' | 'error' | 'not-found' | 'ready',
 *   error: string | null,
 *   presentation: Object | null,
 *   slides: Array,
 *   currentSlide: Object | null,
 *   currentSlideIndex: number,
 *   setCurrentSlideIndex: Function,
 *   isPoll: boolean,
 *   refetch: Function,
 * }}
 */
export function useDeck(id, initialIndex = 0) {
  const { data, loading, error, refetch } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialIndex);

  if (loading) return { status: 'loading', error: null, refetch };
  if (error) return { status: 'error', error, refetch };
  if (!data) return { status: 'not-found', error: null, refetch };

  const { presentation, slides } = data;
  const safeSlides = Array.isArray(slides) ? slides : [];
  const safeIndex = safeSlides.length
    ? Math.min(currentSlideIndex, safeSlides.length - 1)
    : 0;
  const currentSlide = safeSlides[safeIndex] ?? null;
  const currentSlideIsPoll = currentSlide ? isPoll(currentSlide) : false;

  return {
    status: 'ready',
    error: null,
    presentation,
    slides: safeSlides,
    currentSlide,
    currentSlideIndex: safeIndex,
    setCurrentSlideIndex,
    currentSlideIsPoll,
    refetch,
  };
}