import { useCallback, useContext } from "react";

import { defaultParagraphIndent, PreferencesContext, ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsItemProps } from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParagraphIndent, setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayParaIndent = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const paragraphIndent = useAppSelector(state => state.settings.paragraphIndent);
  const paragraphIndentRangeConfig = {
      variant: RSPrefs.settings.keys?.[ThSettingsKeys.paraIndent]?.variant ?? defaultParagraphIndent.variant,
      range: RSPrefs.settings.keys?.[ThSettingsKeys.paraIndent]?.range ?? defaultParagraphIndent.range,
      step: RSPrefs.settings.keys?.[ThSettingsKeys.paraIndent]?.step ?? defaultParagraphIndent.step
    };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphIndent: value
    });

    dispatch(setParagraphIndent(getSetting("paragraphIndent")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { paragraphIndentRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        label={ Locale.reader.settings.paraIndent.title }
        defaultValue={ 0 } 
        value={ paragraphIndent || 0 } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ paragraphIndentRangeConfig.range }
        step={ paragraphIndentRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.paraIndent.decrease,
          incrementLabel: Locale.reader.settings.paraIndent.increase
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
        label={ Locale.reader.settings.paraIndent.title }
        defaultValue={ 0 } 
        value={ paragraphIndent || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ paragraphIndentRangeConfig.range }
        step={ paragraphIndentRangeConfig.step }
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