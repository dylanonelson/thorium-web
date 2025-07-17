"use client";

import React, { useCallback } from "react";

import AutoLayoutIcon from "./assets/icons/document_scanner.svg";
import OneColIcon from "./assets/icons/article.svg";
import TwoColsIcon from "./assets/icons/menu_book.svg";

import { StatefulRadioGroup } from "../../Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setColumnCount } from "@/lib/settingsReducer";

export const StatefulColumns = () => {
  const { t } = useI18n();
  const isScroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const columnCount = useAppSelector(state => state.settings.columnCount) || "auto";
  const dispatch = useAppDispatch();

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    const colCount = value === "auto" ? null : Number(value);

    await submitPreferences({ columnCount: colCount });
    
    // TODO: See how best to handle this for 2 -> 1 column if minimal null
    dispatch(setColumnCount(value));
  }, [submitPreferences, dispatch]);

  return (
    <>
    <StatefulRadioGroup 
      standalone={ true }
      label={ t("reader.settings.column.title") }
      orientation="horizontal"
      value={ columnCount }
      onChange={ async (val: string) => await updatePreference(val) }
      isDisabled={ isScroll && !isFXL }
      items={[
        {
          icon: AutoLayoutIcon,
          label: t("reader.settings.column.auto"), 
          value: "auto" 
        },
        {
          icon: OneColIcon,
          label: t("reader.settings.column.one"), 
          value: "1" 
        },
        {
          icon: TwoColsIcon,
          label: t("reader.settings.column.two"), 
          value: "2" 
        }
      ]}
    />
    </>
  );
}