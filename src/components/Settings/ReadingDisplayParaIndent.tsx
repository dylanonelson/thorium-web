import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultParaIndent, IAdvancedDisplayProps } from "@/models/settings";

import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayParaIndent: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const paraIndent = useAppSelector(state => state.settings.paraIndent);
  const paraIndentRangeConfig = RSPrefs.settings.spacing?.paraIndent || defaultParaIndent;

  const { applyParaIndent } = useEpubNavigator();

  return (
    <>
    <SliderWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 0 } 
      value={ paraIndent || 0 } 
      onChangeCallback={ async(value) => await applyParaIndent(value) } 
      label={ Locale.reader.settings.paraIndent.title }
      range={ paraIndentRangeConfig.range }
      step={ paraIndentRangeConfig.step }
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