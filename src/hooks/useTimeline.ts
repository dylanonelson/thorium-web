import { useCallback, useEffect, useRef, useState } from "react";

import { EPUBLayout, Link, Locator, Publication } from "@readium/shared";
import { createTocTree, TocItem } from "../helpers/createTocTree";

export interface UnstableTimeline {
  items?: {
    [key: string]: Locator;
  }
  currentLocation?: Locator;
  toc?: {
    tree?: TocItem[];
    currentEntry?: string;
  }
}

export const useTimeline = ({
  publication, 
  currentLocation, 
  currentPositions,
  positionsList,
  onChange
}: {
  publication: Publication | null, 
  currentLocation?: Locator, 
  currentPositions: number[],
  positionsList: Locator[],
  onChange?: (timeline: UnstableTimeline) => void
}): UnstableTimeline => {
  const readingOrder = publication?.readingOrder?.items || [];
  const layout = publication?.metadata.getPresentation()?.layout || EPUBLayout.reflowable;

  const tocTreeRef = useRef<TocItem[]>([]);
  const idCounterRef = useRef(0);
  const currentEntryIdRef = useRef<string | undefined>(undefined);

  const handleTocEntryOnNav = useCallback((locator?: Locator) => {
    if (!locator || !tocTreeRef.current.length) return;

    const findMatch = (items: TocItem[], link?: Link): TocItem | undefined => {
      for (const item of items) {
        if (item.href === link?.href) {
          return item;
        }
        if (item.children) {
          const match = findMatch(item.children, link);
          if (match) return match;
        }
      }
      return undefined;
    };

    const currentMatch = findMatch(tocTreeRef.current, new Link(locator));
    if (currentMatch) {
      const timeline: UnstableTimeline = {
        toc: {
          tree: tocTreeRef.current,
          currentEntry: currentMatch.id
        }
      };
      onChange?.(timeline);
      currentEntryIdRef.current = currentMatch.id;
      return;
    }

    // If we're in FXL and didn't find a match, try to find a match for the other position in the spread
    if (layout === EPUBLayout.fixed) {
      const positions = currentPositions;
      if (positions && positions.length === 2) {
        // We have a spread, get the other position
        const otherPosition = positions[0] === locator.locations.position ? positions[1] : positions[0];

        // Find the other position in positionsList
        const otherPositionInList = positionsList.find((pos: Locator) => pos.locations.position === otherPosition);
        if (otherPositionInList) {
          const match = findMatch(tocTreeRef.current, new Link(otherPositionInList));
          if (match) {
            onChange?.({
              toc: {
                tree: tocTreeRef.current,
                currentEntry: match.id
              }
            });
            currentEntryIdRef.current = match.id;
            return;
          }
        }
      }
    }

    // If no match, try to find a match for other positions
    const otherPositions = currentPositions.filter(pos => pos !== locator.locations.position);
    for (const otherPosition of otherPositions) {
      const otherPositionInList = positionsList.find((pos: Locator) => pos.locations.position === otherPosition);
      if (otherPositionInList) {
        const match = findMatch(tocTreeRef.current, new Link(otherPositionInList));
        if (match) {
          onChange?.({
            toc: {
              tree: tocTreeRef.current,
              currentEntry: match.id
            }
          });
          currentEntryIdRef.current = match.id;
          return;
        }
      }
    }
  }, [tocTreeRef, currentPositions, positionsList, onChange, layout]);

  useEffect(() => {
    if (!publication) return;
    
    const toc = publication?.tableOfContents?.items || [];
    const idGenerator = () => `toc-${++idCounterRef.current}`;
    tocTreeRef.current = createTocTree(toc, idGenerator, positionsList);
  }, [publication, positionsList]);

  useEffect(() => {
    if (!tocTreeRef.current.length) return;

    // If we have a current location, use it
    if (currentLocation) {
      handleTocEntryOnNav(currentLocation);
    }
    // Otherwise, use the first TOC entry
    else if (tocTreeRef.current.length > 0) {
      handleTocEntryOnNav(new Locator({ href: tocTreeRef.current[0].href, type: "" }));
    }
  }, [currentLocation, handleTocEntryOnNav]);

  return {
    toc: {
      tree: tocTreeRef.current,
      currentEntry: currentEntryIdRef.current
    }
  };
}