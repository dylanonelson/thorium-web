"use client";

import { useCallback, useEffect, useState } from "react";

import { ThActionsDockedPref } from "@/preferences";

import { DockStateObject } from "@/lib/actionsReducer";

import { useActions } from "@/core/Components/Actions/hooks/useActions";
import { usePrevious } from "@/core/Hooks/usePrevious";
import { usePreferences } from "@/preferences/ThPreferencesContext";

import { useAppSelector } from "@/lib/hooks";

export const useResizablePanel = (panel: DockStateObject) => {
  const RSPrefs = usePreferences();
  const defaultWidth = RSPrefs.theming.layout.defaults.dockingWidth;
  const [pref, setPref] = useState<ThActionsDockedPref | null>(
    panel.actionKey ? RSPrefs.actions.keys[panel.actionKey as keyof typeof RSPrefs.actions.keys].docked || null : null
  );

  const actionsMap = useAppSelector(state => state.actions.keys);
  const actions = useActions(actionsMap);
  const previouslyCollapsed = usePrevious(panel.collapsed);

  const previousWidth = actions.getDockedWidth(panel.actionKey) || null;
  const width = pref?.width || defaultWidth;
  const minWidth = pref?.minWidth && pref.minWidth < width 
    ? pref.minWidth 
    : defaultWidth < width 
      ? defaultWidth
      : width;
  const maxWidth = pref?.maxWidth && pref.maxWidth > width 
    ? pref.maxWidth 
    : defaultWidth > width
      ? defaultWidth
      : width;

  const isPopulated = () => {
    return panel.active && actions.isOpen(panel.actionKey);
  };

  const isCollapsed = () => {
    return panel.collapsed;
  }

  const forceExpand = () => {
    return !!(isPopulated() && previouslyCollapsed && !panel.collapsed);
  }

  const currentKey = () => {
    return panel.actionKey;
  };

  const isResizable = () => {
    return isPopulated() ? Math.round(width) > Math.round(minWidth) && Math.round(width) < Math.round(maxWidth) : false;
  };

  const hasDragIndicator = () => {
    return pref?.dragIndicator || false;
  };

  const getWidth = useCallback(() => {
    return previousWidth 
        ? Math.round((previousWidth / window.innerWidth) * 100) 
        : Math.round((width / window.innerWidth) * 100);
  }, [previousWidth, width]);

  const getMinWidth = useCallback(() => {
    return Math.round((minWidth / window.innerWidth) * 100);
  }, [minWidth]);

  const getMaxWidth = useCallback(() => {
    return Math.round((maxWidth / window.innerWidth) * 100);
  }, [maxWidth]);

  const getCurrentPxWidth = useCallback((percentage: number) => {
    let current = Math.round((percentage * window.innerWidth) / 100);
    
    if (current < minWidth) {
      current = minWidth;
    }
    
    if (current > maxWidth) {
      current = maxWidth;
    }
    
    return current;
  }, [minWidth, maxWidth]);

  // When the docked action changes, we need to update its preferences 
  useEffect(() => {
    setPref(panel.actionKey ? RSPrefs.actions.keys[panel.actionKey as keyof typeof RSPrefs.actions.keys].docked || null : null);
  }, [panel.actionKey, RSPrefs]);

  return {
    currentKey, 
    isPopulated, 
    isCollapsed, 
    forceExpand, 
    isResizable,
    hasDragIndicator, 
    getWidth,
    getMinWidth,
    getMaxWidth,
    getCurrentPxWidth
  }
}