import { useEffect, useState } from "react";

import { RSPrefs } from "../preferences";

import { Docked, IDockedPref } from "../models/docking";

export const useRezisablePanel = (panel: Docked | null) => {
  const [pref, setPref] = useState<IDockedPref | null>(null);
  
  const width = pref?.width || RSPrefs.docking.defaultWidth;
  const minWidth = pref?.minWidth && pref.minWidth < width ? pref.minWidth : RSPrefs.docking.defaultWidth;
  const maxWidth = pref?.maxWidth && pref.maxWidth > width ? pref.maxWidth : RSPrefs.docking.defaultWidth;

  const isActive = () => {
    return panel?.active;
  };
  
  const isResizable = () => {
    console.log(width, minWidth, maxWidth);

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
    let updatedPanel: IDockedPref | null = null;
    if (panel?.actionKey) {
      updatedPanel = RSPrefs.actions.keys[panel?.actionKey].docked || null;
    };

    setPref(updatedPanel);
  }, [panel])

  return {
    isActive,
    isResizable,
    getWidth,
    getMinWidth,
    getMaxWidth
  }
}