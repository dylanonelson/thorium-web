import { useCallback, useEffect } from "react";

import { RSPrefs } from "@/preferences";

import { ActionsStateKeys, IActionStateObject } from "@/models/state/actionsState";
import { LayoutDirection } from "@/models/layout";
import { Docked, DockingKeys } from "@/models/docking";
import { ActionKeys } from "@/models/actions";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";
import { setJumpToPositionAction, setSettingsAction, setTocAction } from "@/lib/actionsReducer";

export const useDocking = (key?: ActionsStateKeys) => {
  const left = useAppSelector(state => state.reader.leftDock);
  const right = useAppSelector(state => state.reader.rightDock);
  const actionsState = useAppSelector(state => state.actions);
  const actionState = key ? actionsState[key] : null;

  const dispatch = useAppDispatch();

  const isOpen = actionState?.isOpen || false;
  const isDocked = actionState?.isDocked || DockingKeys.transient;
  const dockedWidth = actionState?.dockedWidth || RSPrefs.docking.defaultWidth;

  const isCurrentlyLeft = useCallback(() => {
    return key && key === left?.actionKey;
  }, [left]);

  const isCurrentlyRight = useCallback(() => {
    return key && key === right?.actionKey;
  }, [right]);

  const isCurrentlyDocked = useCallback(() => {
    return actionState?.isDocked === DockingKeys.left || actionState?.isDocked === DockingKeys.right;
  }, []);

  const isUndocked = useCallback(() => {
    return !isCurrentlyLeft() && !isCurrentlyRight();
  }, []);

  const removeFromDock = useCallback(() => {
    if (isCurrentlyLeft()) {
      dispatch(setLeftDock(null));
    } else if (isCurrentlyRight()) {
      dispatch(setRightDock(null));
    }
  }, []);

  const dockToSide = useCallback((docking: DockingKeys.left | DockingKeys.right, payload: Docked) => {
    if (docking === DockingKeys.left) {
      dispatch(setLeftDock(payload));
    } else {
      dispatch(setRightDock(payload));
    }
  }, []);

  const updateInDock = useCallback((payload: Docked) => {
    if (isCurrentlyLeft()) {
      dispatch(setLeftDock(payload));
    } else if (isCurrentlyRight()) {
      dispatch(setRightDock(payload));
    }
  }, []);

  const setAction = useCallback((payload: Partial<IActionStateObject>) => {
    if (!key) return;

    switch(key) {
      case ActionKeys.jumpToPosition:
        dispatch(setJumpToPositionAction(payload));
        break;
      case ActionKeys.settings:
        dispatch(setSettingsAction(payload));
        break;
      case ActionKeys.toc:
        dispatch(setTocAction(payload));
        break;
      default:
        break;
    }
  }, []);

  const setLeft = useCallback(() => {
    if (!key) return;

    setAction({ isDocked: DockingKeys.left });
  }, []);

  const setRight = useCallback(() => {
    if (!key) return; 

    setAction({ isDocked: DockingKeys.right });
  }, []);

  const setTransient = useCallback(() => {
    if (!key) return;

    setAction({ isDocked: DockingKeys.transient });
  }, []);

  const undock = useCallback(() => {
    removeFromDock();
    setTransient();
  }, []);

  const switchDock = useCallback(() => {
    if (!key || !isCurrentlyDocked()) return;

    if (isCurrentlyLeft()) {
      removeFromDock();
      setRight();
    } else if (isCurrentlyRight()) {
      removeFromDock();
      setLeft();
    }
  }, []);

  const setStart = useCallback(() => {
    if (!key) return;

    if (RSPrefs.direction === LayoutDirection.rtl) {
      if (isCurrentlyLeft()) {
        switchDock();
      } else {
        setRight();
      }
    } else {
      if (isCurrentlyRight()) {
        switchDock();
      } else {
        setLeft();
      }
    }
  }, []);

  const setEnd = useCallback(() => {
    if (!key) return; 

    if (RSPrefs.direction === LayoutDirection.rtl) {
      if (isCurrentlyRight()) {
        switchDock();
      } else {
        setLeft();
      }
    } else {
      if (isCurrentlyLeft()) {
        switchDock();
      } else {
        setRight();
      }
    }
  }, []);

  useEffect(() => {
    if (!key || isDocked === DockingKeys.transient) return;

    if (isCurrentlyDocked()) {
      updateInDock({
        actionKey: key,
        active: isOpen,
        width: dockedWidth
      });
    } else {
      dockToSide(isDocked, {
        actionKey: key,
        active: isOpen,
        width: dockedWidth
      });
    }
  }, [isDocked, isOpen, dockedWidth]);

  return {
    left,
    right,
    isCurrentlyLeft,
    isCurrentlyRight, 
    isUndocked,
    setStart,
    setEnd,
    undock
  }
}