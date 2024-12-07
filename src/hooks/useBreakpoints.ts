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

export type Breakpoints = { [key in StaticBreakpoints]: boolean | null } & { current: string | undefined };

export const useBreakpoints = () => {
  const [isClient, setIsClient] = useState(false);
  const staticBreakpoint = useAppSelector(state => state.reader.staticBreakpoint);
  const dispatch = useAppDispatch();

  const compactMedia = `screen and (max-width: ${ RSPrefs.breakpoints.compact }px)`;

  const mediumMedia = `screen and (min-width: ${RSPrefs.breakpoints.compact + 1 }px) and (max-width: ${ RSPrefs.breakpoints.medium }px)`;

  const expandedMedia = `screen and (min-width: ${RSPrefs.breakpoints.medium + 1 }px) and (max-width: ${ RSPrefs.breakpoints.expanded }px)`;

  const largeMedia = `screen and (min-width: ${RSPrefs.breakpoints.expanded + 1 }px) and (max-width: ${ RSPrefs.breakpoints.large }px)`;
  
  const xLargeMedia = RSPrefs.breakpoints[StaticBreakpoints.xLarge] 
    ? `screen and (min-width: ${RSPrefs.breakpoints.large + 1 }px) and (max-width: ${ RSPrefs.breakpoints.xLarge }px)`
    : `screen and (min-width: ${ RSPrefs.breakpoints.large + 1 }px)`;

  const breakpoints: Breakpoints = {
    [StaticBreakpoints.compact]: useMediaQuery(compactMedia),
    [StaticBreakpoints.medium]: useMediaQuery(mediumMedia),
    [StaticBreakpoints.expanded]: useMediaQuery(expandedMedia),
    [StaticBreakpoints.large]: useMediaQuery(largeMedia),
    [StaticBreakpoints.xLarge]: useMediaQuery(xLargeMedia),
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