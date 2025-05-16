import { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsItemProps } from "./models/settings";
import { fontWeightRangeConfig } from "@readium/navigator";

import { StatefulSlider } from "./Wrappers/StatefulSlider";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFontWeight } from "@/lib/settingsReducer";

export const StatefulFontWeight = ({ standalone = true }: StatefulSettingsItemProps) => {
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontWeight = useAppSelector(state => state.settings.fontWeight);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({ fontWeight: value });

    dispatch(setFontWeight(getSetting("fontWeight")));
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <StatefulSlider
      standalone={ standalone }
      label={ Locale.reader.settings.fontWeight.title }
      defaultValue={ 400 } 
      value={ fontWeight } 
      onChange={ async(value) => await updatePreference(value as number) } 
      range={ fontWeightRangeConfig.range }
      step={ fontWeightRangeConfig.step }
      isDisabled={ fontFamily === "publisher" }
    /> 
    </>
  )
}