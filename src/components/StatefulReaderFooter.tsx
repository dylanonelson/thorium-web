"use client";

import React from "react";

import Locale from "../resources/locales/en.json";

import readerStateStyles from "./assets/styles/readerStates.module.css";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { ThFooter } from "@/core/Components/Reader/ThFooter";
import { StatefulReaderProgression } from "./StatefulReaderProgression";

export const StatefulReaderFooter = () => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
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
      aria-label={ Locale.reader.app.footer.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <StatefulReaderProgression
        className={ isFXL && isImmersive && !isHovering ? readerStateStyles.noDisplay : "" }
      />
    </ThFooter>
    </>
  )
}