"use client";

import { useEffect, RefObject } from "react";

type ScrollableElement = HTMLElement | Element;

export interface UseScrollIntoViewOptions {
  updateState?: unknown;
  condition?: boolean;
  target: string | RefObject<ScrollableElement | null> | null;
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  onScroll?: (scrolled: boolean) => void;
}

export const useScrollIntoView = ({
  updateState,
  condition = true,
  target,
  behavior = "auto",
  block = "nearest",
  inline = "nearest",
  onScroll
}: UseScrollIntoViewOptions) => {
  useEffect(() => {
    if (!condition) return;

    const targetElement = typeof target === "string" 
      ? document.querySelector(target)
      : target?.current;

    if (!targetElement) {
      onScroll?.(false);
      return;
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

    if (!isInViewport(targetElement)) {
      targetElement.scrollIntoView({ behavior, block, inline });
      onScroll?.(true);
    } else {
      onScroll?.(false);
    }
  }, [condition, updateState, target, behavior, block, inline, onScroll]);
};