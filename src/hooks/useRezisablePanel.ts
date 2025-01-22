import { useEffect, useState } from "react";

import { RSPrefs } from "../preferences";

import { Docked, IDockedPref } from "../models/docking";

import { useActions } from "./useActions";

export const useRezisablePanel = (panel: Docked) => {
  const actions = useActions();

  const [pref, setPref] = useState<IDockedPref | null>(null);
    
  const width = panel.width ? ((panel.width * window.innerWidth) / 100) : pref?.width || RSPrefs.docking.defaultWidth;
  const minWidth = pref?.minWidth && pref.minWidth < width ? pref.minWidth : RSPrefs.docking.defaultWidth;
  const maxWidth = pref?.maxWidth && pref.maxWidth > width ? pref.maxWidth : RSPrefs.docking.defaultWidth;

  const isPopulated = () => {
    return panel.active && actions.isOpen(panel.actionKey);
  };

  const currentKey = () => {
    return panel.actionKey;
  }

  const isResizable = () => {
    return isPopulated() ? (width > minWidth) && (width < maxWidth) : false;
  };

  const getWidth = () => {
    return isPopulated() ? (width / window.innerWidth) * 100 : 0;
  };

  const getMinWidth = () => {
    return isPopulated() ? (minWidth / window.innerWidth) * 100 : 0;
  };

  const getMaxWidth = () => {
    return isPopulated() ? (maxWidth / window.innerWidth) * 100 : 0;
  };

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
    getMaxWidth
  }
}