import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultLetterSpacing, IAdvancedDisplayProps } from "@/models/settings";

import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayLetterSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const letterSpacingRangeConfig = RSPrefs.settings.spacing?.letterSpacing || defaultLetterSpacing;

  const { applyLetterSpacing } = useEpubNavigator();

  return (
    <>
    <SliderWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 0 } 
      value={ letterSpacing || 0 } 
      onChangeCallback={ async(value) => await applyLetterSpacing(value) } 
      label={ Locale.reader.settings.letterSpacing.title }
      range={ letterSpacingRangeConfig.range }
      step={ letterSpacingRangeConfig.step }
      format={ { style: "percent" } }
      standalone={ standalone }
    /> 
    </>
  )
}