import { ReactNode, useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import dockStyles from "./assets/styles/docking.module.css";

import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { BreakpointsDockingMap, DockTypes, DockingKeys, IDockPanelSizes } from "@/models/docking";
import { LayoutDirection } from "@/models/layout";
import { ActionsStateKeys } from "@/models/state/actionsState";

import { useRezisablePanel } from "@/hooks/useRezisablePanel";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { activateDockPanel, collapseDockPanel, deactivateDockPanel, expandDockPanel, setDockPanelWidth } from "@/lib/actionsReducer";

import { makeBreakpointsMap } from "@/helpers/breakpointsMap";
import parseTemplate from "json-templates";

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
  actionKey,
  side,
  sizes,
  isResizable,
  isPopulated
}: {
  actionKey: ActionsStateKeys | null;
  side: "left" | "right";
  sizes: IDockPanelSizes;
  isResizable: boolean;
  isPopulated: boolean; 
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

  const dockClassName = side === "right" ? "right-dock" : "left-dock";

  const makeDockLabel = useCallback(() => {    
    let label = "";
    if (side === "right") {
      label += Locale.reader.app.docking.dockingRight;
    } else {
      label += Locale.reader.app.docking.dockingLeft
    }
    if (!isPopulated) {
      if (actionKey) {
        const jsonTemplate = parseTemplate(Locale.reader.app.docking.dockingEmpty);
        // @ts-ignore
        label += ` – ${ jsonTemplate({ action: Locale.reader[actionKey].heading }) }`
      } else {
        label += ` – ${ Locale.reader.app.docking.dockingEmpty }`
      }
    }
    return label;
  }, [side, isPopulated, actionKey]);

  const handleDockPanelOrder = useCallback(() => {
    if (side === "right") {
      return RSPrefs.direction === LayoutDirection.rtl ? 1 : 3;
    } else if (side === "left") {
      return RSPrefs.direction === LayoutDirection.rtl ? 3 : 1;
    }
  }, [side]);

  const collapsePanel = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.collapse();
      dispatch(collapseDockPanel(dockKey));
    }
  }, [dispatch, dockKey]);

  const expandPanel = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.expand();
      dispatch(expandDockPanel(dockKey));
    }
  }, [dispatch, dockKey]);

  useEffect(() => {
    // TMP cos handling of dockedStart and dockedEnd in sheet 
    // is not yet implemented and will be more complex than that
    dispatch(activateDockPanel(dockKey));

    return () => {
      dispatch(deactivateDockPanel(dockKey));
    }
  }, [dispatch, dockKey]);

  useEffect(() => {
    isPopulated ? expandPanel() : collapsePanel();
  }, [isPopulated, collapsePanel, expandPanel]);

  return(
    <>
    { side === "right" && <DockHandle isResizable={ isResizable } /> } 
    <Panel 
      id={ `${ dockKey }-panel` } 
      order={ handleDockPanelOrder() } 
      collapsible={ true }
      collapsedSize={ 0 }
      ref={ panelRef }
      defaultSize={ isPopulated ? sizes.width : 0 } 
      minSize={ sizes.minWidth } 
      maxSize={ sizes.maxWidth }
      onCollapse={ collapsePanel }
      onExpand={ expandPanel }
      onResize={ (size: number) => size !== 0 && dispatch(setDockPanelWidth({
        key: dockKey,
        width: sizes.getCurrentPxWidth(size)
      }))}
    >
      <div 
        id={ dockKey } 
        aria-label={ makeDockLabel() }
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
    const dockingMap = makeBreakpointsMap<BreakpointsDockingMap>({
      defaultValue: DockTypes.both, 
      fromEnum: DockTypes, 
      pref: RSPrefs.docking.dock, 
      disabledValue: DockTypes.none
    });

    const dockConfig = staticBreakpoint && dockingMap[staticBreakpoint] || DockTypes.both;

    return (
      <>
      <PanelGroup onLayout={ resizeCallback } direction="horizontal">
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
            actionKey={ startPanel.currentKey() }
            side="left" 
            sizes={{
              width: startPanel.getWidth(),
              minWidth: startPanel.getMinWidth(),
              maxWidth: startPanel.getMaxWidth(),
              getCurrentPxWidth: startPanel.getCurrentPxWidth
            }} 
            isResizable={ startPanel.isResizable() }
            isPopulated={ startPanel.isPopulated() }
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
            actionKey={ endPanel.currentKey() }
            side="right" 
            sizes={{
              width: endPanel.getWidth(),
              minWidth: endPanel.getMinWidth(),
              maxWidth: endPanel.getMaxWidth(),
              getCurrentPxWidth: endPanel.getCurrentPxWidth
            }} 
            isResizable={ endPanel.isResizable() }
            isPopulated={ endPanel.isPopulated() }
          />
      }
      </PanelGroup>
    </>
    )
  }
}