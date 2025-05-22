"use client";

import { useCallback } from "react";

import { defaultParagraphSpacing, ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsItemProps } from "./models/settings";

import { StatefulNumberField } from "./Wrappers/StatefulNumberField";
import { StatefulSlider } from "./Wrappers/StatefulSlider";

import { usePreferences } from "@/preferences/ThPreferencesContext";
import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParagraphSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulParagraphSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = usePreferences();
  const paragraphSpacing = useAppSelector(state => state.settings.paragraphSpacing);
  const paragraphSpacingRangeConfig = {
    variant: RSPrefs.settings.keys?.[ThSettingsKeys.paragraphSpacing]?.variant ?? defaultParagraphSpacing.variant,
    range: RSPrefs.settings.keys?.[ThSettingsKeys.paragraphSpacing]?.range ?? defaultParagraphSpacing.range,
    step: RSPrefs.settings.keys?.[ThSettingsKeys.paragraphSpacing]?.step ?? defaultParagraphSpacing.step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphSpacing: value
    });

    dispatch(setParagraphSpacing(getSetting("paragraphSpacing")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { paragraphSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ Locale.reader.settings.paraSpacing.title }
        defaultValue={ 0 } 
        value={ paragraphSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ paragraphSpacingRangeConfig.range }
        step={ paragraphSpacingRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.paraSpacing.decrease,
          incrementLabel: Locale.reader.settings.paraSpacing.increase
        }}
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <StatefulSlider
        standalone={ standalone }
        label={ Locale.reader.settings.paraSpacing.title }
        defaultValue={ 0 } 
        value={ paragraphSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ paragraphSpacingRangeConfig.range }
        step={ paragraphSpacingRangeConfig.step }
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }}
      /> 
    }
    </>
  )
}