"use client";

import { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import { ThLayoutStrategy } from "@/preferences/models/enums";

import settingsStyles from "../assets/styles/settings.module.css";

import { StatefulSwitch } from "../Wrappers/StatefulSwitch";

import { usePreferences } from "@/preferences/ThPreferencesProvider";
import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTmpMaxChars } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const StatefulMaxChars = () => {
  const RSPrefs = usePreferences();
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[2]);
  const maxChars = useAppSelector(state => state.settings.tmpMaxChars);
  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number | null | undefined) => {
    await submitPreferences({ 
      maximalLineLength: value
    });
  
    dispatch(setTmpMaxChars(value === null));
  }, [submitPreferences, dispatch]);

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <div className={ settingsStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.maxChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected ? null : lineLength || RSPrefs.typography.maximalLineLength) }
          isSelected={ maxChars }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.lineLength }
        />
      </div>
    }
    </>
  )
}