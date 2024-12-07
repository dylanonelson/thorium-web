import { useLayoutEffect, useState } from "react";

import { RSPrefs } from "@/preferences";
import { setStaticBreakpoint } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useMediaQuery } from "./useMediaQuery";

export enum StaticBreakpoints {
  compact = "compact",
  medium = "medium",
  expanded = "expanded",
  large = "large",
  xLarge = "xLarge"
}

export interface IBreakpoints {
  [key: StaticBreakpoints | string]: boolean | string | null | undefined;
  current: string | undefined;
}

export const useBreakpoints = () => {
  const [isClient, setIsClient] = useState(false);
  const staticBreakpoint = useAppSelector(state => state.reader.staticBreakpoint);
  const dispatch = useAppDispatch();

  const compactMedia = RSPrefs.breakpoints[StaticBreakpoints.compact] 
    ? `screen and (max-width: ${ RSPrefs.breakpoints.compact }px)` 
    : null;

  const mediumMedia = RSPrefs.breakpoints[StaticBreakpoints.medium] 
    ? `screen and (min-width: ${RSPrefs.breakpoints.compact + 1 }px) and (max-width: ${ RSPrefs.breakpoints.medium }px)`
    : null;

  const expandedMedia = RSPrefs.breakpoints[StaticBreakpoints.expanded] 
    ? `screen and (min-width: ${RSPrefs.breakpoints.medium + 1 }px) and (max-width: ${ RSPrefs.breakpoints.expanded }px)`
    : null;

  const largeMedia = RSPrefs.breakpoints[StaticBreakpoints.large] 
    ? `screen and (min-width: ${RSPrefs.breakpoints.expanded + 1 }px) and (max-width: ${ RSPrefs.breakpoints.large }px)`
    : null;
  
  const xLargeMedia = RSPrefs.breakpoints[StaticBreakpoints.xLarge] 
    ? `screen and (min-width: ${RSPrefs.breakpoints.large + 1 }px) and (max-width: ${ RSPrefs.breakpoints.xLarge }px)`
    : `screen and (min-width: ${ RSPrefs.breakpoints.large + 1 }px)`;

  const breakpoints: IBreakpoints = {
    [StaticBreakpoints.compact]: compactMedia ? useMediaQuery(compactMedia) : null,
    [StaticBreakpoints.medium]: mediumMedia ? useMediaQuery(mediumMedia) : null,
    [StaticBreakpoints.expanded]: expandedMedia ? useMediaQuery(expandedMedia) : null,
    [StaticBreakpoints.large]: largeMedia ? useMediaQuery(largeMedia) : null,
    [StaticBreakpoints.xLarge]: xLargeMedia ? useMediaQuery(xLargeMedia) : null,
    current: staticBreakpoint
  };
  
  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  if (isClient) {
    if (breakpoints[StaticBreakpoints.compact]) {
      dispatch(setStaticBreakpoint(StaticBreakpoints.compact));
    } else if (breakpoints[StaticBreakpoints.medium]) {
      dispatch(setStaticBreakpoint(StaticBreakpoints.medium));
    } else if (breakpoints[StaticBreakpoints.expanded]) {
      dispatch(setStaticBreakpoint(StaticBreakpoints.expanded))
    } else if (breakpoints[StaticBreakpoints.large]) {
      dispatch(setStaticBreakpoint(StaticBreakpoints.large));
    } else if (breakpoints[StaticBreakpoints.xLarge]) {
      dispatch(setStaticBreakpoint(StaticBreakpoints.xLarge))
    };
  }

  return breakpoints;
}