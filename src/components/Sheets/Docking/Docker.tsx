import React, { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import dockerStyles from "../../assets/styles/docking.module.css";
import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { Dockable, DockingKeys, IDocker } from "@/models/docking";
import { SheetTypes } from "@/models/sheets";
import { IActionsItem } from "@/models/actions";

import { CloseButton } from "../../CloseButton";
import { ActionsWithCollapsibility } from "@/components/ActionsWithCollapsibility";
import { DockLeftAction } from "./DockLeftAction";
import { DockRightAction } from "./DockRightAction";
import { PopoverSheetAction } from "./PopoverSheetAction";
import { FullscreenSheetAction } from "./FullscreenSheetAction";

const DockingActionsMap = {
  [DockingKeys.left]: DockLeftAction,
  [DockingKeys.right]: DockRightAction,
  popover: PopoverSheetAction,
  fullscreen: FullscreenSheetAction
};

export const Docker = ({
  id,
  sheetType,
  ref,
  onCloseCallback
}: IDocker) => {
  const dockable = useRef<Dockable>(RSPrefs.actions.keys[id].docked?.dockable || Dockable.none);
  const actionsOrder = useRef(RSPrefs.docking.displayOrder);

  const listActionItems = useCallback(() => {
    const actionsItems: IActionsItem[] = [];

    const pushInList = (key: DockingKeys) => {
      let mapKey: keyof typeof DockingActionsMap;

      if (key === DockingKeys.transient) {
        sheetType === SheetTypes.fullscreen ? mapKey = "fullscreen" : mapKey = "popover";
      } else {
        mapKey = key;
      }

      if (mapKey) {
        actionsItems.push({
          Comp: DockingActionsMap[mapKey],
          key: key,
          associatedKey: id
        });
      }
    };

    actionsOrder.current.map((key: DockingKeys) => {
      switch(key) {
        case DockingKeys.left:
          if (
            dockable.current === Dockable.both ||
            dockable.current === Dockable.start
          ) {
            pushInList(key);
          }
          break;
        case DockingKeys.right:
          if (
            dockable.current === Dockable.both ||
            dockable.current === Dockable.end
          ) {
            pushInList(key);
          }
          break;
        case DockingKeys.transient:
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
  }, [id, sheetType]);

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
        { ...(dockable.current !== Dockable.none ? { withTooltip: Locale.reader.app.docker.close.tooltip } : {})}
      />
    </div>
    </>
  )
}

