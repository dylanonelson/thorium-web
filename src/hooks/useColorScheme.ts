import { useEffect } from "react";
import { ColorScheme } from "@/models/theme";
import { useMediaQuery } from "./useMediaQuery";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setColorScheme } from "@/lib/themeReducer";

export const useColorScheme = () => {
  const isClient = useIsClient();
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const dispatch = useAppDispatch();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (!isClient) return;

    dispatch(setColorScheme(
      prefersDarkMode ? 
      ColorScheme.dark : 
      ColorScheme.light
    ));
  }, [isClient, dispatch, prefersDarkMode]);

  return colorScheme;
}