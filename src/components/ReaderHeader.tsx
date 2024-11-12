import React from "react";

import { RSPrefs } from "../preferences";

import Locale from "../resources/locales/en.json";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import TargetIcon from "./assets/icons/target-icon.svg";

import { Links } from "@readium/shared";

import classNames from "classnames";
import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { SettingsAction } from "./SettingsAction";
import { FullscreenAction } from "./FullscreenAction";
import { TocAction } from "./TocAction";
import { OverflowMenu } from "./OverflowMenu";
import { OverflowMenuItem } from "./templateComponents/OverflowMenuItem";

import parseTemplate from "json-templates";

export const ReaderHeader = ({ runningHead, toc }: { runningHead: string | undefined, toc: Links }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const jsonTemplate = parseTemplate(RSPrefs.shortcuts.jumpToPosition);
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

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
        <SettingsAction />
        <FullscreenAction />
        <TocAction toc={ toc } />
        <OverflowMenu>
          <OverflowMenuItem
            SVG={ TargetIcon } 
            label={ Locale.reader.jumpToPosition.label }
            shortcut={ jsonTemplate({ PlatformKey: platformModifier.icon }) } 
            onActionCallback={ () => {} }
          />
        </OverflowMenu>
      </div>
    </header>
    </>
  );
}