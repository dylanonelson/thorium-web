import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultWordSpacing, IAdvancedDisplayProps } from "@/models/settings";

import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayWordSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);
  const wordSpacingRangeConfig = RSPrefs.settings.spacing?.wordSpacing || defaultWordSpacing;

  const { applyWordSpacing } = useEpubNavigator();

  return (
    <>
    <SliderWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 0 } 
      value={ wordSpacing || 0 } 
      onChangeCallback={ async(value) => await applyWordSpacing(value) } 
      label={ Locale.reader.settings.wordSpacing.title }
      range={ wordSpacingRangeConfig.range }
      step={ wordSpacingRangeConfig.step }
      format={{ style: "percent" }}
      standalone={ standalone }
    /> 
    </>
  )
}