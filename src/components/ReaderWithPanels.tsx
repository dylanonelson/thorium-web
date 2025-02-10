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
import classNames from "classnames";
import parseTemplate from "json-templates";

const DockHandle = ({
  flow,
  isResizable,
  isPopulated, 
  hasDragIndicator
}: { 
  flow: DockingKeys.start | DockingKeys.end;
  isResizable: boolean;
  isPopulated: boolean;
  hasDragIndicator?: boolean;
}) => {
  const handleID = `${ flow }-resize-handle`;

  const direction = useAppSelector(state => state.reader.direction);

  const classFromFlow = useCallback(() => {
    if (flow === DockingKeys.start) {
      return direction === LayoutDirection.ltr ? dockStyles.dockResizeHandleGrabLeft : dockStyles.dockResizeHandleGrabRight;
    } else if (flow === DockingKeys.end) {
      return direction === LayoutDirection.ltr ? dockStyles.dockResizeHandleGrabRight : dockStyles.dockResizeHandleGrabLeft;
    }
  }, [flow, direction]);

  return(
    <>
    <PanelResizeHandle 
      id={ handleID } 
      className={ dockStyles.dockResizeHandle }
      disabled={ !isResizable }
      tabIndex={ isPopulated ? 0 : -1 }
    >
      { isResizable && hasDragIndicator && 
        <div className={ classNames(dockStyles.dockResizeHandleGrab, classFromFlow()) }></div> 
      }
    </PanelResizeHandle>
    </>
  )
};

const DockPanel = ({
  actionKey,
  flow,
  sizes,
  isResizable,
  isPopulated,
  forceExpand,
  hasDragIndicator 
}: {
  actionKey: ActionsStateKeys | null;
  flow: DockingKeys.start | DockingKeys.end;
  sizes: IDockPanelSizes;
  isResizable: boolean;
  isPopulated: boolean;
  forceExpand: boolean;
  hasDragIndicator?: boolean;
}) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const direction = useAppSelector(state => state.reader.direction);
  const dispatch = useAppDispatch();

  const dockClassName = flow === DockingKeys.end && direction === LayoutDirection.ltr ? "right-dock" : "left-dock";

  const makeDockLabel = useCallback(() => {    
    let label = "";
    if (flow === DockingKeys.end && direction === LayoutDirection.ltr) {
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
  }, [flow, direction, isPopulated, actionKey]);

  const collapsePanel = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.collapse();
      dispatch(collapseDockPanel(flow));
    }
  }, [dispatch, flow]);

  const expandPanel = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.expand();
      dispatch(expandDockPanel(flow));
    }
  }, [dispatch, flow]);

  useEffect(() => {
    dispatch(activateDockPanel(flow));

    return () => {
      dispatch(deactivateDockPanel(flow));
    }
  }, [dispatch, flow]);

  useEffect(() => {
    isPopulated || forceExpand ? expandPanel() : collapsePanel();
  }, [isPopulated, forceExpand, collapsePanel, expandPanel]);

  return(
    <>
    { flow === DockingKeys.end &&
      <DockHandle 
        flow={ DockingKeys.end } 
        isResizable={ isResizable } 
        isPopulated={ isPopulated }
        hasDragIndicator={ hasDragIndicator } 
      /> 
    } 
    <Panel 
      id={ `${ flow }-panel` } 
      order={ flow === DockingKeys.end ? 3 : 1 } 
      collapsible={ true }
      collapsedSize={ 0 }
      ref={ panelRef }
      defaultSize={ isPopulated ? sizes.width : 0 } 
      minSize={ sizes.minWidth } 
      maxSize={ sizes.maxWidth }
      onCollapse={ collapsePanel }
      onExpand={ expandPanel }
      onResize={ (size: number) => size !== 0 && dispatch(setDockPanelWidth({
        key: flow,
        width: sizes.getCurrentPxWidth(size)
      }))}
    >
      <div 
        id={ flow } 
        aria-label={ makeDockLabel() }
        className={ dockClassName }
      ></div>
    </Panel>
    { flow === DockingKeys.start && 
      <DockHandle 
        flow={ DockingKeys.start } 
        isResizable={ isResizable } 
        isPopulated={ isPopulated } 
        hasDragIndicator={ hasDragIndicator } 
      /> 
    } 
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
        { 
          (dockConfig === DockTypes.both || dockConfig === DockTypes.start) 
          && <DockPanel 
            actionKey={ startPanel.currentKey() }
            flow={ DockingKeys.start } 
            sizes={{
              width: startPanel.getWidth(),
              minWidth: startPanel.getMinWidth(),
              maxWidth: startPanel.getMaxWidth(),
              getCurrentPxWidth: startPanel.getCurrentPxWidth
            }} 
            isResizable={ startPanel.isResizable() }
            isPopulated={ startPanel.isPopulated() }
            forceExpand={ startPanel.forceExpand() }
            hasDragIndicator={ startPanel.hasDragIndicator() }
          />
        }
    
        <Panel id="main-panel" order={ 2 }>
          { children }
        </Panel>
    
        { 
          (dockConfig === DockTypes.both || dockConfig === DockTypes.end)
          && <DockPanel 
            actionKey={ endPanel.currentKey() }
            flow={ DockingKeys.end } 
            sizes={{
              width: endPanel.getWidth(),
              minWidth: endPanel.getMinWidth(),
              maxWidth: endPanel.getMaxWidth(),
              getCurrentPxWidth: endPanel.getCurrentPxWidth
            }} 
            isResizable={ endPanel.isResizable() }
            isPopulated={ endPanel.isPopulated() }
            forceExpand={ endPanel.forceExpand() }
            hasDragIndicator={ endPanel.hasDragIndicator() }
          />
      }
      </PanelGroup>
    </>
    )
  }
}