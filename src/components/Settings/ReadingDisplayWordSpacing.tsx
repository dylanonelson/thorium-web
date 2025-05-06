import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { 
  defaultWordSpacing, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles, setWordSpacing } from "@/lib/settingsReducer";

export const ReadingDisplayWordSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const RSPrefs = useContext(PreferencesContext);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);
  const wordSpacingRangeConfig = {
    variant: RSPrefs.settings.spacing?.wordSpacing?.variant ?? defaultWordSpacing.variant,
    range: RSPrefs.settings.spacing?.wordSpacing?.range ?? defaultWordSpacing.range,
    step: RSPrefs.settings.spacing?.wordSpacing?.step ?? defaultWordSpacing.step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      wordSpacing: value
    });

    dispatch(setWordSpacing(getSetting("wordSpacing")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { wordSpacingRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        label={ Locale.reader.settings.wordSpacing.title }
        defaultValue={ 0 } 
        value={ wordSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.wordSpacing.decrease,
          incrementLabel: Locale.reader.settings.wordSpacing.increase
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ standalone }
        label={ Locale.reader.settings.wordSpacing.title }
        defaultValue={ 0 } 
        value={ wordSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        formatOptions={{ style: "percent" }}
      /> 
    }
    </>
  )
}