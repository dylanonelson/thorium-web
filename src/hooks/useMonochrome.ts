import { useEffect, useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setMonochrome } from "@/lib/themeReducer";

export const useMonochrome = () => {
  const [isClient, setIsClient] = useState(false);
  const isMonochrome = useAppSelector(state => state.theming.monochrome);
  const dispatch = useAppDispatch();

  const monochrome = useMediaQuery("(monochrome)");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    dispatch(setMonochrome(monochrome));
  }, [isClient, dispatch, monochrome]);

  return isMonochrome;
}