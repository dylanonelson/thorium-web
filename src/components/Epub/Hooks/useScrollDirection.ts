import { useCallback, useRef } from "react";
import { Locator } from "@readium/shared";

interface ResourceScrollState {
  isScrollingForward: boolean;
  lastProgression: number;
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
    
    let resourceState = scrollState.current[currentHref];
    
    if (!resourceState) {
      scrollState.current[currentHref] = {
        isScrollingForward: true,
        lastProgression: currentProgression,
      };
      return;
    }
    
    resourceState.isScrollingForward = currentProgression > resourceState.lastProgression;
    
    resourceState.lastProgression = currentProgression;
  }, []);

  const getScrollState = useCallback((locator: Locator) => {
    return scrollState.current[locator.href] || {
      isScrollingForward: false,
      lastProgression: locator.locations.progression || 0,
    };
  }, []);

  return {
    scrollState: scrollState.current,
    handleScroll,
    getScrollState
  };
};
