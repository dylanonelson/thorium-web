import { useEffect, useLayoutEffect, useState } from "react";
import { Contrast } from "@/models/theme";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setContrast } from "@/lib/themeReducer";

export const useContrast = () => {
  const [isClient, setIsClient] = useState(false);
  const contrast = useAppSelector(state => state.theming.prefersContrast);
  const dispatch = useAppDispatch();

  const prefersNoContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.none })`);
  const prefersLessContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.less })`);
  const prefersMoreContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.more })`);
  const prefersCustomContrast = useMediaQuery(`(prefers-contrast: ${ Contrast.custom })`);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (prefersNoContrast) {
      dispatch(setContrast(Contrast.none));
    } else if (prefersLessContrast) {
      dispatch(setContrast(Contrast.less));
    } else if (prefersMoreContrast) {
      dispatch(setContrast(Contrast.more));
    } else if (prefersCustomContrast) {
      dispatch(setContrast(Contrast.custom));
    }
  });

  return contrast;
}