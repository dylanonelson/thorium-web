"use client";

import React, { useCallback, useEffect } from "react";

import Locale from "../resources/locales/en.json";

import readerPaginationStyles from "./assets/styles/readerPagination.module.css";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { ThFooter } from "@/core/Components/Reader/ThFooter";
import { StatefulReaderProgression } from "./StatefulReaderProgression";
import { ThInteractiveOverlay } from "../core/Components/Reader/ThInteractiveOverlay";
import { StatefulPagination } from "./StatefulPagination";
import { ThPaginationLinkProps } from "@/core/Components/Reader/ThPagination";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useFocusWithin } from "react-aria";

export const StatefulReaderFooter = () => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const hasScrollAffordance = useAppSelector(state => state.reader.hasScrollAffordance);
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);
  const timeline = useAppSelector(state => state.publication.unstableTimeline);

  const dispatch = useAppDispatch();

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin() {
      dispatch(setHovering(true));
    },
    onBlurWithin() {
      dispatch(setHovering(false));
    }
  });

  const setHover = () => {
    if (!hasScrollAffordance) {
      dispatch(setHovering(true));
    }
  };

  const removeHover = () => {
    if (!hasScrollAffordance) {
      dispatch(setHovering(false));
    }
  };

  const { previousLocator, nextLocator, go } = useEpubNavigator();

  const updateLinks = useCallback(() => {
    const links: { previous?: ThPaginationLinkProps; next?: ThPaginationLinkProps } = {
      previous: undefined,
      next: undefined
    };

    const previous = previousLocator();
    const next = nextLocator();

    if (previous) {
      links.previous = {
        node: (
          <>
            <span className="sr-only">{ Locale.reader.navigation.scroll.prevA11yLabel }</span>
            <span className={ readerPaginationStyles.paginationLabel }>{ timeline?.previousItem?.title || previous.title || Locale.reader.navigation.scroll.prevLabel }</span>
          </>
        ),
        onPress: () => go(previous, !reducedMotion, () => {})
      }
    }

    if (next) {
      links.next = {
        node: (
          <>
            <span className="sr-only">{ Locale.reader.navigation.scroll.nextA11yLabel }</span>
            <span className={ readerPaginationStyles.paginationLabel }>{ timeline?.nextItem?.title || next.title || Locale.reader.navigation.scroll.nextLabel }</span>
          </>
        ),
        onPress: () => go(next, !reducedMotion, () => {})
      }
    }

    return links;
  }, [go, previousLocator, nextLocator, timeline, reducedMotion]);

  useEffect(() => {
    updateLinks();
  }, [timeline, updateLinks]);

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
      { ...focusWithinProps }
    >
      { isScroll && !isFXL
        ? <StatefulPagination 
            aria-label={ Locale.reader.navigation.scroll.wrapper }
            links={ updateLinks() } 
            compounds={ {
              listItem: {
                className: readerPaginationStyles.paginationListItem
              },
              previousButton: {
                className: readerPaginationStyles.previousButton,
                preventFocusOnPress: true
              },
              nextButton: {
                className: readerPaginationStyles.nextButton,
                preventFocusOnPress: true
              }
            } } 
          >
            <StatefulReaderProgression />
          </StatefulPagination> 
        : <StatefulReaderProgression /> }
    </ThFooter>
    </>
  )
}