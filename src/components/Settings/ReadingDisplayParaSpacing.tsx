import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultParaSpacing, IAdvancedDisplayProps } from "@/models/settings";

import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayParaSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const paraSpacing = useAppSelector(state => state.settings.paraSpacing);
  const paraSpacingRangeConfig = RSPrefs.settings.spacing?.paraSpacing || defaultParaSpacing;

  const { applyParaSpacing } = useEpubNavigator();

  return (
    <>
    <SliderWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 0 } 
      value={ paraSpacing || 0 } 
      onChangeCallback={ async(value) => await applyParaSpacing(value) } 
      label={ Locale.reader.settings.paraSpacing.title }
      range={ paraSpacingRangeConfig.range }
      step={ paraSpacingRangeConfig.step }
      format={{
        signDisplay: "exceptZero",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }}
      standalone={ standalone }
    /> 
    </>
  )
}