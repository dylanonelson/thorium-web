import React, { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import dockerStyles from "../../assets/styles/docking.module.css";
import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { DockingKeys, IDocker } from "@/models/docking";
import { IActionComponent, IActionsItem } from "@/models/actions";

import { CloseButton } from "../../CloseButton";
import { ActionsWithCollapsibility } from "@/components/ActionsWithCollapsibility";
import { DockStartAction } from "./DockStartAction";
import { DockEndAction } from "./DockEndAction";
import { PopoverSheetAction } from "./PopoverSheetAction";

const DockingActionsMap: { [key in DockingKeys]: React.FC<IActionComponent> } = {
  [DockingKeys.start]: DockStartAction,
  [DockingKeys.end]: DockEndAction,
  [DockingKeys.transient]: PopoverSheetAction,
};

export const Docker = ({
  id,
  keys,
  ref,
  onCloseCallback
}: IDocker) => {

  const listActionItems = useCallback(() => {
    const actionsItems: IActionsItem[] = [];

    keys.map((key) => {
      actionsItems.push({
        Comp: DockingActionsMap[key],
        key: key,
        associatedKey: id
      })
    });

    return actionsItems;
  }, [keys, id]);

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
        label={ Locale.reader.app.docker.close.trigger } 
        onPressCallback={ onCloseCallback }
        withTooltip={ Locale.reader.app.docker.close.tooltip }
      />
    </div>
    </>
  )
}

