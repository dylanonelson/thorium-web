import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFullscreen } from "@/lib/readerReducer";

export const useFullscreen = () => {
  const [isClient, setIsClient] = useState(false);
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const dispatch = useAppDispatch();

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
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