import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setReducedMotion } from "@/lib/themeReducer";

export const useReducedMotion = () => {
  const isClient = useIsClient();
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);
  const dispatch = useAppDispatch();

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!isClient) return;

    dispatch(setReducedMotion(prefersReducedMotion));
  }, [isClient, dispatch, prefersReducedMotion]);

  return reducedMotion;
}