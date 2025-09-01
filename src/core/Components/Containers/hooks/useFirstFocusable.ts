"use client";

import { useEffect, useRef, RefObject } from "react";
import { usePrevious } from "../../../Hooks/usePrevious";

type ScrollOptions = {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
};

type Action = 
  | { 
      type: "focus";
      options?: {
        preventScroll?: boolean;
        scrollContainerToTop?: boolean;
      };
    }
  | { 
      type: "scrollIntoView";
      options?: ScrollOptions;
    }
  | { 
      type: "none";
    };

export interface UseFirstFocusableProps {
  withinRef: RefObject<HTMLElement | null>;
  fallbackRef?: RefObject<HTMLElement | null>;
  scrollerRef?: RefObject<HTMLElement | null>;
  trackedState?: boolean;
  updateState?: unknown;
  action?: Action;
}

const isInViewport = (element: Element, container: Element | null = null): boolean => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container?.getBoundingClientRect() ?? {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth
  };

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
  );
};

export const useFirstFocusable = (props?: UseFirstFocusableProps) => {
  const { 
    withinRef, 
    fallbackRef, 
    scrollerRef, 
    trackedState, 
    updateState,
    action = { type: "none" } // Default to no action if not provided
  } = props || {};

  const focusableElement = useRef<HTMLElement | null>(null);
  const attemptsRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const previousUpdateState = usePrevious(updateState);

  useEffect(() => {    
    if (!withinRef || !trackedState || updateState === previousUpdateState) return;

    attemptsRef.current = 0;

    const tryFindAndHandle = () => {
      const targetElement = withinRef.current?.firstElementChild || withinRef.current;
      const selectedEl = targetElement?.querySelector("[data-selected]");

      let firstFocusable: HTMLElement | null = null;

      if (selectedEl === null) {
        const inputs = targetElement?.querySelectorAll("input");
        const input = inputs && Array.from(inputs).find(
          (input: HTMLInputElement) => !input.disabled && input.tabIndex >= 0
        );
        firstFocusable = input as HTMLElement | null;
      } else if (selectedEl instanceof HTMLElement) {
        firstFocusable = selectedEl;
      }

      if (!firstFocusable) {
        firstFocusable = withinRef.current?.querySelector("[data-selected]") as HTMLElement | null;
      }

      if (!firstFocusable) {
        const focusableElements = withinRef.current?.querySelectorAll("a, button, input, select");
        const element = focusableElements && Array.from(focusableElements).find(el => {
          const htmlEl = el as HTMLAnchorElement | HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
          if (htmlEl instanceof HTMLAnchorElement) return true;
          return !htmlEl.disabled && htmlEl.tabIndex >= 0;
        });
        firstFocusable = element as HTMLElement | null;
      }

      const handleElement = (element: HTMLElement) => {
        if (action.type === "none") return;

        switch (action.type) {
          case "focus": {
            const preventScroll = action.options?.preventScroll;
            element.focus({ preventScroll });
            
            // Handle container scrolling if requested
            if (action.options?.scrollContainerToTop) {
              const scrollContainer = scrollerRef?.current || withinRef.current;
              scrollContainer?.scrollTo({ top: 0 });
            }
            break;
          }
          
          case "scrollIntoView":
            if (!isInViewport(element, scrollerRef?.current || null)) {
              element.scrollIntoView(action.options);
            }
            break;
        }
      };

      if (firstFocusable) {
        handleElement(firstFocusable);
        focusableElement.current = firstFocusable;
      } else {
        attemptsRef.current++;
        if (attemptsRef.current < 3) {
          timeoutRef.current = window.setTimeout(tryFindAndHandle, 50);
        } else if (fallbackRef?.current) {
          // Handle fallback based on action type
          if (action.type === "focus") {
            fallbackRef.current.focus({ preventScroll: true });
          } else if (action.type === "scrollIntoView") {
            fallbackRef.current.scrollIntoView(action.options);
          }
          focusableElement.current = fallbackRef.current;
        }
      }
    };

    tryFindAndHandle();

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      attemptsRef.current = 0;
    };
  }, [withinRef, fallbackRef, scrollerRef, trackedState, updateState, action]);

  return focusableElement.current;
};