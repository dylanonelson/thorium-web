import { useEffect, useRef } from "react";

export const useFirstFocusable = ({
  withinRef,
  trackedState,
  fallbackRef,
  dependencies = []
}: { 
  withinRef: React.RefObject<HTMLElement | null>, 
  trackedState: boolean, 
  fallbackRef?: React.RefObject<HTMLElement | null>,
  dependencies?: any[]
}) => {
  const focusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!withinRef.current || !trackedState) return;
    
    // WIP: Pick the fist element that is selected. 
    // Expecting this to become more complex 
    // in order to cover all possible interactive elements
    const firstFocusable: HTMLElement | null = withinRef.current.querySelector("a, button:not(:has(+ input)), input, select, [data-selected]");

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
  }, [trackedState, withinRef, fallbackRef, ...dependencies]);

  return focusedElement.current;
}