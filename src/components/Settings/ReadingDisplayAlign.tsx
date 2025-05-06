import React, { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayAlignOptions } from "@/models/layout";
import { LayoutDirection } from "@/preferences";
import { IAdvancedDisplayProps } from "@/models/settings";
import { TextAlignment } from "@readium/navigator";

import BookIcon from "../assets/icons/book.svg";
import LeftAlignIcon from "../assets/icons/format_align_left.svg";
import RightAlignIcon from "../assets/icons/format_align_right.svg";
import JustifyIcon from "../assets/icons/format_align_justify.svg";

import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTextAlign, setHyphens } from "@/lib/settingsReducer";

export const ReadingDisplayAlign: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const isRTL = useAppSelector(state => state.reader.direction) === LayoutDirection.rtl;
  const textAlign = useAppSelector(state => state.settings.textAlign);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    const textAlign: TextAlignment | null = value === ReadingDisplayAlignOptions.publisher 
      ? null 
      : value === ReadingDisplayAlignOptions.start 
        ? TextAlignment.start 
        : TextAlignment.justify;
    
    const currentHyphens = getSetting("hyphens") as boolean | undefined | null;
    
    const hyphens = textAlign === null 
      ? null 
      : (currentHyphens ?? textAlign === TextAlignment.justify);
    
      await submitPreferences({
        textAlign: textAlign,
        hyphens: hyphens
      });
      
      const textAlignSetting = getSetting("textAlign") as TextAlignment | null;
      const textAlignValue = textAlignSetting === null ? ReadingDisplayAlignOptions.publisher : textAlignSetting as unknown as ReadingDisplayAlignOptions;
      
      dispatch(setTextAlign(textAlignValue));
      dispatch(setHyphens(getSetting("hyphens")));
  }, [getSetting, submitPreferences, dispatch]);

  return (
    <>
    <RadioGroupWrapper 
      standalone={ standalone } 
      label={ Locale.reader.settings.align.title }
      orientation="horizontal" 
      value={ textAlign } 
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          label: Locale.reader.settings.align.publisher, 
          value: ReadingDisplayAlignOptions.publisher 
        },
        {
          icon: isRTL ? RightAlignIcon : LeftAlignIcon,
          label: isRTL ? Locale.reader.settings.align.right : Locale.reader.settings.align.left, 
          value: ReadingDisplayAlignOptions.start 
        },
        {
          icon: JustifyIcon,
          label: Locale.reader.settings.align.justify, 
          value: ReadingDisplayAlignOptions.justify 
        }
      ]}
    />
    </>
  );
}