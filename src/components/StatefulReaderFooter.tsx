"use client";

import React from "react";

import Locale from "../resources/locales/en.json";

import readerPaginationStyles from "./assets/styles/readerPagination.module.css";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { ThFooter } from "@/core/Components/Reader/ThFooter";
import { StatefulReaderProgression } from "./StatefulReaderProgression";
import { ThInteractiveOverlay } from "../core/Components/Reader/ThInteractiveOverlay";
import { StatefulPagination } from "./StatefulPagination";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";

export const StatefulReaderFooter = () => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const isScroll = useAppSelector(state => state.settings.scroll);
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);

  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const { goLeft, goRight } = useEpubNavigator();

  const links = {
    previous: {
      label: Locale.reader.navigation.scroll.prevLabel,
      onPress: () => goLeft(!reducedMotion, () => {})
    },
    next: {
      label: Locale.reader.navigation.scroll.nextLabel,
      onPress: () => goRight(!reducedMotion, () => {})
    }
  };

  return(
    <>
    <ThInteractiveOverlay 
      id="reader-footer-overlay"
      className="bar-overlay"
      isActive={ isScroll && isImmersive && !isHovering }
      onMouseEnter={ setHover }
      onMouseLeave={ removeHover }
    />
    
    <ThFooter 
      id="bottom-bar" 
      aria-label={ Locale.reader.app.footer.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      { isScroll 
        ? <StatefulPagination 
            aria-label={ Locale.reader.navigation.scroll.wrapper }
            links={ links } 
            compounds={ {
              listItem: {
                className: readerPaginationStyles.paginationListItem
              }
            } } 
          /> 
        : <StatefulReaderProgression /> }
    </ThFooter>
    </>
  )
}