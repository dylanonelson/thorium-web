"use client";

import { useCallback, useContext } from "react";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsSubpanel, 
  PreferencesContext, 
  ThSettingsContainerKeys, 
  ThSpacingSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { SettingComponent } from "../Plugins/PluginRegistry";

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { usePlugins } from "../Plugins/PluginProvider";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export const StatefulSpacingGroup = () => {
  const RSPrefs = useContext(PreferencesContext);
  const { spacingSettingsComponentsMap } = usePlugins();
  const dispatch = useAppDispatch();
  
  const setSpacingContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.spacing));
  }, [dispatch]);

  return (
    <>
    <StatefulGroupWrapper 
      heading={ Locale.reader.settings.spacing.title }
      moreLabel={ Locale.reader.settings.spacing.advanced.trigger }
      moreTooltip={ Locale.reader.settings.spacing.advanced.tooltip }
      onPressMore={ setSpacingContainer }
      componentsMap={ spacingSettingsComponentsMap }
      prefs={ RSPrefs.settings.spacing }
      defaultPrefs={ {
        main: defaultSpacingSettingsMain, 
        subPanel: defaultSpacingSettingsSubpanel
      }}
    />
    </>
  );
}

export const StatefulSpacingGroupContainer = () => {
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.spacing?.subPanel as ThSpacingSettingsKeys[] | null | undefined || defaultSpacingSettingsSubpanel;
  const { spacingSettingsComponentsMap } = usePlugins();

  return(
    <>
    { displayOrder.map((key: ThSpacingSettingsKeys) => {
      console.log(key);
      const match = spacingSettingsComponentsMap[key];
      return match && <match.Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}