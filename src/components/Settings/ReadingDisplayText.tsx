import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { ReadingDisplayFontFamily } from "./ReadingDisplayFontFamily";
import { AdvancedIcon } from "./Wrappers/AdvancedIcon";

import classNames from "classnames";

export const ReadingDisplayText = () => {
  return(
    <>
    <div className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsGroupFlex) }>
      <ReadingDisplayFontFamily standalone={ false } />
      <AdvancedIcon
        isDisabled={ true }
        className={ settingsStyles.readerSettingsAdvancedIcon }
        ariaLabel={ Locale.reader.settings.text.advanced.trigger }
        placement="top"
        tooltipLabel={ Locale.reader.settings.text.advanced.tooltip }
        onPressCallback={ () => {} }
      />
    </div>
    </>
  )
}