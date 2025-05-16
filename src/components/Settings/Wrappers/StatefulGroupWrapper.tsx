import { useContext } from "react";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../assets/styles/settings.module.css";

import { PreferencesContext, ThSettingsGroupPref, ThSpacingSettingsKeys, ThTextSettingsKeys } from "@/preferences";
import { PressEvent } from "react-aria";
import { StatefulSettingsMapObject } from "../models/settings";

import { ThSettingsWrapper } from "@/packages/Components/Settings/ThSettingsWrapper";

import classNames from "classnames";

export interface StatefulGroupWrapperProps {
  heading: string;
  moreLabel: string;
  moreTooltip: string;
  onPressMore: (e: PressEvent) => void;
  settingsMap: { [key in ThSpacingSettingsKeys]: StatefulSettingsMapObject } | { [key in ThTextSettingsKeys]: StatefulSettingsMapObject };
  prefs?: ThSettingsGroupPref<ThTextSettingsKeys | ThSpacingSettingsKeys>;
  defaultPrefs: {
    main: ThTextSettingsKeys[] | ThSpacingSettingsKeys[];
    subPanel: ThTextSettingsKeys[] | ThSpacingSettingsKeys[];
  };
}

export const StatefulGroupWrapper = ({
  heading,
  moreLabel,
  moreTooltip,
  onPressMore,
  settingsMap,
  prefs,
  defaultPrefs
}: StatefulGroupWrapperProps) => {
  const RSPrefs = useContext(PreferencesContext);
  
  const main = prefs?.main || defaultPrefs.main;
  const displayOrder = prefs?.subPanel !== undefined 
    ? prefs.subPanel 
    : defaultPrefs.subPanel;

  const resolvedPrefs = {
    main: main,
    subPanel: displayOrder
  };

  return(
    <>
    <ThSettingsWrapper
      className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }
      items={ settingsMap }
      prefs={ resolvedPrefs }
      compounds={{
        label: heading,
        heading: {
          className: classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsGroupLabel)
        },
        button: {
          className: classNames(readerSharedUI.icon, settingsStyles.readerSettingsAdvancedIcon),
          "aria-label": moreLabel,
          tooltip: {
            trigger: {
              delay: RSPrefs.theming.icon.tooltipDelay,
              closeDelay: RSPrefs.theming.icon.tooltipDelay
            },
            tooltip: {
              className: readerSharedUI.tooltip,
              placement: "top",
              offset: RSPrefs.theming.icon.tooltipOffset || 0
            },
            label: moreTooltip
          },
          onPress: onPressMore
        }
      }}
    />
    </>
  )
}