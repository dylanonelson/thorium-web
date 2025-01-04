import React, { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import dockerStyles from "../../assets/styles/docker.module.css";
import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { CloseButton } from "../../CloseButton";

import { Dockable, DockingKeys } from "../Sheet";
import { ActionKeys } from "../../Templates/ActionComponent";
import { ActionsWithCollapsibility } from "@/components/ActionsWithCollapsibility";
import { IActionsItem } from "@/components/Actions";
import { DockLeftAction } from "./DockLeftAction";
import { DockRightAction } from "./DockRightAction";
import { PopoverAction } from "./PopoverAction";

export interface IDocker {
  id: ActionKeys;
  ref: React.ForwardedRef<HTMLButtonElement>;
  onStackCallback: () => void;
  onCloseCallback: () => void;
}

const DockingActionsMap = {
  [DockingKeys.left]: DockLeftAction,
  [DockingKeys.right]: DockRightAction,
  [DockingKeys.popover]: PopoverAction
};

export const Docker = ({
  id,
  ref,
  onCloseCallback
}: IDocker) => {
  const dockable = useRef<Dockable>(RSPrefs.actions.keys[id].dockable || Dockable.none);
  const actionsOrder = useRef(RSPrefs.docking.displayOrder);

  const listActionItems = useCallback(() => {
    const actionsItems: IActionsItem[] = [];

    const pushInList = (key: DockingKeys) => {
      actionsItems.push({
        Comp: DockingActionsMap[key],
        key: key,
        associatedID: id
      });
    };

    actionsOrder.current.map((key: DockingKeys) => {
      switch(key) {
        case DockingKeys.left:
          if (
            dockable.current === Dockable.both ||
            dockable.current === Dockable.left
          ) {
            pushInList(key);
          }
          break;
        case DockingKeys.right:
          if (
            dockable.current === Dockable.both ||
            dockable.current === Dockable.right
          ) {
            pushInList(key);
          }
          break;
        case DockingKeys.popover:
          if (
            dockable.current !== Dockable.none
          ) {
            pushInList(key);
          }
          break;
        default:
          break;
      }
    });

    return actionsItems;
  }, [id]);

  return(
    <>
    <div className={ dockerStyles.dockerWrapper }>
      <ActionsWithCollapsibility 
        items={ listActionItems() }
        className={ dockerStyles.docker } 
        overflowMenuClassName={ readerSharedUI.dockerButton }
        prefs={ RSPrefs.docking }
        label={ Locale.reader.app.docker.wrapper }
      />

      <CloseButton 
        ref={ ref }
        className={ readerSharedUI.dockerButton } 
        aria-label={ Locale.reader.app.docker.close.trigger } 
        onPressCallback={ onCloseCallback }
        { ...(dockable.current !== Dockable.none ? { withTooltip: Locale.reader.app.docker.close.tooltip } : {})}
      />
    </div>
    </>
  )
}

