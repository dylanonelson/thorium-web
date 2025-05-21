import { ThSettingsEntry } from "@/packages/Components";
import { StatefulActionsMapObject } from "../Actions";

export enum ThPluginType {
  ACTION = "action",
  SETTING = "setting",
}

export type ActionComponent = StatefulActionsMapObject;

export interface SettingComponent extends ThSettingsEntry {
  type?: "text" | "spacing";
  props?: any;
}

export interface ThPlugin {
  id: string;
  name: string;
  description?: string;
  version?: string;
  components: {
    actions?: Record<string, ActionComponent>;
    settings?: Record<string, SettingComponent>;
  };
}

// Store plugins in a module-level variable to ensure persistence
const pluginsStore: ThPlugin[] = [];

class PluginRegistryClass {
  register(plugin: ThPlugin): void {
    const existingPluginIndex = pluginsStore.findIndex(p => p.id === plugin.id);
    
    if (existingPluginIndex >= 0) {
      pluginsStore[existingPluginIndex] = plugin;
    } else {
      pluginsStore.push(plugin);
    }
  }
  
  unregister(pluginId: string): void {
    const filteredPlugins = pluginsStore.filter(plugin => plugin.id !== pluginId);
    
    // Clear the array and repopulate it
    pluginsStore.length = 0;
    pluginsStore.push(...filteredPlugins);
  }
  
  getPlugins(): ThPlugin[] {
    return [...pluginsStore];
  }
  
  getComponentMaps() {    
    const actionsComponentsMap: Record<string, ActionComponent> = {} as Record<string, ActionComponent>;
    const settingsComponentsMap: Record<string, SettingComponent> = {} as Record<string, SettingComponent>;
    
    // Process plugins in reverse order so later plugins override earlier ones
    [...pluginsStore].reverse().forEach(plugin => {      
      // Merge actions components
      if (plugin.components.actions) {
        Object.entries(plugin.components.actions).forEach(([key, component]) => {
          actionsComponentsMap[key as string] = component;
        });
      }
      
      // Merge settings components
      if (plugin.components.settings) {
        Object.entries(plugin.components.settings).forEach(([key, component]) => {
          settingsComponentsMap[key as string] = component;
        });
      }
    });
    
    return {
      actionsComponentsMap,
      settingsComponentsMap
    };
  }
}

// Export singleton instance
export const ThPluginRegistry = new PluginRegistryClass();