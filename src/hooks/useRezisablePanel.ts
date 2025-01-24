import { useEffect, useState } from "react";

import { RSPrefs } from "../preferences";

import { Docked, IDockedPref } from "../models/docking";

import { useActions } from "./useActions";

export const useRezisablePanel = (panel: Docked) => {
  const defaultWidth = RSPrefs.docking.defaultWidth;
  const [pref, setPref] = useState<IDockedPref | null>(null);

  const actions = useActions();

  const previousWidth = panel.width || null;
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

  const currentKey = () => {
    return panel.actionKey;
  }

  const isResizable = () => {
    return isPopulated() ? Math.round(width) > Math.round(minWidth) && Math.round(width) < Math.round(maxWidth) : false;
  };

  const getWidth = () => {
    return isPopulated() 
      ? previousWidth 
        ? Math.round((previousWidth / window.innerWidth) * 100) 
        : Math.round((width / window.innerWidth) * 100) 
      : 0;
  };

  const getMinWidth = () => {
    return isPopulated() ? Math.round((minWidth / window.innerWidth) * 100) : 0;
  };

  const getMaxWidth = () => {
    return isPopulated() ? Math.round((maxWidth / window.innerWidth) * 100) : 0;
  };

  const getCurrentPxWidth = (percentage: number) => {
    let current = Math.round((percentage * window.innerWidth) / 100);
    
    if (current < minWidth) {
      current = minWidth;
    }
    
    if (current > maxWidth) {
      current = maxWidth;
    }
    
    return current;
  }

  // When the docked action changes, we need to update its preferences 
  useEffect(() => {
    setPref(panel.actionKey ? RSPrefs.actions.keys[panel.actionKey].docked || null : null);
  }, [panel])

  return {
    isPopulated, 
    isResizable,
    currentKey, 
    getWidth,
    getMinWidth,
    getMaxWidth,
    getCurrentPxWidth
  }
}