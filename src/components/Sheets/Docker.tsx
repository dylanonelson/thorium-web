import React, { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import dockerStyles from "../assets/styles/docker.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import DockToLeft from "../assets/icons/dock_to_right.svg";
import DocktoRight from "../assets/icons/dock_to_left.svg";
import Stack from "../assets/icons/stack.svg";
import Close from "../assets/icons/close.svg";

import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";
import { Dockable, SheetTypes } from "./Sheet";
import { ActionKeys } from "../Templates/ActionComponent";

export interface IDocker {
  id: ActionKeys;
  ref: React.ForwardedRef<HTMLButtonElement>;
  onStackCallback: () => void;
  onCloseCallback: () => void;
}

export const Docker = ({
  id,
  ref,
  onStackCallback,
  onCloseCallback
}: IDocker) => {
  const offset = useRef<number>(RSPrefs.theming.icon.tooltipOffset || 0);
  const pref = useRef<Dockable>(RSPrefs.actions.keys[id].dockable || Dockable.none);

  const leftDock = useAppSelector(state => state.reader.leftDock);
  const rightDock = useAppSelector(state => state.reader.rightDock);
  const isStacked = (leftDock !== id && rightDock !== id);

  const dispatch = useAppDispatch();

  const handleCurrentState = useCallback((type: SheetTypes) => {
    switch(type) {
      case SheetTypes.dockedLeft:
        dispatch(setLeftDock(id));
        dispatch(setRightDock(null));
        break;
      case SheetTypes.dockedRight:
        dispatch(setLeftDock(null));
        dispatch(setRightDock(id));
        break;
      case SheetTypes.fullscreen:
      case SheetTypes.popover:
        dispatch(setLeftDock(null));
        dispatch(setRightDock(null));
      default:
        break;
    }
  }, [dispatch, id]);

  return(
    <>
    <div className={ dockerStyles.dockerWrapper }>
      { pref.current === Dockable.both || pref.current === Dockable.left 
        ? <TooltipTrigger>
          <Button 
            className={ readerSharedUI.dockerButton } 
            aria-label={ Locale.reader.app.docker.dockToLeft.trigger } 
            onPress={ () => handleCurrentState(SheetTypes.dockedLeft) } 
            isDisabled={ leftDock === id }
          >
            <DockToLeft aria-hidden="true" focusable="false" />  
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement="bottom" 
            offset={ offset.current }
          >
            { Locale.reader.app.docker.dockToLeft.tooltip }
          </Tooltip>
        </TooltipTrigger>
      : <></> }

    { pref.current === Dockable.both || pref.current === Dockable.right
      ? <TooltipTrigger>
          <Button 
            className={ readerSharedUI.dockerButton } 
            aria-label={ Locale.reader.app.docker.dockToRight.trigger } 
            onPress={ () => handleCurrentState(SheetTypes.dockedRight) } 
            isDisabled={ rightDock === id }
          >
            <DocktoRight aria-hidden="true" focusable="false" />  
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement="bottom" 
            offset={ offset.current }
          >
            { Locale.reader.app.docker.dockToRight.tooltip }
          </Tooltip>
        </TooltipTrigger>
      : <></> }

    { pref.current !== Dockable.none
      ? <TooltipTrigger>
          <Button 
            className={ readerSharedUI.dockerButton } 
            aria-label={ Locale.reader.app.docker.stack.trigger } 
            onPress={ () => handleCurrentState(SheetTypes.popover) } 
            isDisabled={ isStacked }
          >
            <Stack aria-hidden="true" focusable="false" />  
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement="bottom" 
            offset={ offset.current }
          >
            { Locale.reader.app.docker.stack.tooltip }
          </Tooltip>
        </TooltipTrigger>
      : <></> }

    { pref.current !== Dockable.none
      ? <TooltipTrigger>
          <Button 
            ref={ ref }
            className={ readerSharedUI.dockerButton } 
            aria-label={ Locale.reader.app.docker.close.trigger } 
            onPress={ onCloseCallback }
          >
            <Close aria-hidden="true" focusable="false" />  
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement="bottom" 
            offset={ offset.current }
          >
            { Locale.reader.app.docker.close.tooltip }
          </Tooltip>
        </TooltipTrigger>
        : <Button 
          ref={ ref }
          className={ readerSharedUI.closeButton } 
          aria-label={ Locale.reader.app.docker.close.trigger } 
          onPress={ onCloseCallback }
        >
          <Close aria-hidden="true" focusable="false" />
        </Button> }
    </div>
    </>
  )
}