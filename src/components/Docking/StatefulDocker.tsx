"use client";

import React, { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import dockingStyles from "./assets/styles/docking.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { ThDockingKeys } from "@/preferences/models/enums";

import { Toolbar } from "react-aria-components";

import { ThCloseButton } from "@/packages/Components/Buttons/ThCloseButton";
import { StatefulCollapsibleActionsBar } from "../Actions/StatefulCollapsibleActionsBar";

import { StatefulDockStart } from "./StatefulDockStart";
import { StatefulDockEnd } from "./StatefulDockEnd";
import { StatefulDockTransientPopover } from "./StatefulDockTransientPopover";

import { usePreferences } from "@/preferences/ThPreferencesContext";

import { ThActionEntry } from "@/packages/Components/Actions/ThActionsBar";
import { ActionsStateKeys } from "@/lib/actionsReducer";

const dockingComponentsMap = {
  [ThDockingKeys.start]: {
    trigger: StatefulDockStart
  },
  [ThDockingKeys.end]: {
    trigger: StatefulDockEnd
  },
  [ThDockingKeys.transient]: {
    trigger: StatefulDockTransientPopover
  }
}

export interface StatefulDockerProps {
  id: ActionsStateKeys;
  keys: ThDockingKeys[];
  ref: React.ForwardedRef<HTMLButtonElement>;
  onClose: () => void;
}

export const StatefulDocker = ({
  id,
  keys,
  ref,
  onClose
}: StatefulDockerProps) => {
  const RSPrefs = usePreferences();
  
  const listActionItems = useCallback(() => {
    const actionsItems: ThActionEntry<ThDockingKeys>[] = [];

    keys.map((key) => {
      actionsItems.push({
        Trigger: dockingComponentsMap[key].trigger,
        key: key,
        associatedKey: id
      })
    });

    return actionsItems;
  }, [keys, id]);

  return(
    <>
    <Toolbar className={ dockingStyles.dockerWrapper }>
      <StatefulCollapsibleActionsBar 
        id={ `${ id }-docker-overflowMenu` }
        items={ listActionItems() }
        className={ dockingStyles.docker } 
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

