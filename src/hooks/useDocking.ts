import { useCallback, useEffect } from "react";

import { RSPrefs } from "@/preferences";

import { DockTypes, BreakpointsDockingMap, IDockingProps, DockingKeys } from "@/models/docking";
import { SheetTypes } from "@/models/sheets";

import { useAppSelector } from "@/lib/hooks";
import { makeBreakpointsMap } from "@/helpers/breakpointsMap";

let dockPref: Required<BreakpointsDockingMap> | null = null;

export const useDocking = ({
  key
}: IDockingProps) => {
  if (!dockPref) {
    dockPref = makeBreakpointsMap<BreakpointsDockingMap>(DockTypes.both, DockTypes, RSPrefs.docking.dock, DockTypes.none);
  }
  const dockablePref = RSPrefs.actions.keys[key].docked?.dockable || DockTypes.none;
    
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
  
  const sheetPref = staticBreakpoint && RSPrefs.actions.keys[key].sheet && RSPrefs.actions.keys[key].sheet[staticBreakpoint];
  const currentDockConfig = staticBreakpoint && dockPref[staticBreakpoint];

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

  // If a slot is removed, active should be set to false, in order to keep
  // the action docked on responsive, but display another type of sheet 
  // based on preferences (breakpoint map)
  // If a slot is added, active should be set to true
  // We also need to sync action.key isOpen

  // The preference for the type of sheet should only be honored 
  // if the dock slot is empty since we don’t want to override users’ customization

  return {
    getDocker
  }
}