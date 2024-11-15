import React, { useEffect } from "react";

import Locale from "../resources/locales/en.json";

import { useAppSelector } from "@/lib/hooks";

export const RunningHead = () => {
  const runningHead = useAppSelector(state => state.publication.runningHead);

  useEffect(() => {
    if (runningHead) document.title = runningHead;
  }, [runningHead])

  return(
    <>
    <h1 aria-label={ Locale.reader.app.header.runningHead }>
        { runningHead
          ? runningHead
          : Locale.reader.app.header.runningHeadFallback }
      </h1>
    </>
  )
}