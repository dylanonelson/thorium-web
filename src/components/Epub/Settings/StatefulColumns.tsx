"use client";

import React, { useCallback, useEffect, useState } from "react";

import Locale from "../../../resources/locales/en.json";

import AutoLayoutIcon from "./assets/icons/document_scanner.svg";
import OneColIcon from "./assets/icons/article.svg";
import TwoColsIcon from "./assets/icons/menu_book.svg";
import { StatefulRadioGroup } from "../../Settings/StatefulRadioGroup";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setColumnCount } from "@/lib/settingsReducer";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";

import debounce from "debounce";

export const StatefulColumns = () => {
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;
  const columnCount = useAppSelector(state => state.settings.columnCount) || "auto";
  const [effectiveValue, setEffectiveValue] = useState(columnCount);

  const dispatch = useAppDispatch();
  const { submitPreferences, getSetting } = useEpubNavigator();

  const updateEffectiveValue = useCallback((preference: string, setting: number | null) => {
    const derivedValue = preference === "auto" || setting === null ? "auto" : setting.toString();
    setEffectiveValue(derivedValue);
  }, []);

  const updatePreference = useCallback(async (value: string) => {
    const colCount = value === "auto" ? null : Number(value);
    await submitPreferences({ columnCount: colCount });
    updateEffectiveValue(value, getSetting("columnCount"));
    dispatch(setColumnCount(value));
  }, [submitPreferences, getSetting, updateEffectiveValue, dispatch]);

  // Debounce the resize handler
  const debouncedUpdate = useCallback(() => {
    const update = () => updateEffectiveValue(columnCount, getSetting("columnCount"));
    debounce(update, 50)();
  }, [columnCount, getSetting, updateEffectiveValue]);

  useEffect(() => {
    debouncedUpdate();

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [debouncedUpdate]);

  return (
    <>
    <StatefulRadioGroup 
      standalone={ true }
      label={ Locale.reader.settings.column.title }
      orientation="horizontal"
      value={ effectiveValue }
      onChange={ async (val: string) => await updatePreference(val) }
      isDisabled={ isScroll }
      items={[
        {
          icon: AutoLayoutIcon,
          label: Locale.reader.settings.column.auto, 
          value: "auto" 
        },
        {
          icon: OneColIcon,
          label: Locale.reader.settings.column.one, 
          value: "1" 
        },
        {
          icon: TwoColsIcon,
          label: Locale.reader.settings.column.two, 
          value: "2",
          // This is subpar when the columnCount is 1 though because
          // it won’t be disabled, but it’s the best we can do with
          // the preferences API at the moment
          isDisabled: effectiveValue === "1" && columnCount === "2"
        }
      ]}
    />
    </>
  );
}