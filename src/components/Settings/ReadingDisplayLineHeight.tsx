import React, { useCallback, useContext, useRef } from "react";

import { defaultLineHeights, LineHeightOptions, PreferencesContext, SettingsKeys } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsItemProps } from "@/models/settings";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "../assets/icons/density_small.svg";
import MediumIcon from "../assets/icons/density_medium.svg";
import LargeIcon from "../assets/icons/density_large.svg";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLineHeight, setPublisherStyles } from "@/lib/settingsReducer";
import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";

export const ReadingDisplayLineHeight = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);
  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useRef({
    [LineHeightOptions.publisher]: null,
    [LineHeightOptions.small]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.small] || defaultLineHeights[LineHeightOptions.small],
    [LineHeightOptions.medium]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.medium] || defaultLineHeights[LineHeightOptions.medium],
    [LineHeightOptions.large]: RSPrefs.settings.keys?.[SettingsKeys.lineHeight]?.[LineHeightOptions.large] || defaultLineHeights[LineHeightOptions.large],
  });

  const updatePreference = useCallback(async (value: string) => {
    const computedValue = value === LineHeightOptions.publisher
      ? null 
      : lineHeightOptions.current[value as keyof typeof LineHeightOptions];
    
    await submitPreferences({
      lineHeight: computedValue
    });

    const currentLineHeight = getSetting("lineHeight");
    const currentDisplayLineHeightOption = Object.entries(lineHeightOptions.current).find(([key, value]) => value === currentLineHeight)?.[0] as LineHeightOptions;

    dispatch(setLineHeight(currentDisplayLineHeightOption));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    <RadioGroupWrapper 
      standalone={ standalone }
      label={ Locale.reader.settings.lineHeight.title }
      orientation="horizontal"
      value={ publisherStyles ? LineHeightOptions.publisher : lineHeight } 
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          label: Locale.reader.settings.lineHeight.publisher, 
          value: LineHeightOptions.publisher 
        },
        {
          icon: SmallIcon,
          label: Locale.reader.settings.lineHeight.small, 
          value: LineHeightOptions.small 
        },
        {
          icon: MediumIcon,
          label: Locale.reader.settings.lineHeight.medium, 
          value: LineHeightOptions.medium 
        },
        {
          icon: LargeIcon,
          label: Locale.reader.settings.lineHeight.large, 
          value: LineHeightOptions.large 
        },
      ]}
    />
    </>
  );
}