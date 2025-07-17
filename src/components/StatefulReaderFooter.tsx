"use client";

import React from "react";

import { ThFooter } from "@/core/Components/Reader/ThFooter";
import { StatefulReaderProgression } from "./StatefulReaderProgression";

import { useI18n } from "@/i18n/useI18n";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch } from "@/lib/hooks";

export const StatefulReaderFooter = () => {
  const { t } = useI18n();
  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  return(
    <>
    <ThFooter 
      id="bottom-bar" 
      aria-label={ t("reader.app.footer.label") } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <StatefulReaderProgression />
    </ThFooter>
    </>
  )
}