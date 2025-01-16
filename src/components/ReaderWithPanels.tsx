import { ReactNode, useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import dockStyles from "./assets/styles/docking.module.css";

import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { BreakpointsDockingMap, DockTypes, DockingKeys, IDockPanelSizes } from "@/models/docking";
import { LayoutDirection } from "@/models/layout";

import { useRezisablePanel } from "@/hooks/useRezisablePanel";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { makeBreakpointsMap } from "@/helpers/breakpointsMap";
import { activateDockPanel, collapseDockPanel, deactivateDockPanel, expandDockPanel } from "@/lib/actionsReducer";

const DockHandle = ({ isResizable }: { isResizable: boolean }) => {
  return(
    <>
    <PanelResizeHandle 
      className={ dockStyles.dockResizeHandle }
      disabled={ !isResizable }
    >
      { isResizable && <div className={ dockStyles.dockResizeHandleGrab }></div> }
    </PanelResizeHandle>
    </>
  )
};

const DockPanel = ({
  side,
  sizes,
  isResizable,
  isActive
}: { 
  side: "left" | "right";
  sizes: IDockPanelSizes;
  isResizable: boolean;
  isActive: boolean; 
}) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const dispatch = useAppDispatch();

  const dockKey = side === "right" 
    ? RSPrefs.direction === LayoutDirection.rtl 
      ? DockingKeys.start 
      : DockingKeys.end 
    : RSPrefs.direction === LayoutDirection.rtl 
      ? DockingKeys.end 
      : DockingKeys.start;
  const dockLabel = side === "right" ? Locale.reader.app.dockingRight : Locale.reader.app.dockingLeft;
  const dockClassName = side === "right" ? "right-dock" : "left-dock";

  const handleDockPanelOrder = useCallback(() => {
    if (side === "right") {
      return RSPrefs.direction === LayoutDirection.rtl ? 1 : 3;
    } else if (side === "left") {
      return RSPrefs.direction === LayoutDirection.rtl ? 3 : 1;
    }
  }, [side]);

  useEffect(() => {
    if (!isActive) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  }, [isActive]);

  useEffect(() => {
    // TMP cos handling of dockedStart and dockedEnd in sheet 
    // is not yet implemented and will be more complex than that
    dispatch(activateDockPanel(dockKey));

    return () => {
      dispatch(deactivateDockPanel(dockKey));
    }
  }, [dispatch, dockKey]);

  return(
    <>
    { side === "right" && <DockHandle isResizable={ isResizable } /> } 
    <Panel 
      id={ `${ dockKey }-panel` } 
      order={ handleDockPanelOrder() } 
      collapsible={ true }
      ref={ panelRef }
      onCollapse={ () => { dispatch(collapseDockPanel(dockKey)) }} 
      onExpand={() => { dispatch(expandDockPanel(dockKey)) }}
      defaultSize={ sizes.width } 
      minSize={ sizes.minWidth } 
      maxSize={ sizes.maxWidth }
    >
      <div 
        id={ dockKey } 
        aria-label={ dockLabel }
        className={ dockClassName }
      ></div>
    </Panel>
    { side === "left" && <DockHandle isResizable={ isResizable } /> } 
  </>
  );
};

export const ReaderWithDock = ({ 
  resizeCallback,
  children, 
}: { 
  resizeCallback: () => void;
  children: ReactNode; 
}) => {
  const dockingStart = useAppSelector(state => state.actions.dock[DockingKeys.start]);
  const dockingEnd = useAppSelector(state => state.actions.dock[DockingKeys.end])
  const startPanel = useRezisablePanel(dockingStart);
  const endPanel = useRezisablePanel(dockingEnd);

  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);

  if (!RSPrefs.docking.dock) {
    return(
      <>
      { children }
      </>
    )
  } else {
    const dockingMap = makeBreakpointsMap<BreakpointsDockingMap>(DockTypes.both, DockTypes, RSPrefs.docking.dock, DockTypes.none);

    const dockConfig = staticBreakpoint && dockingMap[staticBreakpoint] || DockTypes.both;

    return (
      <>
      <PanelGroup onLayout={ resizeCallback } autoSaveId="reader-dock" direction="horizontal">
        { (
            (
            RSPrefs.direction === LayoutDirection.ltr &&
            (dockConfig === DockTypes.both || dockConfig === DockTypes.start) 
            ) 
            ||
            (
            RSPrefs.direction === LayoutDirection.rtl &&
            (dockConfig === DockTypes.both || dockConfig === DockTypes.end) 
            )  
          ) 
          && <DockPanel 
            side="left" 
            sizes={{
              width: startPanel.getWidth(),
              minWidth: startPanel.getMinWidth(),
              maxWidth: startPanel.getMaxWidth()
            }} 
            isResizable={ startPanel.isResizable() }
            isActive={ startPanel.isActive() }
          />
        }
    
        <Panel id="main-panel" order={ 2 }>
          { children }
        </Panel>
    
        { (
            (
            RSPrefs.direction === LayoutDirection.ltr &&
            (dockConfig === DockTypes.both || dockConfig === DockTypes.end) 
            ) 
            ||
            (
            RSPrefs.direction === LayoutDirection.rtl &&
            (dockConfig === DockTypes.both || dockConfig === DockTypes.start) 
            )  
          )
        && <DockPanel 
            side="right" 
            sizes={{
              width: endPanel.getWidth(),
              minWidth: endPanel.getMinWidth(),
              maxWidth: endPanel.getMaxWidth()
            }} 
            isResizable={ endPanel.isResizable() }
            isActive={ endPanel.isActive() }
          />
      }
      </PanelGroup>
    </>
    )
  }
}