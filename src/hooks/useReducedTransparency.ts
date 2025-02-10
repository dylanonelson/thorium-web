import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setReducedTransparency } from "@/lib/themeReducer";

export const useReducedTransparency = () => {
  const [isClient, setIsClient] = useState(false);
  const reducedTransparency = useAppSelector(state => state.theming.prefersReducedTransparency);
  const dispatch = useAppDispatch();

  const prefersReducedTransparency = useMediaQuery("(prefers-reduced-transparency: reduce)");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    dispatch(setReducedTransparency(prefersReducedTransparency));
  }, [isClient, dispatch, prefersReducedTransparency]);

  return reducedTransparency;
}