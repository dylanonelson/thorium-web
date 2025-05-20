"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { spacingComponentsMap } from "./Settings/SettingsComponentsMap";
import { textComponentsMap } from "./Settings/SettingsComponentsMap";
import { settingsComponentsMap } from "./Settings/SettingsComponentsMap";
import { dockingComponentsMap } from "./Docking/DockingComponentsMap";
import { actionsComponentsMap } from "./Actions/ActionsComponentsMap";
import { StatefulActionsMapObject } from "./Actions/models/actions";
import { StatefulSettingsMapObject } from "./Settings/models/settings";
import { 
  ActionKeyType, 
  DockingKeyType, 
  SettingsKeyType, 
  SpacingSettingsKeyType, 
  TextSettingsKeyType 
} from "@/preferences";

export interface ComponentsMapContextValue {
  actionsComponentsMap: Record<ActionKeyType, StatefulActionsMapObject>;
  dockingComponentsMap: Record<DockingKeyType, StatefulActionsMapObject>;
  settingsComponentsMap: Record<SettingsKeyType, StatefulSettingsMapObject>;
  spacingComponentsMap: Record<SpacingSettingsKeyType, StatefulSettingsMapObject>;
  textComponentsMap: Record<TextSettingsKeyType, StatefulSettingsMapObject>;
}

export const ComponentsMapContext = createContext<ComponentsMapContextValue>({
  actionsComponentsMap,
  dockingComponentsMap,
  settingsComponentsMap,
  spacingComponentsMap,
  textComponentsMap
});

interface ComponentsMapProviderProps {
  children: ReactNode;
  value?: Partial<ComponentsMapContextValue>;
}

export const ComponentsMapProvider = ({ 
  children, 
  value = {} 
}: ComponentsMapProviderProps) => {
  const contextValue: ComponentsMapContextValue = {
    actionsComponentsMap: value.actionsComponentsMap || actionsComponentsMap,
    dockingComponentsMap: value.dockingComponentsMap || dockingComponentsMap,
    settingsComponentsMap: value.settingsComponentsMap || settingsComponentsMap,
    spacingComponentsMap: value.spacingComponentsMap || spacingComponentsMap,
    textComponentsMap: value.textComponentsMap || textComponentsMap
  };

  return (
    <ComponentsMapContext.Provider value={contextValue}>
      {children}
    </ComponentsMapContext.Provider>
  );
};

export const useComponentsMap = () => useContext(ComponentsMapContext);