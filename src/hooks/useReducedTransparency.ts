import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setReducedTransparency } from "@/lib/themeReducer";

export const useReducedTransparency = () => {
  const isClient = useIsClient();
  const reducedTransparency = useAppSelector(state => state.theming.prefersReducedTransparency);
  const dispatch = useAppDispatch();

  const prefersReducedTransparency = useMediaQuery("(prefers-reduced-transparency: reduce)");

  useEffect(() => {
    if (!isClient) return;

    dispatch(setReducedTransparency(prefersReducedTransparency));
  }, [isClient, dispatch, prefersReducedTransparency]);

  return reducedTransparency;
}