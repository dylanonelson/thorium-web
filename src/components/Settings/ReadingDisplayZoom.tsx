import React, { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { defaultFontSize, SettingsRangeVariant } from "@/models/settings";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

import { SliderWrapper } from "./Wrappers/SliderWrapper";
import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

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

  const zoomRangeConfig = {
    variant: RSPrefs.settings.zoom?.variant || defaultFontSize.variant,
    range: preferencesEditor?.fontSize.supportedRange || defaultFontSize.range,
    step: preferencesEditor?.fontSize.step || defaultFontSize.step
  }

  return (
    <>
    { zoomRangeConfig.variant === SettingsRangeVariant.numberField 
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