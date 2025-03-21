import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultLineHeights, IAdvancedDisplayProps } from "@/models/settings";
import { ReadingDisplayLineHeightOptions } from "@/models/layout";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSpacingDefaults } from "@/lib/settingsReducer";
import { useCallback } from "react";

export const ReadingDisplaySpacingDefaults: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const spacingDefaults = useAppSelector(state => state.settings.spacingDefaults);

  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const paraIndent = useAppSelector(state => state.settings.paraIndent);
  const paraSpacing = useAppSelector(state => state.settings.paraSpacing);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);

  const dispatch = useAppDispatch();

  const { applySpacingDefaults } = useEpubNavigator();

  const handleChange = useCallback(async (isSelected: boolean) => {
    const values = isSelected ? 
    {
      lineHeight: null,
      paraIndent: null,
      paraSpacing: null,
      letterSpacing: null,
      wordSpacing: null
    } : 
    {
      lineHeight: RSPrefs.settings.spacing?.lineHeight?.[lineHeight] ?? 
                (lineHeight === ReadingDisplayLineHeightOptions.small 
                  ? defaultLineHeights[ReadingDisplayLineHeightOptions.small] 
                  : lineHeight === ReadingDisplayLineHeightOptions.medium 
                    ? defaultLineHeights[ReadingDisplayLineHeightOptions.medium] 
                    : defaultLineHeights[ReadingDisplayLineHeightOptions.large]
                ),
      paraIndent,
      paraSpacing,
      letterSpacing,
      wordSpacing
    };
    await applySpacingDefaults(values);
    dispatch(setSpacingDefaults(isSelected));
  }, [applySpacingDefaults, dispatch, lineHeight, paraIndent, paraSpacing, letterSpacing, wordSpacing]);

  return(
    <>
    <SwitchWrapper 
      { ...(standalone ? { 
        className: settingsStyles.readerSettingsGroup
      } : {}) }
      label={ Locale.reader.settings.spacing.default }
      onChangeCallback={ async (isSelected: boolean) => await handleChange(isSelected) }
      isSelected={ spacingDefaults }
    />
    </>
  )
}