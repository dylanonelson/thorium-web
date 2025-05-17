"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { spacingComponentsMap } from "./Settings/SettingsComponentsMap";
import { textComponentsMap } from "./Settings/SettingsComponentsMap";
import { settingsComponentsMap } from "./Settings/SettingsComponentsMap";
import { dockingComponentsMap } from "./Docking/DockingComponentsMap";
import { actionsComponentsMap } from "./Actions/ActionsComponentsMap";
import { StatefulActionsMapObject } from "./Actions/models/actions";
import { StatefulSettingsMapObject } from "./Settings/models/settings";
import { ThActionsKeys, ThDockingKeys, ThSettingsKeys, ThSpacingSettingsKeys, ThTextSettingsKeys } from "@/preferences/models/enums";

export interface ComponentsMapContextValue {
  actionsComponentsMap: Record<ThActionsKeys, StatefulActionsMapObject>;
  dockingComponentsMap: Record<ThDockingKeys, StatefulActionsMapObject>;
  settingsComponentsMap: Record<ThSettingsKeys, StatefulSettingsMapObject>;
  spacingComponentsMap: Record<ThSpacingSettingsKeys, StatefulSettingsMapObject>;
  textComponentsMap: Record<ThTextSettingsKeys, StatefulSettingsMapObject>;
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