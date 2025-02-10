import { useEffect, useRef } from "react";
import { useIsClient } from "./useIsClient";

export const useFirstFocusable = ({
  withinRef,
  trackedState,
  fallbackRef
}: { 
  withinRef: React.RefObject<HTMLElement | null>, 
  trackedState: boolean, 
  fallbackRef?: React.RefObject<HTMLElement | null> 
}) => {
  const isClient = useIsClient();
  const focusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isClient || !withinRef.current || !trackedState) return;
    
    // WIP: Pick the fist element that is selected. 
    // Expecting this to become more complex 
    // in order to cover all possible interactive elements
    const firstFocusable: HTMLElement | null = withinRef.current.querySelector("[data-selected]");
        
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
      focusedElement.current = firstFocusable;
    } else {
      if (fallbackRef?.current) {
        fallbackRef.current.focus({ preventScroll: true });
        focusedElement.current = fallbackRef.current;
      } else {
        focusedElement.current = null;
      }
    }
  }, [isClient, trackedState, withinRef, fallbackRef]);

  return focusedElement.current;
}