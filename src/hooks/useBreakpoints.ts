import { useEffect } from "react";

import { RSPrefs } from "@/preferences";
import { setStaticBreakpoint } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export type StaticBreakpoint = "compact" | "medium" | "expanded" | "large" | "extraLarge";

// TODO: Abstract and cover edge cases in prefs.

export const useBreakpoints = () => {
  const breakpoint = useAppSelector(state => state.reader.staticBreakpoint);

  const dispatch = useAppDispatch();

  const compactMedia = RSPrefs.breakpoints.compact 
    ? window.matchMedia(`screen and (max-width: ${ RSPrefs.breakpoints.compact }px)`) 
    : null;

  const mediumMedia = RSPrefs.breakpoints.medium 
    ? window.matchMedia(`screen and (min-width: ${RSPrefs.breakpoints.compact + 1 }px) and (max-width: ${ RSPrefs.breakpoints.medium }px)`)
    : null;

  const expandedMedia = RSPrefs.breakpoints.expanded 
    ?  window.matchMedia(`screen and (min-width: ${RSPrefs.breakpoints.medium + 1 }px) and (max-width: ${ RSPrefs.breakpoints.expanded }px)`)
    : null;

  const largeMedia = RSPrefs.breakpoints.large 
    ?  window.matchMedia(`screen and (min-width: ${RSPrefs.breakpoints.expanded + 1 }px) and (max-width: ${ RSPrefs.breakpoints.large }px)`) 
    : null;
  
  const extraLargeMedia = RSPrefs.breakpoints.extraLarge 
    ? window.matchMedia(`screen and (min-width: ${RSPrefs.breakpoints.large + 1 }px) and (max-width: ${ RSPrefs.breakpoints.extraLarge }px)`) 
    : window.matchMedia(`screen and (min-width: ${ RSPrefs.breakpoints.large + 1 }px)`);
  
  const setCompact = (event: MediaQueryListEvent) => {
    if (event.matches) {
      dispatch(setStaticBreakpoint("compact"));
    }
  };

  const setMedium = (event: MediaQueryListEvent) => {
    if (event.matches) {
      dispatch(setStaticBreakpoint("medium"));
    }
  };

  const setExpanded = (event: MediaQueryListEvent) => {
    if (event.matches) {
      dispatch(setStaticBreakpoint("expanded"));
    }
  };

  const setLarge = (event: MediaQueryListEvent) => {
    if (event.matches) {
      dispatch(setStaticBreakpoint("large"));
    }
  };

  const setExtraLarge = (event: MediaQueryListEvent) => {
    if (event.matches) {
      dispatch(setStaticBreakpoint("extraLarge"));
    }
  };

  useEffect(() => {
    if (compactMedia) {
      // Init
      compactMedia.matches && dispatch(setStaticBreakpoint("compact"));
      // Listen
      compactMedia.addEventListener("change", setCompact);
    }
    if (mediumMedia) {
      // Init
      mediumMedia.matches && dispatch(setStaticBreakpoint("medium"));
      // Listen
      mediumMedia.addEventListener("change", setMedium);
    }
    if (expandedMedia) {
      // Init
      expandedMedia.matches && dispatch(setStaticBreakpoint("expanded"));
      // Listen
      expandedMedia.addEventListener("change", setExpanded)
    };
    if (largeMedia) {
      // Init
      largeMedia.matches && dispatch(setStaticBreakpoint("large"));
      // Listen
      largeMedia.addEventListener("change", setLarge)
    };
    if (extraLargeMedia) {
      // Init
      extraLargeMedia.matches && dispatch(setStaticBreakpoint("extraLarge"));
      // Listen
      extraLargeMedia.addEventListener("change", setExtraLarge);
    }

    return () => {
      compactMedia && compactMedia.removeEventListener("change", setCompact);
      mediumMedia && mediumMedia.removeEventListener("change", setMedium);
      expandedMedia && expandedMedia.removeEventListener("change", setExpanded);
      largeMedia && largeMedia.removeEventListener("change", setLarge);
      extraLargeMedia && extraLargeMedia.removeEventListener("change", setExtraLarge);
    }
  }, []);

  return {
    breakpoint
  }
}