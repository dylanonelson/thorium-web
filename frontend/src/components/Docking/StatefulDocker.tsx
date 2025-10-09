"use client";

import React, { useCallback } from "react";

import dockingStyles from "./assets/styles/docking.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { ThDockingKeys } from "@/preferences/models/enums";

import { Toolbar } from "react-aria-components";

import { ThCloseButton } from "@/core/Components/Buttons/ThCloseButton";
import { StatefulCollapsibleActionsBar } from "../Actions/StatefulCollapsibleActionsBar";

import { StatefulDockStart } from "./StatefulDockStart";
import { StatefulDockEnd } from "./StatefulDockEnd";
import { StatefulDockTransientPopover } from "./StatefulDockTransientPopover";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useI18n } from "@/i18n/useI18n";

import { ThActionEntry } from "@/core/Components/Actions/ThActionsBar";
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
  const { preferences } = usePreferences();
  const { t } = useI18n();
  
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
        prefs={ preferences.docking }
        aria-label={ t("reader.app.docker.wrapper") }
      />

      <ThCloseButton 
        ref={ ref }
        className={ readerSharedUI.dockerButton } 
        aria-label={ t("reader.app.docker.close.trigger") } 
        onPress={ onClose }
        compounds={ {
          tooltipTrigger: {
            delay: preferences.theming.icon.tooltipDelay,
            closeDelay: preferences.theming.icon.tooltipDelay
          },
          tooltip: {
            className: readerSharedUI.tooltip
          },
          label: t("reader.app.docker.close.tooltip")
        }}
      />
    </Toolbar>
    </>
  )
}

