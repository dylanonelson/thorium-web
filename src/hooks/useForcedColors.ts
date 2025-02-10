import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setForcedColors } from "@/lib/themeReducer";

export const useForcedColors = () => {
  const [isClient, setIsClient] = useState(false);
  const colors = useAppSelector(state => state.theming.forcedColors);
  const dispatch = useAppDispatch();

  const forcedColors = useMediaQuery("(forced-colors: active)");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    dispatch(setForcedColors(forcedColors));
  }, [isClient, dispatch, forcedColors]);

  return colors;
}