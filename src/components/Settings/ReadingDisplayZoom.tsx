import React, { useCallback, useContext } from "react";

import { defaultFontSize, PreferencesContext, ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

import { SliderWrapper } from "./Wrappers/SliderWrapper";
import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFontSize } from "@/lib/settingsReducer";

export const ReadingDisplayZoom = () => {
  const RSPrefs = useContext(PreferencesContext);
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  const dispatch = useAppDispatch();
  
  const { 
    getSetting, 
    submitPreferences,
    preferencesEditor 
  } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({ fontSize: value });
    dispatch(setFontSize(getSetting("fontSize")));
  }, [submitPreferences, getSetting, dispatch]);

  const getEffectiveRange = (preferred: [number, number] | undefined, fallback: [number, number], supportedRange: [number, number] | undefined): [number, number] => {
    if (!supportedRange) {
      return preferred || fallback
    }
    if (preferred && isRangeWithinSupportedRange(preferred, supportedRange)) {
      return preferred;
    }
    if (fallback && isRangeWithinSupportedRange(fallback, supportedRange)) {
      return fallback;
    }
    return supportedRange;
  }
  
  const isRangeWithinSupportedRange = (range: [number, number], supportedRange: [number, number]): boolean => {
    return Math.min(range[0], range[1]) >= Math.min(supportedRange[0], supportedRange[1]) &&
           Math.max(range[0], range[1]) <= Math.max(supportedRange[0], supportedRange[1]);
  }

  const zoomRangeConfig = {
    variant: RSPrefs.settings.keys?.[ThSettingsKeys.zoom]?.variant || defaultFontSize.variant,
    range: preferencesEditor?.fontSize.supportedRange
      ? getEffectiveRange(RSPrefs.settings.keys?.[ThSettingsKeys.zoom]?.range, defaultFontSize.range, preferencesEditor?.fontSize.supportedRange)
      : RSPrefs.settings.keys?.[ThSettingsKeys.zoom]?.range || defaultFontSize.range,
    step: RSPrefs.settings.keys?.[ThSettingsKeys.zoom]?.step || preferencesEditor?.fontSize.step || defaultFontSize.step
  }

  return (
    <>
    { zoomRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <NumberFieldWrapper
        standalone={ true}
        defaultValue={ 1 } 
        value={ fontSize } 
        onChange={ async(value) => await updatePreference(value) } 
        label={ isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        steppers={{
          decrementIcon: isFXL ? ZoomOut : Decrease,
          decrementLabel: isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.fontSize.decrease,
          incrementIcon: isFXL ? ZoomIn : Increase,
          incrementLabel: isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.fontSize.increase
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ true }
        defaultValue={ 1 } 
        value={ fontSize } 
        onChange={ async(value) => await updatePreference(value as number) } 
        label={ isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        formatOptions={{ style: "percent" }} 
      />
    } 
    </>
  );
};