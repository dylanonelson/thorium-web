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

export const Docker = ({
  id,
  ref,
  onCloseCallback
}: IDocker) => {
  const dockable = useRef<Dockable>(RSPrefs.actions.keys[id].dockable || Dockable.none);

  const listActionItems = useCallback(() => {
    const actionsItems: IActionsItem[] = [];

    switch(dockable.current) {
      case Dockable.both:
        actionsItems.push({
          Comp: DockLeftAction,
          key: DockingKeys.left,
          associatedID: id
        },
        {
          Comp: DockRightAction,
          key: DockingKeys.right,
          associatedID: id
        },
        {
          Comp: PopoverAction,
          key: DockingKeys.popover,
          associatedID: id
        });
        break;
      case Dockable.left:
        actionsItems.push({
          Comp: DockLeftAction,
          key: DockingKeys.left,
          associatedID: id
        },
        {
          Comp: PopoverAction,
          key: DockingKeys.popover,
          associatedID: id
        });
        break;
      case Dockable.right:
        actionsItems.push(
        {
          Comp: DockRightAction,
          key: DockingKeys.right,
          associatedID: id
        },
        {
          Comp: PopoverAction,
          key: DockingKeys.popover,
          associatedID: id
        });
        break;
      case Dockable.none:
      default:
        break;
    }

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

