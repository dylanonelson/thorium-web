"use client";

import React, { useCallback, useContext } from "react";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext, 
  ThSettingsContainerKeys, 
  ThTextSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { SettingComponent } from "../Plugins/PluginRegistry";

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { usePlugins } from "../Plugins/PluginProvider";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export const StatefulTextGroup = () => {
  const RSPrefs = useContext(PreferencesContext);
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
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.text?.subPanel as ThTextSettingsKeys[] | null | undefined || defaultTextSettingsSubpanel;
  const { textSettingsComponentsMap } = usePlugins();

  return(
    <>
    { displayOrder.map((key: ThTextSettingsKeys) => {
      const match = textSettingsComponentsMap[key];
      return match && <match.Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}