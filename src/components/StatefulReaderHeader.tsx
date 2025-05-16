"use client";

import React, { useCallback, useContext, useRef } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../resources/locales/en.json";

import { ThActionsKeys } from "@/preferences/models/enums";
import { StatefulActionsMapObject } from "./Actions/models/actions";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { ThActionEntry } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { ThHeader  } from "@/packages/Components/Reader/ThHeader";
import { ThRunningHead } from "@/packages/Components/Reader/ThRunningHead";
import { StatefulCollapsibleActionsBar } from "./Actions/StatefulCollapsibleActionsBar";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

export interface StatefulReaderHeaderProps {
  componentsMap: { [key: string | number | symbol]: StatefulActionsMapObject }
}

export const StatefulReaderHeader = ({
  componentsMap
}: StatefulReaderHeaderProps) => {
  const RSPrefs = useContext(PreferencesContext);
  
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const runningHead = useAppSelector(state => state.publication.runningHead);
  const actionsOrder = useRef(RSPrefs.actions.displayOrder);
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
    const actionsItems: ThActionEntry<ThActionsKeys>[] = [];

    actionsOrder.current.map((key) => {
      if (key !== ThActionsKeys.layoutStrategy || !isFXL) {
        actionsItems.push({
          Trigger: componentsMap[key].trigger,
          Target: componentsMap[key].target,
          key: key
        });
      }
    });
    
    return actionsItems;
  }, [isFXL, componentsMap]);

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
        prefs={ RSPrefs.actions }
        className={ readerHeaderStyles.actionsWrapper } 
        aria-label={ Locale.reader.app.header.actions } 
        overflowActionCallback={ (isImmersive && !isHovering) }
        overflowMenuDisplay={ (!isImmersive || isHovering) }
      />
    </ThHeader>
    </>
  );
}