import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { 
  defaultParagraphSpacing, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParagraphSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayParaSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const RSPrefs = useContext(PreferencesContext);
  const paragraphSpacing = useAppSelector(state => state.settings.paragraphSpacing);
  const paragraphSpacingRangeConfig = {
    variant: RSPrefs.settings.spacing?.paragraphSpacing?.variant ?? defaultParagraphSpacing.variant,
    range: RSPrefs.settings.spacing?.paragraphSpacing?.range ?? defaultParagraphSpacing.range,
    step: RSPrefs.settings.spacing?.paragraphSpacing?.step ?? defaultParagraphSpacing.step
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
    { paragraphSpacingRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
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
      : <SliderWrapper
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