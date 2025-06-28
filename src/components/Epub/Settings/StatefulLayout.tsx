"use client";

import React, { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import { ThLayoutOptions } from "@/preferences/models/enums";

import ScrollableIcon from "./assets/icons/contract.svg";
import PaginatedIcon from "./assets/icons/docs.svg";

import { StatefulRadioGroup } from "../../Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setScroll } from "@/lib/settingsReducer";

export const StatefulLayout = () => {
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences, handleScrollAffordances } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => { 
    const derivedValue = value === ThLayoutOptions.scroll;
    await submitPreferences({ scroll: derivedValue });
    dispatch(setScroll(getSetting("scroll")));

    // [TMP] We need to handle this in multiple places due to the lack
    // of Injection API. This mounts and unmounts scroll affordances
    handleScrollAffordances(derivedValue);
  }, [submitPreferences, getSetting, dispatch, handleScrollAffordances]);

  return (
    <>
    <StatefulRadioGroup
      standalone={ true }
      label={ Locale.reader.settings.layout.title }
      orientation="horizontal"
      value={ isScroll ? ThLayoutOptions.scroll : ThLayoutOptions.paginated }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: PaginatedIcon,
          label: Locale.reader.settings.layout.paginated,
          value: ThLayoutOptions.paginated
        },
        {
          icon: ScrollableIcon,
          label: Locale.reader.settings.layout.scrolled,
          value: ThLayoutOptions.scroll
        }
      ]} 
    />
    </>
  )
}