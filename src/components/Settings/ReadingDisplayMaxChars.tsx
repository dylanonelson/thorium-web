import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { RSLayoutStrategy } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayMaxChars = () => {
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[2]);
  const maxChars = useAppSelector(state => state.settings.tmpMaxChars);
  
  const { nullifyMaxChars } = useEpubNavigator();

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <div className={ settingsStyles.readerSettingsGroup }>
        <SwitchWrapper 
          label={ Locale.reader.layoutStrategy.maxChars }
          onChangeCallback={ async (isSelected: boolean) => await nullifyMaxChars(isSelected ? null : lineLength || RSPrefs.typography.maximalLineLength) }
          isSelected={ maxChars }
          isDisabled={ layoutStrategy !== RSLayoutStrategy.lineLength }
        />
      </div>
    }
    </>
  )
}