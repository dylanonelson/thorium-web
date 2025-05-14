import { useCallback, useContext } from "react";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext, 
  SettingsContainerKeys, 
  TextSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ISettingsMapObject } from "@/models/settings";

import { ReadingDisplayGroupWrapper } from "./Wrappers/ReadingDisplayGroupWrapper";

import { ReadingDisplayAlign } from "./ReadingDisplayAlign";
import { ReadingDisplayFontFamily } from "./ReadingDisplayFontFamily";
import { ReadingDisplayFontWeight } from "./ReadingDisplayFontWeight";
import { ReadingDisplayHyphens } from "./ReadingDisplayHyphens";
import { ReadingDisplayNormalizeText } from "./ReadingDisplayNormalizeText";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

const TextSettingsMap: { [key in TextSettingsKeys]: ISettingsMapObject } = {
  [TextSettingsKeys.align]: {
    Comp: ReadingDisplayAlign
  },
  [TextSettingsKeys.fontFamily]: {
    Comp: ReadingDisplayFontFamily
  },
  [TextSettingsKeys.fontWeight]: {
    Comp: ReadingDisplayFontWeight
  },
  [TextSettingsKeys.hyphens]: {
    Comp: ReadingDisplayHyphens
  },
  [TextSettingsKeys.normalizeText]: {
    Comp: ReadingDisplayNormalizeText
  }
}

export const ReadingDisplayText = () => {
  const RSPrefs = useContext(PreferencesContext);
  const dispatch = useAppDispatch();

  const setTextContainer = useCallback(() => {
    dispatch(setSettingsContainer(SettingsContainerKeys.text));
  }, [dispatch]);

  return(
    <>
    <ReadingDisplayGroupWrapper 
      heading={ Locale.reader.settings.text.title }
      moreLabel={ Locale.reader.settings.text.advanced.trigger }
      moreTooltip={ Locale.reader.settings.text.advanced.tooltip }
      onMorePressCallback={ setTextContainer }
      settingsMap={ TextSettingsMap }
      prefs={ RSPrefs.settings.text }
      defaultPrefs={ {
        main: defaultTextSettingsMain, 
        subPanel: defaultTextSettingsSubpanel
      }}
    />
    </>
  )
}

export const ReadingDisplayTextContainer = () => {
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.text?.subPanel as TextSettingsKeys[] | null | undefined || defaultTextSettingsSubpanel;

  return(
    <>
    { displayOrder.map((key: TextSettingsKeys) => {
      const { Comp } = TextSettingsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}