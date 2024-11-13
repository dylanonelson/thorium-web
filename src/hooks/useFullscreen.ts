import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFullscreen } from "@/lib/readerReducer";
import { useCallback, useEffect } from "react";

export const useFullscreen = () => {
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
    const onFSchange = () => {
      dispatch(setFullscreen(Boolean(document.fullscreenElement)));
    }

    document.addEventListener("fullscreenchange", onFSchange);

    return () => {
      document.removeEventListener("fullscreenchange", onFSchange);
    }
  }, [dispatch]);

  return {
    isFullscreen,
    handleFullscreen
  }
}