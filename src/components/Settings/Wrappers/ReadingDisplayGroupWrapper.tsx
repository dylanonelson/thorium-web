import { useContext } from "react";

import { IReadingDisplayGroupWrapperProps } from "@/models/settings";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { PreferencesContext } from "@/preferences";

import { ThSettingsWrapper } from "@/packages/Components/Settings/ThSettingsWrapper/ThSettingsWrapper";

import classNames from "classnames";

export const ReadingDisplayGroupWrapper: React.FC<IReadingDisplayGroupWrapperProps> = ({
  heading,
  moreLabel,
  moreTooltip,
  onMorePressCallback,
  settingsMap,
  prefs,
  defaultPrefs
}) => {
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
          onPress: onMorePressCallback
        }
      }}
    />
    </>
  )
}