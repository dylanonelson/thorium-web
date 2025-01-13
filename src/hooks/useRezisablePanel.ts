import { useEffect, useState } from "react";

import { RSPrefs } from "../preferences";

import { Docked, IDockedPref } from "../models/docking";

export const useRezisablePanel = (panel: Docked) => {
  const [pref, setPref] = useState<IDockedPref | null>(null);
  
  const width = pref?.width || RSPrefs.docking.defaultWidth;
  const minWidth = pref?.minWidth && pref.minWidth < width ? pref.minWidth : RSPrefs.docking.defaultWidth;
  const maxWidth = pref?.maxWidth && pref.maxWidth > width ? pref.maxWidth : RSPrefs.docking.defaultWidth;

  const isResizable = () => {
    return (width > minWidth) && (width < maxWidth);
  };

  const getWidth = () => {
    return (width / window.innerWidth) * 100;
  };

  const getMinWidth = () => {
    return (minWidth / window.innerWidth) * 100;
  };

  const getMaxWidth = () => {
    return (maxWidth / window.innerWidth) * 100;
  };

  useEffect(() => {
    setPref(panel.actionKey ? RSPrefs.actions.keys[panel.actionKey].docked || null : null);
  }, [panel])

  return {
    isResizable,
    getWidth,
    getMinWidth,
    getMaxWidth
  }
}