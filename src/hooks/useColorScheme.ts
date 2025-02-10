import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setColorScheme } from "@/lib/themeReducer";
import { ColorScheme } from "@/models/theme";

export const useColorScheme = () => {
  const [isClient, setIsClient] = useState(false);
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const dispatch = useAppDispatch();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

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