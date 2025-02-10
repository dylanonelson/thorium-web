import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setForcedColors } from "@/lib/themeReducer";

export const useForcedColors = () => {
  const isClient = useIsClient();
  const colors = useAppSelector(state => state.theming.forcedColors);
  const dispatch = useAppDispatch();

  const forcedColors = useMediaQuery("(forced-colors: active)");

  useEffect(() => {
    if (!isClient) return;

    dispatch(setForcedColors(forcedColors));
  }, [isClient, dispatch, forcedColors]);

  return colors;
}