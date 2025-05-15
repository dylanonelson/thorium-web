import React, { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import dockerStyles from "../../assets/styles/docking.module.css";
import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { DockingKeys } from "@/preferences/models/enums";
import { StatefulActionsMapObject } from "@/models/actions";

import { Toolbar } from "react-aria-components";

import { ThCloseButton } from "@/packages/Components/Buttons/ThCloseButton";
import { ActionsWithCollapsibility } from "@/components/ActionsWithCollapsibility";
import { DockStartAction } from "./DockStartAction";
import { DockEndAction } from "./DockEndAction";
import { PopoverSheetAction } from "./PopoverSheetAction";
import { ThActionEntry } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { ActionsStateKeys } from "@/lib/actionsReducer";

const DockingActionsMap: { [key in DockingKeys]: StatefulActionsMapObject } = {
  [DockingKeys.start]: {
    trigger: DockStartAction
  },
  [DockingKeys.end]: {
    trigger: DockEndAction
  },
  [DockingKeys.transient]: {
    trigger: PopoverSheetAction
  }
};

export interface StatefulDockerProps {
  id: ActionsStateKeys;
  keys: DockingKeys[];
  ref: React.ForwardedRef<HTMLButtonElement>;
  onClose: () => void;
}

export const Docker = ({
  id,
  keys,
  ref,
  onClose
}: StatefulDockerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const listActionItems = useCallback(() => {
    const actionsItems: ThActionEntry<DockingKeys>[] = [];

    keys.map((key) => {
      actionsItems.push({
        Trigger: DockingActionsMap[key].trigger,
        key: key,
        associatedKey: id
      })
    });

    return actionsItems;
  }, [keys, id]);

  return(
    <>
    <Toolbar className={ dockerStyles.dockerWrapper }>
      <ActionsWithCollapsibility 
        id={ `${ id }-docker-overflowMenu` }
        items={ listActionItems() }
        className={ dockerStyles.docker } 
        overflowMenuClassName={ readerSharedUI.dockerButton }
        prefs={ RSPrefs.docking }
        aria-label={ Locale.reader.app.docker.wrapper }
      />

      <ThCloseButton 
        ref={ ref }
        className={ readerSharedUI.dockerButton } 
        aria-label={ Locale.reader.app.docker.close.trigger } 
        onPress={ onClose }
        tooltip={ {
          trigger: {
            delay: RSPrefs.theming.icon.tooltipDelay,
            closeDelay: RSPrefs.theming.icon.tooltipDelay
          },
          tooltip: {
            className: readerSharedUI.tooltip
          },
          label: Locale.reader.app.docker.close.tooltip
        }}
      />
    </Toolbar>
    </>
  )
}

