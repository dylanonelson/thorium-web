import { useCallback, useRef } from "react";
import { Locator } from "@readium/shared";

interface ResourceScrollState {
  isScrollingForward: boolean;
  lastProgression: number | null;
}

interface ScrollState {
  [href: string]: ResourceScrollState;
}

export const useScrollDirection = () => {
  const scrollState = useRef<ScrollState>({});

  const handleScroll = useCallback((locator: Locator) => {
    if (!locator.locations.progression) return;

    const currentProgression = locator.locations.progression;
    const currentHref = locator.href;
    
    if (!scrollState.current[currentHref]) {
      scrollState.current[currentHref] = {
        isScrollingForward: false,
        lastProgression: null,
      };
    }

    const resourceState = scrollState.current[currentHref];
    
    if (resourceState.lastProgression !== null) {
      resourceState.isScrollingForward = currentProgression > resourceState.lastProgression;
    }
    
    resourceState.lastProgression = currentProgression;
  }, []);

  const getScrollState = useCallback((locator: Locator) => {
    return scrollState.current[locator.href] || {
      isScrollingForward: false,
      lastProgression: null,
    };
  }, []);

  return {
    scrollState: scrollState.current,
    handleScroll,
    getScrollState
  };
};
