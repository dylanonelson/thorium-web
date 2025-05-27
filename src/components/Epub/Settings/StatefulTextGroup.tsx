"use client";

import React, { useCallback } from "react";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  ThSettingsContainerKeys, 
  ThTextSettingsKeys 
} from "@/preferences";

import Locale from "../../../resources/locales/en.json";

import { StatefulGroupWrapper } from "../../Settings/StatefulGroupWrapper";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { usePlugins } from "../../Plugins/PluginProvider";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export const StatefulTextGroup = () => {
  const RSPrefs = usePreferences();
  const { textSettingsComponentsMap } = usePlugins();
  const dispatch = useAppDispatch();

  const setTextContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.text));
  }, [dispatch]);

  return(
    <>
    <StatefulGroupWrapper 
      heading={ Locale.reader.settings.text.title }
      moreLabel={ Locale.reader.settings.text.advanced.trigger }
      moreTooltip={ Locale.reader.settings.text.advanced.tooltip }
      onPressMore={ setTextContainer }
      componentsMap={ textSettingsComponentsMap }
      prefs={ RSPrefs.settings.text }
      defaultPrefs={ {
        main: defaultTextSettingsMain, 
        subPanel: defaultTextSettingsSubpanel
      }}
    />
    </>
  )
}

export const StatefulTextGroupContainer = () => {
  const RSPrefs = usePreferences();
  const displayOrder = RSPrefs.settings.text?.subPanel as ThTextSettingsKeys[] | null | undefined || defaultTextSettingsSubpanel;
  const { textSettingsComponentsMap } = usePlugins();

  return(
    <>
    { displayOrder.map((key: ThTextSettingsKeys) => {
      const match = textSettingsComponentsMap[key];
      if (!match) {
        console.warn(`Action key "${ key }" not found in the plugin registry while present in preferences.`);
        return null;
      }
      return <match.Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}