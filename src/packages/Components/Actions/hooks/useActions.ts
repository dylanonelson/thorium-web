"use client";

export interface ThActionState {
  isOpen: boolean | null;
  docking: any;
  dockedWidth?: number;
}

export interface ThActionMap {
  [key: string | number | symbol]: ThActionState;
}

export const useActions = <K extends string | number | symbol>(actionMap: ThActionMap) => {
  const findOpen = () => {
    const open: K[] = [];

    Object.entries(actionMap).forEach(([key, value]) => {
      if (value.isOpen) open.push(key as K);
    });

    return open;
  };

  const anyOpen = () => {
    return Object.values(actionMap).some((value) => value.isOpen);
  };

  const isOpen = (key?: K | null) => {
    if (key) {
      if (actionMap[key].isOpen === null) {
        return false;
      } else {
        return actionMap[key].isOpen;
      }
    }
    return false;
  };

  const findDocked = () => {
    const docked: K[] = [];

    Object.entries(actionMap).forEach(([key, value]) => {
      if (value.docking) docked.push(key as K);
    });

    return docked;
  };

  const anyDocked = () => {
    return Object.values(actionMap).some((value) => value.docking);
  };

  const isDocked = (key?: K | null) => {
    return key ? actionMap[key].docking : false;
  };

  const whichDocked = (key?: K | null) => {
    return key ? actionMap[key].docking : null;
  };

  const getDockedWidth = (key?: K | null) => {
    return key && actionMap[key].dockedWidth || undefined;
  };

  const everyOpenDocked = () => {
    const opens = findOpen();

    return opens.every((key) => {
      return isDocked(key);
    });
  };

  return {
    findOpen,
    anyOpen,
    isOpen,
    findDocked,
    anyDocked,
    isDocked,
    whichDocked,
    getDockedWidth,
    everyOpenDocked,
  };
};