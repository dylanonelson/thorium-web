import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setContrast } from "@/lib/themeReducer";

export const useContrast = () => {
  const contrast = useAppSelector(state => state.theming.prefersContrast);
  const dispatch = useAppDispatch();

  const prefersContrast = useMediaQuery("(prefers-contrast)");

  useEffect(() => {    
    dispatch(setContrast(prefersContrast));
  }, [dispatch, prefersContrast]);

  return contrast;
}