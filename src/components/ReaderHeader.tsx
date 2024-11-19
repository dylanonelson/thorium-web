import React from "react";

import Locale from "../resources/locales/en.json";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { Links } from "@readium/shared";

import classNames from "classnames";
import { useCollapsibility } from "@/hooks/useCollapsibility";
import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { OverflowMenu } from "./OverflowMenu";
import { RunningHead } from "./RunningHead";

export const ReaderHeader = ({ toc }: { toc: Links }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const Actions = useCollapsibility(toc);

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
      <RunningHead />
      
      <div 
        className={ readerHeaderStyles.actionsWrapper } 
        aria-label={ Locale.reader.app.header.actions }
      >
        { Actions.ActionIcons }
        
        { Actions.MenuItems.length > 0 && <OverflowMenu>
          { Actions.MenuItems }
        </OverflowMenu> }
      </div>
    </header>
    </>
  );
}