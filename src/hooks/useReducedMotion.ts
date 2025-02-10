import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setReducedMotion } from "@/lib/themeReducer";

export const useReducedMotion = () => {
  const [isClient, setIsClient] = useState(false);
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);
  const dispatch = useAppDispatch();

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    dispatch(setReducedMotion(prefersReducedMotion));
  }, [isClient, dispatch, prefersReducedMotion]);

  return reducedMotion;
}