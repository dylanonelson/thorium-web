import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { 
  defaultLetterSpacing, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLetterSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayLetterSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const RSPrefs = useContext(PreferencesContext);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const letterSpacingRangeConfig = {
    variant: RSPrefs.settings.spacing?.letterSpacing?.variant ?? defaultLetterSpacing.variant,
    range: RSPrefs.settings.spacing?.letterSpacing?.range ?? defaultLetterSpacing.range,
    step: RSPrefs.settings.spacing?.letterSpacing?.step ?? defaultLetterSpacing.step
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
    { letterSpacingRangeConfig.variant === SettingsRangeVariant.numberField 
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