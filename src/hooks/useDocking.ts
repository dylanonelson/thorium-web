import { useCallback, useEffect } from "react";

import { RSPrefs } from "@/preferences";

import { DockTypes, BreakpointsDockingMap, DockingKeys } from "@/models/docking";
import { BreakpointsSheetMap, SheetTypes } from "@/models/sheets";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { makeBreakpointsMap } from "@/helpers/breakpointsMap";
import { dockAction, setActionOpen, setActionPref } from "@/lib/actionsReducer";
import { ActionsStateKeys } from "@/models/state/actionsState";
import { ActionKeys } from "@/models/actions";

let dockingMap: Required<BreakpointsDockingMap> | null = null;

export const useDocking = (key: ActionsStateKeys) => {
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
  const actionState = useAppSelector(state => state.actions.keys[key]);
  const dispatch = useAppDispatch();

  if (!dockingMap) {
    dockingMap = makeBreakpointsMap<BreakpointsDockingMap>(DockTypes.both, DockTypes, RSPrefs.docking.dock, DockTypes.none);
  }
  const currentDockConfig = staticBreakpoint && dockingMap[staticBreakpoint];
  const dockablePref = RSPrefs.actions.keys[key].docked?.dockable || DockTypes.none;

  const defaultSheet = RSPrefs.actions.keys[key].sheet?.defaultSheet || SheetTypes.popover;

  const sheetMap = makeBreakpointsMap<BreakpointsSheetMap>(RSPrefs.actions.keys[key].sheet?.defaultSheet || SheetTypes.popover, SheetTypes, RSPrefs.actions.keys[key].sheet?.breakpoints);
  const sheetPref = staticBreakpoint && sheetMap[staticBreakpoint] || defaultSheet;
  
  const getDocker = useCallback((): DockingKeys[] => {
    // First let’s handle the cases where docker shouldn’t be used
    // The sheet is not dockable, per key.docked.dockable pref
    if (dockablePref === DockTypes.none) return [];
    // There’s no docking slot available, per docking.dock pref
    if (currentDockConfig === DockTypes.none) return [];
    // The sheet type is not compatible with docking
    if (sheetPref === SheetTypes.fullscreen) return [];

    // We can now build the docker from the display order
    let dockerKeys: DockingKeys[] = [];
    // In order for an action to be dockable, the dock slot has to exist
    // and the dockable preference of key.docked should match the values
    RSPrefs.docking.displayOrder.forEach((dockingKey: DockingKeys) => {
      switch(dockingKey) {
        case DockingKeys.transient:
          // We already handled both cases for none 
          dockerKeys.push(dockingKey);
          break;
        case DockingKeys.start:
          if (
              (currentDockConfig === DockTypes.both ||
              currentDockConfig === DockTypes.start) && 
              (dockablePref === DockTypes.both || 
              dockablePref === DockTypes.start)
          ) {
            dockerKeys.push(dockingKey);
          }
          break;
        case DockingKeys.end:
          if (
            (currentDockConfig === DockTypes.both ||
            currentDockConfig === DockTypes.end) && 
            (dockablePref === DockTypes.both || 
            dockablePref === DockTypes.end)
        ) {
          dockerKeys.push(dockingKey);
        }
          break;
        default:
          break;
      }
    });

    // If the action can only be transient, then it can’t be docked
    if (dockerKeys.length === 1 && dockerKeys[0] === DockingKeys.transient) return [];

    return dockerKeys;
  }, [currentDockConfig, sheetPref, dockablePref]);

  const getSheetType = useCallback(() => {
    // We need to check whether the user has docked the action themselves
    // ActionsReducer should has also made sure there is no conflict to handle here 
    // by updating states of actions on docking
    // We need to take care of potential conflicts on init though

    switch (actionState.docking) {
      
      // if action.docking is transient we need to check the pref, 
      // it can be docked and in that case we need to pick the default
      case DockingKeys.transient:
        if (sheetPref === SheetTypes.dockedStart || sheetPref === SheetTypes.dockedEnd) {
          return defaultSheet;
        } else {
          return sheetPref;
        }
      
      // If action.docking is set to start/end then we check the docking slot is available
      case DockingKeys.start:
        if (
            (dockablePref === DockTypes.both || dockablePref === DockTypes.start) && 
            (currentDockConfig === DockTypes.both || currentDockConfig === DockTypes.start)
          ) {
          return SheetTypes.dockedStart;
        } else {
          // if the pref is not docked start, return the pref 
          // else return the default
          if (sheetPref !== SheetTypes.dockedStart) {
            return sheetPref;
          } else {
            return defaultSheet;
          }
        }

      case DockingKeys.end:
        if (
            (dockablePref === DockTypes.both || dockablePref === DockTypes.end) &&
            (currentDockConfig === DockTypes.both || currentDockConfig === DockTypes.end)
            ) {
          return SheetTypes.dockedEnd;
        } else {
          // if the pref is not docked end, return the pref 
          // else return the default
          if (sheetPref !== SheetTypes.dockedEnd) {
            return sheetPref;
          } else {
            return defaultSheet;
          }
        }
      
      // If action.docking is null then we rely on pref 
      // as it means the user did not pick another option
      case null:
        // We have to check sheetPref is compatible with docking prefs
        if (sheetPref === SheetTypes.dockedStart) {
          if (
              (dockablePref === DockTypes.both || dockablePref === DockTypes.start) &&
              (currentDockConfig === DockTypes.both || currentDockConfig === DockTypes.start)
            ) {
            return SheetTypes.dockedStart;
          } else {
            return defaultSheet;
          }
        } else if (sheetPref === SheetTypes.dockedEnd) {
          if (
             (dockablePref === DockTypes.both || dockablePref === DockTypes.end) &&
             (currentDockConfig === DockTypes.both || currentDockConfig === DockTypes.end)
          ) {
            return SheetTypes.dockedEnd;
          } else {
            return defaultSheet;
          }
        } else {
          return sheetPref;
        }
      default:
        return defaultSheet;
    }
  }, [currentDockConfig, dockablePref, sheetPref, defaultSheet, actionState]);

  useEffect(() => {
    // Update action state pref as side effect
    sheetPref && dispatch(setActionPref({
      key: key,
      sheetPref: sheetPref
    }));
  }, [dispatch, key, sheetPref]);

  // on mount, check whether we should update states for docked sheets
  useEffect(() => {
    const sheetType = getSheetType();

    if (actionState.isOpen === null) {
      if (sheetType === SheetTypes.dockedStart) {
        dispatch(dockAction({
          key: ActionKeys[key],
          dockingKey: DockingKeys.start
        }));
        dispatch(setActionOpen({
          key: ActionKeys[key],
          isOpen: true
        }));
      } else if (sheetType === SheetTypes.dockedEnd) {
        dispatch(dockAction({
          key: ActionKeys[key],
          dockingKey: DockingKeys.end
        }));
        dispatch(setActionOpen({
          key: ActionKeys[key],
          isOpen: true
        }));
      }
    }
  })

  return {
    getDocker,
    getSheetType
  }
}