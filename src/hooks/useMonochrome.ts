import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setMonochrome } from "@/lib/themeReducer";

export const useMonochrome = () => {
  const isClient = useIsClient();
  const isMonochrome = useAppSelector(state => state.theming.monochrome);
  const dispatch = useAppDispatch();

  const monochrome = useMediaQuery("(monochrome)");

  useEffect(() => {
    if (!isClient) return;

    dispatch(setMonochrome(monochrome));
  }, [isClient, dispatch, monochrome]);

  return isMonochrome;
}