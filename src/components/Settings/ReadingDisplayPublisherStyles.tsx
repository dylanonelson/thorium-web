import { useCallback, useContext, useRef } from "react";

import { defaultLineHeights, LineHeightOptions, PreferencesContext, SettingsKeys } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { IAdvancedDisplayProps } from "@/models/settings";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayPublisherStyles: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const RSPrefs = useContext(PreferencesContext);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const paragraphIndent = useAppSelector(state => state.settings.paragraphIndent);
  const paragraphSpacing = useAppSelector(state => state.settings.paragraphSpacing);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);

  const dispatch = useAppDispatch();

  const lineHeightOptions = useRef({
    [LineHeightOptions.publisher]: null,
    [LineHeightOptions.small]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.small] || defaultLineHeights[LineHeightOptions.small],
    [LineHeightOptions.medium]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.medium] || defaultLineHeights[LineHeightOptions.medium],
    [LineHeightOptions.large]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.large] || defaultLineHeights[LineHeightOptions.large],
  });

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (isSelected: boolean) => {
    const values = isSelected ? 
    {
      lineHeight: null,
      paragraphIndent: null,
      paragraphSpacing: null,
      letterSpacing: null,
      wordSpacing: null
    } : 
    {
      lineHeight: lineHeight === LineHeightOptions.publisher 
        ? null 
        : lineHeightOptions.current[lineHeight as keyof typeof LineHeightOptions],
      paragraphIndent: paragraphIndent || 0,
      paragraphSpacing: paragraphSpacing || 0,
      letterSpacing: letterSpacing || 0,
      wordSpacing: wordSpacing || 0
    };
    await submitPreferences(values);

    dispatch(setPublisherStyles(isSelected ? true : false));
  }, [submitPreferences, dispatch, lineHeight, paragraphIndent, paragraphSpacing, letterSpacing, wordSpacing]);

  return(
    <>
    <SwitchWrapper 
      standalone={ standalone }
      label={ Locale.reader.settings.publisherStyles.label }
      onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ publisherStyles }
    />
    </>
  )
}