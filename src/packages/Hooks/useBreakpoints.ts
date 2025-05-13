"use client";

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export enum Breakpoints {
  compact = "compact",
  medium = "medium",
  expanded = "expanded",
  large = "large",
  xLarge = "xLarge"
}

type ThBreakpointRange = {
  min: number | null,
  max: number | null
}

type ThBreakpointRanges = { [key in Breakpoints]: ThBreakpointRange | null; }

export type BreakpointsMap<T> = {
  [key in Breakpoints]?: T
};

export type ThBreakpoints = { [key in Breakpoints]: boolean | null } & { current: string | null } & { ranges: ThBreakpointRanges }

export const useBreakpoints = (map: BreakpointsMap<number | null>, onChange?: (breakpoint: Breakpoints | null) => void): ThBreakpoints => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoints | null>(null);

  const makeMediaString = (range: ThBreakpointRange | null) => {
    if (!range || (!range.min && !range.max)) return null;
  
    let mediaString = "screen"
    if (range.min) {
      mediaString += ` and (min-width: ${ range.min }px)`;
    }
    if (range.max) {
      mediaString += ` and (max-width: ${ range.max }px)`
    }
    return mediaString;
  };

  const initRanges = (prefs: BreakpointsMap<number | null>) => {
    const breakpointRanges: ThBreakpointRanges = {
      [Breakpoints.compact]: null,
      [Breakpoints.medium]: null,
      [Breakpoints.expanded]: null,
      [Breakpoints.large]: null,
      [Breakpoints.xLarge]: null
    };
  
    let prev: null | number = null;
    
    Object.entries(prefs).forEach(([ key, value ]) => {
      if (value && !isNaN(value)) {
        const max = value;
        const min = prev ? prev + 1 : null;
        Object.defineProperty(breakpointRanges, key, {
          value: {
            min: min,
            max: max
          }
        });
        prev = value;
      } else if (!value && key === Breakpoints.xLarge && prev) {
        Object.defineProperty(breakpointRanges, key, {
          value: {
            min: prev + 1,
            max: null
          }
        });
      }
    });

    return breakpointRanges;
  };

  const ranges = useMemo(() => initRanges(map), [map]);

  const compactMedia = makeMediaString(ranges[Breakpoints.compact]);
  const mediumMedia = makeMediaString(ranges[Breakpoints.medium]);
  const expandedMedia = makeMediaString(ranges[Breakpoints.expanded]);
  const largeMedia = makeMediaString(ranges[Breakpoints.large]);
  const xLargeMedia = makeMediaString(ranges[Breakpoints.xLarge]);

  const compactMatches = useMediaQuery(compactMedia);
  const mediumMatches = useMediaQuery(mediumMedia);
  const expandedMatches = useMediaQuery(expandedMedia);
  const largeMatches = useMediaQuery(largeMedia);
  const xLargeMatches = useMediaQuery(xLargeMedia);

  useEffect(() => {
    let newBreakpoint = null;

    if (compactMatches) {
      newBreakpoint = Breakpoints.compact;
    } else if (mediumMatches) {
      newBreakpoint = Breakpoints.medium;
    } else if (expandedMatches) {
      newBreakpoint = Breakpoints.expanded;
    } else if (largeMatches) {
      newBreakpoint = Breakpoints.large;
    } else if (xLargeMatches) {
      newBreakpoint = Breakpoints.xLarge;
    }

    setCurrentBreakpoint(newBreakpoint);
    onChange && onChange(newBreakpoint);
  }, [compactMatches, mediumMatches, expandedMatches, largeMatches, xLargeMatches, onChange]);

  return {
    [Breakpoints.compact]: compactMatches,
    [Breakpoints.medium]: mediumMatches,
    [Breakpoints.expanded]: expandedMatches,
    [Breakpoints.large]: largeMatches,
    [Breakpoints.xLarge]: xLargeMatches,
    current: currentBreakpoint,
    ranges: ranges
  };
};