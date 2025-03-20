import Locale from "../../resources/locales/en.json";

import { defaultTextSettingsMain, ISettingsMapObject, TextSettingsKeys } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { AdvancedIcon } from "./Wrappers/AdvancedIcon";

import { ReadingDisplayAlign } from "./ReadingDisplayAlign";
import { ReadingDisplayFontFamily } from "./ReadingDisplayFontFamily";
import { ReadingDisplayHyphens } from "./ReadingDisplayHyphens";

import classNames from "classnames";
import { RSPrefs } from "@/preferences";

const TextSettingsMap: { [key in TextSettingsKeys]: ISettingsMapObject } = {
  [TextSettingsKeys.align]: {
    Comp: ReadingDisplayAlign
  },
  [TextSettingsKeys.fontFamily]: {
    Comp: ReadingDisplayFontFamily
  },
  [TextSettingsKeys.hyphens]: {
    Comp: ReadingDisplayHyphens
  }
}

export const ReadingDisplayText = () => {
  const main = RSPrefs.settings.text?.main || defaultTextSettingsMain;

  return(
    <>
    <div className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }>
      { main.map((key: TextSettingsKeys, index) => {
        const { Comp } = TextSettingsMap[key];
        return <Comp key={ key } standalone={ index !== 0 } />;
      }) }
      { main.length < Object.keys(TextSettingsMap).length && (
        <AdvancedIcon
          isDisabled={ true }
          className={ settingsStyles.readerSettingsAdvancedIcon }
          ariaLabel={ Locale.reader.settings.text.advanced.trigger }
          placement="top"
          tooltipLabel={ Locale.reader.settings.text.advanced.tooltip }
          onPressCallback={ () => {} }
        />
      ) }
    </div>
    </>
  )
}
