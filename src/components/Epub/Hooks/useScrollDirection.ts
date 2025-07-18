import { useCallback, useRef } from "react";
import { Locator } from "@readium/shared";

interface ScrollState {
  isScrollingForward: boolean;
  lastProgression: number;
  currentHref: string | null;
}

export const useScrollDirection = () => {
  const scrollState = useRef<ScrollState>({
    isScrollingForward: true,
    lastProgression: 0,
    currentHref: null
  });

  const handleScroll = useCallback((locator: Locator) => {
    if (!locator.locations.progression) return;

    const currentProgression = locator.locations.progression;
    const currentHref = locator.href;
    
    // Reset state if href changes
    if (scrollState.current.currentHref !== currentHref) {
      scrollState.current = {
        isScrollingForward: true,
        lastProgression: currentProgression,
        currentHref: currentHref
      };
      return;
    }
    
    // Update scroll direction based on progression
    scrollState.current.isScrollingForward = currentProgression > scrollState.current.lastProgression;
    scrollState.current.lastProgression = currentProgression;
  }, []);

  const getScrollState = useCallback((locator: Locator) => {
    return {
      isScrollingForward: scrollState.current.isScrollingForward,
      lastProgression: scrollState.current.lastProgression
    };
  }, []);

  return {
    scrollState: scrollState.current,
    handleScroll,
    getScrollState
  };
};
