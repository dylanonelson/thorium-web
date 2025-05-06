import React, { useCallback, useContext, useRef } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../resources/locales/en.json";

import { ActionKeys, IActionsMapObject } from "@/models/actions";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { ThHeader, ThActionEntry, ThRunningHead } from "@/packages/Components";
import { FullscreenAction } from "./FullscreenAction";
import { JumpToPositionAction } from "./JumpToPositionAction";
import { LayoutStrategyAction, LayoutStrategiesActionContainer } from "./LayoutStrategyAction";
import { SettingsAction, SettingsActionContainer } from "./SettingsAction";
import { TocAction, TocActionContainer } from "./TocAction";
import { ActionsWithCollapsibility } from "./ActionsWithCollapsibility";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

const ActionsMap: { [key in ActionKeys]: IActionsMapObject } = {
  [ActionKeys.fullscreen]: {
    trigger: FullscreenAction
  },
  [ActionKeys.jumpToPosition]: {
    trigger: JumpToPositionAction
  },
  [ActionKeys.layoutStrategy]: {
    trigger: LayoutStrategyAction,
    target: LayoutStrategiesActionContainer
  },
  [ActionKeys.settings]: {
    trigger: SettingsAction,
    target: SettingsActionContainer
  },
  [ActionKeys.toc]: {
    trigger: TocAction,
    target: TocActionContainer
  }
}

export const ReaderHeader = () => {
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
    const actionsItems: ThActionEntry<ActionKeys>[] = [];

    actionsOrder.current.map((key: ActionKeys) => {
      if (key !== ActionKeys.layoutStrategy || !isFXL) {
        actionsItems.push({
          Trigger: ActionsMap[key].trigger,
          Target: ActionsMap[key].target,
          key: key
        });
      }
    });
    
    return actionsItems;
  }, [isFXL]);

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
      
      <ActionsWithCollapsibility 
        id="reader-header-overflowMenu" 
        items={ listActionItems() }
        prefs={ RSPrefs.actions }
        className={ readerHeaderStyles.actionsWrapper } 
        label={ Locale.reader.app.header.actions } 
        overflowActionCallback={ (isImmersive && !isHovering) }
        overflowMenuDisplay={ (!isImmersive || isHovering) }
      />
    </ThHeader>
    </>
  );
}