import { ActionsStateKeys, IActionStateObject, IDockState } from "@/models/state/actionsState";
import { Docked, DockedKeys, DockingKeys, DockTypes } from "@/models/docking";

import { useAppSelector } from "@/lib/hooks";

export const useActions = () => {
  const actions = useAppSelector(state => state.actions.keys);
  const dock = useAppSelector(state => state.actions.dock);

  const findOpen = () => {
    const open: ActionsStateKeys[] = [];

    (Object.entries(actions) as [ActionsStateKeys, IActionStateObject][]).forEach(([ key, value ]) => { 
      if (value.isOpen) open.push(key);
    } );

    return open;
  }

  const anyOpen = () => {
    return Object.values(actions).some((value: IActionStateObject) => value.isOpen);
  }

  const isOpen = (key?: ActionsStateKeys | null) => {
    return key ? actions[key].isOpen : false;
  }

  const findDocked = () => {
    const docked: DockedKeys[] = [];

    (Object.values(dock)).forEach((value: Docked) => { 
      if (value.actionKey) docked.push(value.actionKey);
    } );

    return docked;
  }

  const anyDocked = () => {
    return Object.values(dock).some((value: Docked) => { 
      if (value.actionKey && value.active && value.open) return true;
    } );
  }

  const isDocked = (key?: ActionsStateKeys | null) => {
    return key 
      ? Object.values(dock).some((value: Docked) => {
        if (value.actionKey === key && value.active && value.open) return true;
      }) 
    : false;
  }

  const everyOpenDocked = () => {
    const opens = findOpen();
    
    return opens.every((key) => {
      return isDocked(key);
    });
  }

  return {
    findOpen,
    anyOpen,
    isOpen,
    findDocked, 
    anyDocked,
    isDocked,
    everyOpenDocked
  }
}