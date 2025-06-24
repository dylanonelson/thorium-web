import { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Locator } from "@readium/shared";

export const usePositionBoundaries = () => {
  const positionsList = useAppSelector(state => state.publication.positionsList);
  const currentPositionsList = useRef<Locator[] | undefined>(undefined);

  useEffect(() => {
    currentPositionsList.current = positionsList;
  }, [positionsList]);

  const getPositionBoundaries = useCallback((
    locator: Locator,
    currentPositions: number[] | undefined
  ) => {
    if (!currentPositions) return { isStart: false, isEnd: false };

    const positions = currentPositionsList.current;
    if (!positions || positions.length === 0) return { isStart: false, isEnd: false };

    const currentHref = locator.href;
    const filteredPositions = positions.filter(pos => pos.href === currentHref);

    if (filteredPositions.length === 0) return { isStart: false, isEnd: false };

    // Check if the first or last position in filtered list matches any in currentPositions
    const isStart = currentPositions.some(pos => filteredPositions[0].locations.position === pos);
    const isEnd = currentPositions.some(pos => filteredPositions[filteredPositions.length - 1].locations.position === pos);

    return { isStart, isEnd };
  }, []);

  return {
    getPositionBoundaries
  };
};