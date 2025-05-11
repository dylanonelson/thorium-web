"use client";

import { useEffect, useRef } from "react";

export interface UseFirstFocusableProps {
  withinRef: React.RefObject<HTMLElement | null>;
  fallbackRef?: React.RefObject<HTMLElement | null>;
  scrollerRef?: React.RefObject<HTMLElement | null>;
  trackedState: boolean;
  autoFocus?: boolean;
  updateState?: unknown;
}

export const useFirstFocusable = (props?: UseFirstFocusableProps) => {
  const { withinRef, fallbackRef, scrollerRef, trackedState, autoFocus = true, updateState } = props ?? {};

  const focusableElement = useRef<HTMLElement | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!withinRef || !trackedState) return;

    attemptsRef.current = 0;

    const tryFocus = () => {
      const targetElement = withinRef.current && withinRef.current.firstElementChild || withinRef.current;
      const selectedEl = targetElement && targetElement.querySelector("[data-selected]");

      console.log(targetElement);

      let firstFocusable: HTMLElement | null = null;

      if (selectedEl === null) {
        const inputs = targetElement && targetElement.querySelectorAll("input");
        const input = inputs && Array.from(inputs).find((input: HTMLInputElement) => !input.disabled && input.tabIndex >= 0);
        firstFocusable = input as HTMLElement | null;
      } else if (selectedEl instanceof HTMLElement) {
        firstFocusable = selectedEl;
      }

      if (!firstFocusable) {
        const focusableElements = withinRef.current && withinRef.current.querySelectorAll("a, button, input, select");
        const element = focusableElements && Array.from(focusableElements).find(element => {
          const htmlElement = element as HTMLAnchorElement | HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
          if (htmlElement instanceof HTMLAnchorElement) return true;
          return !htmlElement.disabled && htmlElement.tabIndex >= 0;
        });
        firstFocusable = element as HTMLElement | null;
      }

      if (firstFocusable) {
        if (autoFocus) {
          firstFocusable.focus({ preventScroll: true });
          if (scrollerRef?.current) {
            scrollerRef.current.scrollTop = 0;
          } else {
            withinRef.current!.scrollTop = 0;
          }
        }
        focusableElement.current = firstFocusable;
      } else {
        attemptsRef.current++;
        if (attemptsRef.current < 3) {
          setTimeout(tryFocus, 50);
        } else {
          if (fallbackRef?.current) {
            if (autoFocus) {
              fallbackRef.current.focus({ preventScroll: true });
            }
            focusableElement.current = fallbackRef.current;
          }
        }
      }
    };

    tryFocus();

    return () => {
      attemptsRef.current = 0;
    };
  }, [withinRef, fallbackRef, scrollerRef, trackedState, autoFocus, updateState]);

  return focusableElement.current;
};