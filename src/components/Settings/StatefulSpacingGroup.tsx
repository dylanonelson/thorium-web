"use client";

import { useCallback } from "react";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsSubpanel, 
  ThSettingsContainerKeys, 
  ThSpacingSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { usePreferences } from "@/preferences/ThPreferencesProvider";
import { usePlugins } from "../Plugins/PluginProvider";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export const StatefulSpacingGroup = () => {
  const RSPrefs = usePreferences();
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
  const RSPrefs = usePreferences();
  const displayOrder = RSPrefs.settings.spacing?.subPanel as ThSpacingSettingsKeys[] | null | undefined || defaultSpacingSettingsSubpanel;
  const { spacingSettingsComponentsMap } = usePlugins();

  return(
    <>
    { displayOrder.map((key: ThSpacingSettingsKeys) => {
      const match = spacingSettingsComponentsMap[key];
      return match && <match.Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}