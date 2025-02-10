import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const useFirstFocusable = ({
  withinRef,
  trackedState,
  fallbackRef
}: { 
  withinRef: React.RefObject<HTMLElement | null>, 
  trackedState: boolean, 
  fallbackRef?: React.RefObject<HTMLElement | null> 
}) => {
  const [isClient, setIsClient] = useState(false);
  const focusedElement = useRef<HTMLElement | null>(null);
  
  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

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