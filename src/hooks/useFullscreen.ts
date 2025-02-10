import { useCallback, useEffect } from "react";
import { useIsClient } from "./useIsClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFullscreen } from "@/lib/readerReducer";

export const useFullscreen = () => {
  const isClient = useIsClient();
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const dispatch = useAppDispatch();

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const onFSchange = () => {
      dispatch(setFullscreen(Boolean(document.fullscreenElement)));
    }

    document.addEventListener("fullscreenchange", onFSchange);

    return () => {
      if (!isClient) return;

      document.removeEventListener("fullscreenchange", onFSchange);
    }
  }, [isClient, dispatch]);

  return {
    isFullscreen,
    handleFullscreen
  }
}