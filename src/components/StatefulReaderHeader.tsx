"use client";

import React, { useCallback } from "react";

import { ActionKeyType, usePreferenceKeys } from "@/preferences";

import Locale from "../resources/locales/en.json";

import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { ThActionEntry } from "@/core/Components/Actions/ThActionsBar";
import { ThHeader  } from "@/core/Components/Reader/ThHeader";
import { ThRunningHead } from "@/core/Components/Reader/ThRunningHead";
import { StatefulCollapsibleActionsBar } from "./Actions/StatefulCollapsibleActionsBar";

import { usePlugins } from "./Plugins/PluginProvider";
import { usePreferences } from "@/preferences/hooks";
import { useFocusWithin } from "react-aria";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { ThInteractiveOverlay } from "../core/Components/Reader/ThInteractiveOverlay";

export const StatefulReaderHeader = () => {
  const { reflowActionKeys, fxlActionKeys } = usePreferenceKeys();
  const RSPrefs = usePreferences();
  const { actionsComponentsMap } = usePlugins();
  
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const runningHead = useAppSelector(state => state.publication.runningHead);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const isScroll = useAppSelector(state => state.settings.scroll);

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
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const listActionItems = useCallback(() => {
    const actionKeys = isFXL? fxlActionKeys : reflowActionKeys;
    const actionsItems: ThActionEntry<ActionKeyType>[] = [];

    if (actionsComponentsMap && Object.keys(actionsComponentsMap).length > 0) {
      actionKeys.forEach((key) => {      
        if (actionsComponentsMap[key]) {
          actionsItems.push({
            Trigger: actionsComponentsMap[key].Trigger,
            Target: actionsComponentsMap[key].Target,
            key: key
          });
        } else {
          console.warn(`Action key "${ key }" not found in the plugin registry while present in preferences.`);
        }
      });
    }
    
    return actionsItems;
  }, [isFXL, fxlActionKeys, reflowActionKeys, actionsComponentsMap]);

  return (
    <>
    <ThInteractiveOverlay 
      id="reader-header-overlay"
      className="bar-overlay"
      isActive={ isScroll && isImmersive && !isHovering }
      onMouseEnter={ setHover }
      onMouseLeave={ removeHover }
    />

    <ThHeader 
      className={ readerHeaderStyles.header } 
      id="top-bar" 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
      { ...focusWithinProps }
    >
      <ThRunningHead 
        label={ runningHead || Locale.reader.app.header.runningHeadFallback } 
        syncDocTitle={ true }
        aria-label={ Locale.reader.app.header.runningHead }
      />
      
      <StatefulCollapsibleActionsBar 
        id="reader-header-overflowMenu" 
        items={ listActionItems() }
        prefs={{ ...RSPrefs.actions, displayOrder: isFXL ? RSPrefs.actions.fxlOrder : RSPrefs.actions.reflowOrder }}
        className={ readerHeaderStyles.actionsWrapper } 
        aria-label={ Locale.reader.app.header.actions } 
        overflowActionCallback={ (isImmersive && !isHovering) }
        overflowMenuDisplay={ (!isImmersive || isHovering) }
      />
    </ThHeader>
    </>
  );
}