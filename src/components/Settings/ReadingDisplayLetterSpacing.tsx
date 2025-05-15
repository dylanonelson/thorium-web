import { useCallback, useContext } from "react";

import { defaultLetterSpacing, PreferencesContext, ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsItemProps } from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLetterSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayLetterSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const letterSpacingRangeConfig = {
    variant: RSPrefs.settings.keys?.[ThSettingsKeys.letterSpacing]?.variant ?? defaultLetterSpacing.variant,
    range: RSPrefs.settings.keys?.[ThSettingsKeys.letterSpacing]?.range ?? defaultLetterSpacing.range,
    step: RSPrefs.settings.keys?.[ThSettingsKeys.letterSpacing]?.step ?? defaultLetterSpacing.step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      letterSpacing: value
    });

    dispatch(setLetterSpacing(getSetting("letterSpacing")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { letterSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        label={ Locale.reader.settings.letterSpacing.title }
        defaultValue={ 0 } 
        value={ letterSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ letterSpacingRangeConfig.range }
        step={ letterSpacingRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.letterSpacing.decrease,
          incrementLabel: Locale.reader.settings.letterSpacing.increase
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ standalone }
        label={ Locale.reader.settings.letterSpacing.title }
        defaultValue={ 0 } 
        value={ letterSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ letterSpacingRangeConfig.range }
        step={ letterSpacingRangeConfig.step }
        formatOptions={ { style: "percent" } }
      />
    } 
    </>
  )
}