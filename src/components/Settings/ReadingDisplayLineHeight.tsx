import React, { useCallback, useContext, useRef } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayLineHeightOptions } from "@/models/layout";
import { defaultLineHeights, IAdvancedDisplayProps } from "@/models/settings";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "../assets/icons/density_small.svg";
import MediumIcon from "../assets/icons/density_medium.svg";
import LargeIcon from "../assets/icons/density_large.svg";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLineHeight, setPublisherStyles } from "@/lib/settingsReducer";
import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";

export const ReadingDisplayLineHeight: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const RSPrefs = useContext(PreferencesContext);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);
  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useRef({
    [ReadingDisplayLineHeightOptions.publisher]: null,
    [ReadingDisplayLineHeightOptions.small]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.small] || defaultLineHeights[ReadingDisplayLineHeightOptions.small],
    [ReadingDisplayLineHeightOptions.medium]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.medium] || defaultLineHeights[ReadingDisplayLineHeightOptions.medium],
    [ReadingDisplayLineHeightOptions.large]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.large] || defaultLineHeights[ReadingDisplayLineHeightOptions.large],
  });

  const updatePreference = useCallback(async (value: string) => {
    const computedValue = value === ReadingDisplayLineHeightOptions.publisher
      ? null 
      : lineHeightOptions.current[value as keyof typeof ReadingDisplayLineHeightOptions];
    
    await submitPreferences({
      lineHeight: computedValue
    });

    const currentLineHeight = getSetting("lineHeight");
    const currentDisplayLineHeightOption = Object.entries(lineHeightOptions.current).find(([key, value]) => value === currentLineHeight)?.[0] as ReadingDisplayLineHeightOptions;

    dispatch(setLineHeight(currentDisplayLineHeightOption));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    <RadioGroupWrapper 
      standalone={ standalone }
      label={ Locale.reader.settings.lineHeight.title }
      orientation="horizontal"
      value={ publisherStyles ? ReadingDisplayLineHeightOptions.publisher : lineHeight } 
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          label: Locale.reader.settings.lineHeight.publisher, 
          value: ReadingDisplayLineHeightOptions.publisher 
        },
        {
          icon: SmallIcon,
          label: Locale.reader.settings.lineHeight.small, 
          value: ReadingDisplayLineHeightOptions.small 
        },
        {
          icon: MediumIcon,
          label: Locale.reader.settings.lineHeight.medium, 
          value: ReadingDisplayLineHeightOptions.medium 
        },
        {
          icon: LargeIcon,
          label: Locale.reader.settings.lineHeight.large, 
          value: ReadingDisplayLineHeightOptions.large 
        },
      ]}
    />
    </>
  );
}