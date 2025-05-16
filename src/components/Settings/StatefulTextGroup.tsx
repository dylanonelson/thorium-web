"use client";

import { useCallback, useContext } from "react";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext, 
  ThSettingsContainerKeys, 
  ThTextSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsMapObject } from "./models/settings";

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export interface StatefulTextGroupProps {
  componentsMap: { [key: string | number | symbol]: StatefulSettingsMapObject }
}

export const StatefulTextGroup = ({
  componentsMap
}: StatefulTextGroupProps) => {
  const RSPrefs = useContext(PreferencesContext);
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
      componentsMap={ componentsMap }
      prefs={ RSPrefs.settings.text }
      defaultPrefs={ {
        main: defaultTextSettingsMain, 
        subPanel: defaultTextSettingsSubpanel
      }}
    />
    </>
  )
}

export const StatefulTextGroupContainer = ({
  componentsMap
}: StatefulTextGroupProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.text?.subPanel as ThTextSettingsKeys[] | null | undefined || defaultTextSettingsSubpanel;

  return(
    <>
    { displayOrder.map((key: ThTextSettingsKeys) => {
      const { Comp } = componentsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}