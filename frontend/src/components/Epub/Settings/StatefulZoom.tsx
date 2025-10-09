"use client";

import React, { useCallback } from "react";

import { ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import Decrease from "./assets/icons/text_decrease.svg";
import Increase from "./assets/icons/text_increase.svg";
import ZoomOut from "./assets/icons/zoom_out.svg";
import ZoomIn from "./assets/icons/zoom_in.svg";

import { StatefulSlider } from "../../Settings/StatefulSlider";
import { StatefulNumberField } from "../../Settings/StatefulNumberField";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { usePlaceholder } from "./hooks/usePlaceholder";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFontSize } from "@/lib/settingsReducer";


export const StatefulZoom = () => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  const dispatch = useAppDispatch();
  
  const { 
    getSetting, 
    submitPreferences,
    preferencesEditor 
  } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number | number[]) => {
    await submitPreferences({ fontSize: Array.isArray(value) ? value[0] : value });
    dispatch(setFontSize(getSetting("fontSize")));
  }, [submitPreferences, getSetting, dispatch]);

  const getEffectiveRange = (preferred: [number, number], supportedRange: [number, number] | undefined): [number, number] => {
    if (!supportedRange) {
      return preferred
    }
    if (preferred && isRangeWithinSupportedRange(preferred, supportedRange)) {
      return preferred;
    }
    return supportedRange;
  }
  
  const isRangeWithinSupportedRange = (range: [number, number], supportedRange: [number, number]): boolean => {
    return Math.min(range[0], range[1]) >= Math.min(supportedRange[0], supportedRange[1]) &&
           Math.max(range[0], range[1]) <= Math.max(supportedRange[0], supportedRange[1]);
  }

  const zoomRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.zoom].variant,
    placeholder: preferences.settings.keys[ThSettingsKeys.zoom].placeholder,
    range: preferencesEditor?.fontSize.supportedRange
      ? getEffectiveRange(preferences.settings.keys[ThSettingsKeys.zoom].range, preferencesEditor?.fontSize.supportedRange)
      : preferences.settings.keys[ThSettingsKeys.zoom].range,
    step: preferences.settings.keys[ThSettingsKeys.zoom].step
  }

  const placeholderText = usePlaceholder(zoomRangeConfig.placeholder, zoomRangeConfig.range);

  return (
    <>
    { zoomRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField
        standalone={ true}
        defaultValue={ 1 } 
        value={ fontSize } 
        onChange={ async(value) => await updatePreference(value) } 
        label={ isFXL ? t("reader.settings.zoom.title") : t("reader.settings.fontSize.title") }
        placeholder={ placeholderText }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        steppers={{
          decrementIcon: isFXL ? ZoomOut : Decrease,
          decrementLabel: isFXL ? t("reader.settings.zoom.decrease") : t("reader.settings.fontSize.decrease"),
          incrementIcon: isFXL ? ZoomIn : Increase,
          incrementLabel: isFXL ? t("reader.settings.zoom.increase") : t("reader.settings.fontSize.increase")
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <StatefulSlider
        standalone={ true }
        displayTicks={ zoomRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        defaultValue={ 1 } 
        value={ fontSize } 
        onChange={ async(value) => await updatePreference(value as number) } 
        label={ isFXL ? t("reader.settings.zoom.title") : t("reader.settings.fontSize.title") }
        placeholder={ placeholderText }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        formatOptions={{ style: "percent" }} 
      />
    } 
    </>
  );
};