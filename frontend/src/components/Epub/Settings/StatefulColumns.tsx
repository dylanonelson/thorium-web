"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import AutoLayoutIcon from "./assets/icons/document_scanner.svg";
import OneColIcon from "./assets/icons/article.svg";
import TwoColsIcon from "./assets/icons/menu_book.svg";

import { StatefulRadioGroup } from "../../Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setColumnCount } from "@/lib/settingsReducer";

import debounce from "debounce";

export const StatefulColumns = () => {
  const { t } = useI18n();
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const columnCount = useAppSelector(state => state.settings.columnCount) || "auto";
  const [effectiveValue, setEffectiveValue] = useState(columnCount);

  const fontSize = useAppSelector(state => state.settings.fontSize);
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const layoutSettings = useMemo(() => {
    return {
      fontSize,
      fontFamily,
      wordSpacing,
      letterSpacing,
      publisherStyles
    };
  }, [fontSize, fontFamily, wordSpacing, letterSpacing, publisherStyles]);

  const dispatch = useAppDispatch();

  const { submitPreferences, getSetting } = useEpubNavigator();

  const items = useMemo(() => [
    {
      id: "auto",
      icon: AutoLayoutIcon,
      label: t("reader.settings.column.auto"), 
      value: "auto" 
    },
    {
      id: "1",
      icon: OneColIcon,
      label: t("reader.settings.column.one"), 
      value: "1" 
    },
    {
      id: "2",
      icon: TwoColsIcon,
      label: t("reader.settings.column.two"), 
      value: "2",
      // This is subpar when the columnCount is 1 though because
      // it won't be disabled, but it's the best we can do with
      // the preferences API at the moment
      isDisabled: effectiveValue === "1" && columnCount === "2"
    }
  ], [t, effectiveValue, columnCount]);

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

  const debouncedUpdate = useCallback(() => {
    const update = () => updateEffectiveValue(columnCount, getSetting("columnCount"));
    debounce(update, 50)();

    // layoutSettings is required as a dependency because it contains all the settings
    // that affect column layout (fontSize, fontFamily, wordSpacing, letterSpacing, publisherStyles)
    // and we need to recalculate the layout when any of these change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnCount, layoutSettings, getSetting, updateEffectiveValue]);

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
      label={ t("reader.settings.column.title") }
      orientation="horizontal"
      value={ effectiveValue }
      onChange={ async (val: string) => await updatePreference(val) }
      isDisabled={ isScroll }
      items={ items }
    />
    </>
  );
}