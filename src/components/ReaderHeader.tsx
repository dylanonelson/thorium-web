import React, { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { ActionKeys } from "./Templates/ActionComponent";
import { FullscreenAction } from "./FullscreenAction";
import { JumpToPositionAction } from "./JumpToPositionAction";
import { SettingsAction } from "./SettingsAction";
import { TocAction } from "./TocAction";
import { RunningHead } from "./RunningHead";
import { ActionsWithCollapsibility } from "./ActionsWithCollapsibility";

import { IActionsItem } from "./Actions";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

const ActionsMap = {
  [ActionKeys.fullscreen]: FullscreenAction,
  [ActionKeys.jumpToPosition]: JumpToPositionAction,
  [ActionKeys.settings]: SettingsAction,
  [ActionKeys.toc]: TocAction
}

export const ReaderHeader = () => {
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
    const actionsItems: IActionsItem[] = [];

    actionsOrder.current.map((key: ActionKeys) => {
      actionsItems.push({
        Comp: ActionsMap[key],
        key: key
      });
    });
    
    return actionsItems;
  }, []);

  return (
    <>
    <header 
      className={ classNames(readerHeaderStyles.header, handleClassNameFromState()) } 
      id="top-bar" 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <RunningHead syncDocTitle={ true } />
      
      <ActionsWithCollapsibility 
        items={ listActionItems() }
        prefs={ RSPrefs.actions }
        className={ readerHeaderStyles.actionsWrapper } 
        label={ Locale.reader.app.header.actions } 
      //  overflowActionCallback={ true }
      />
    </header>
    </>
  );
}