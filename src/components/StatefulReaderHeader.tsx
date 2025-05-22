"use client";

import React, { useCallback } from "react";

import { ActionKeyType, usePreferenceKeys } from "@/preferences";

import Locale from "../resources/locales/en.json";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { ThActionEntry } from "@/packages/Components/Actions/ThActionsBar";
import { ThHeader  } from "@/packages/Components/Reader/ThHeader";
import { ThRunningHead } from "@/packages/Components/Reader/ThRunningHead";
import { StatefulCollapsibleActionsBar } from "./Actions/StatefulCollapsibleActionsBar";

import { usePlugins } from "./Plugins/PluginProvider";
import { usePreferences } from "@/preferences/ThPreferencesContext";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

export const StatefulReaderHeader = () => {
  const { reflowActionKeys, fxlActionKeys } = usePreferenceKeys();
  const RSPrefs = usePreferences();
  const { actionsComponentsMap } = usePlugins();
  
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const runningHead = useAppSelector(state => state.publication.runningHead);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && isHovering) {
      className = readerStateStyles.immersiveHovering;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
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
        }
      });
    }
    
    return actionsItems;
  }, [isFXL, fxlActionKeys, reflowActionKeys, actionsComponentsMap]);

  return (
    <>
    <ThHeader 
      className={ classNames(readerHeaderStyles.header, handleClassNameFromState()) } 
      id="top-bar" 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
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