"use client";

import React, { useCallback } from "react";

import { ThTextAlignOptions } from "@/preferences/models/enums";
import { StatefulSettingsItemProps } from "../../../Settings/models/settings";
import { TextAlignment } from "@readium/navigator";

import BookIcon from "../assets/icons/book.svg";
import LeftAlignIcon from "./assets/icons/format_align_left.svg";
import RightAlignIcon from "./assets/icons/format_align_right.svg";
import JustifyIcon from "./assets/icons/format_align_justify.svg";

import { StatefulRadioGroup } from "../../../Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTextAlign, setHyphens } from "@/lib/settingsReducer";

export const StatefulTextAlign = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const isRTL = useAppSelector(state => state.publication.isRTL);
  const textAlign = useAppSelector(state => state.settings.textAlign);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    const textAlign: TextAlignment | null = value === ThTextAlignOptions.publisher 
      ? null 
      : value === ThTextAlignOptions.start 
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
      const textAlignValue = textAlignSetting === null ? ThTextAlignOptions.publisher : textAlignSetting as unknown as ThTextAlignOptions;
      
      dispatch(setTextAlign(textAlignValue));
      dispatch(setHyphens(getSetting("hyphens")));
  }, [getSetting, submitPreferences, dispatch]);

  return (
    <>
    <StatefulRadioGroup 
      standalone={ standalone } 
      label={ t("reader.settings.align.title") }
      orientation="horizontal" 
      value={ textAlign } 
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          label: t("reader.settings.align.publisher"), 
          value: ThTextAlignOptions.publisher 
        },
        {
          icon: isRTL ? RightAlignIcon : LeftAlignIcon,
          label: isRTL ? t("reader.settings.align.right") : t("reader.settings.align.left"), 
          value: ThTextAlignOptions.start 
        },
        {
          icon: JustifyIcon,
          label: t("reader.settings.align.justify"), 
          value: ThTextAlignOptions.justify 
        }
      ]}
    />
    </>
  );
}