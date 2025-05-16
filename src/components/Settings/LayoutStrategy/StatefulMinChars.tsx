"use client";

import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../../resources/locales/en.json";

import { ThLayoutStrategy } from "@/preferences/models/enums";

import settingsStyles from "../assets/styles/settings.module.css";

import { StatefulSwitch } from "../Wrappers/StatefulSwitch";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTmpMinChars } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const StatefulMinChars = () => {
  const RSPrefs = useContext(PreferencesContext);
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[0]);
  const minChars = useAppSelector(state => state.settings.tmpMinChars);
  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number | null | undefined) => {
    await submitPreferences({ 
      minimalLineLength: value
    });
  
    dispatch(setTmpMinChars(value === null));
  }, [submitPreferences, dispatch]);

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <div className={ settingsStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.minChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected ? null : lineLength || RSPrefs.typography.minimalLineLength) }
          isSelected={ minChars }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.columns && columnCount !== "2" }
        />
      </div>
    }
    </>
  )
}