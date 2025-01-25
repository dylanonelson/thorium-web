import { useEffect, useState } from "react";

import { RSPrefs } from "../preferences";

import { Docked, IDockedPref } from "../models/docking";

import { useActions } from "./useActions";

export const useRezisablePanel = (panel: Docked) => {
  const defaultWidth = RSPrefs.docking.defaultWidth;
  const [pref, setPref] = useState<IDockedPref | null>(null);

  const actions = useActions();

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

  const currentKey = () => {
    return panel.actionKey;
  };

  const isResizable = () => {
    return isPopulated() ? Math.round(width) > Math.round(minWidth) && Math.round(width) < Math.round(maxWidth) : false;
  };

  const hasDragIndicator = () => {
    return pref?.dragIndicator || false;
  };

  const getWidth = () => {
    return previousWidth 
    ? Math.round((previousWidth / window.innerWidth) * 100) 
    : Math.round((width / window.innerWidth) * 100);
  };

  const getMinWidth = () => {
    return Math.round((minWidth / window.innerWidth) * 100);
  };

  const getMaxWidth = () => {
    return Math.round((maxWidth / window.innerWidth) * 100);
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
  };

  // When the docked action changes, we need to update its preferences 
  useEffect(() => {
    setPref(panel.actionKey ? RSPrefs.actions.keys[panel.actionKey].docked || null : null);
  }, [panel.actionKey]);

  return {
    currentKey, 
    isPopulated, 
    isResizable,
    hasDragIndicator, 
    getWidth,
    getMinWidth,
    getMaxWidth,
    getCurrentPxWidth
  }
}