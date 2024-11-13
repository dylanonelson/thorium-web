import React, { useState } from "react";

import Locale from "../resources/locales/en.json";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { Links } from "@readium/shared";

import classNames from "classnames";
import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { OverflowMenu } from "./OverflowMenu";
import { SettingsActionIcon, SettingsMenuItem } from "./SettingsAction";
import { FullscreenMenuItem } from "./FullscreenAction";
import { TocMenuItem } from "./TocAction";
import { JumpToPositionMenuItem } from "./JumpToPositionAction";
import { ActionKeys } from "@/preferences";

export const ReaderHeader = ({ runningHead, toc }: { runningHead: string | undefined, toc: Links }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const [ActionIcons, setActionsIcons] = useState([
    <SettingsActionIcon key={ ActionKeys.settings } />
  ]);
  const [MenuItems, setMenuItems] = useState([
    <FullscreenMenuItem key={ ActionKeys.fullscreen } />,
    <TocMenuItem key={ ActionKeys.toc } toc={ toc } />,
    <JumpToPositionMenuItem key={ ActionKeys.jumpToPosition } />
  ]);

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

  return (
    <>
    <header 
      className={ classNames(readerHeaderStyles.header, handleClassNameFromState()) } 
      id="top-bar" 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <h1 aria-label={ Locale.reader.app.header.runningHead }>
        { runningHead
          ? runningHead
          : Locale.reader.app.header.runningHeadFallback }
      </h1>
      <div className={ readerHeaderStyles.actionsWrapper }>
        { ActionIcons }
        
        <OverflowMenu>
          { MenuItems }
        </OverflowMenu>
      </div>
    </header>
    </>
  );
}