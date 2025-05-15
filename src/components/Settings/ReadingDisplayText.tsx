import { useCallback, useContext } from "react";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext, 
  ThSettingsContainerKeys, 
  ThTextSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsMapObject } from "./models/settings";

import { ReadingDisplayGroupWrapper } from "./Wrappers/ReadingDisplayGroupWrapper";

import { ReadingDisplayAlign } from "./ReadingDisplayAlign";
import { ReadingDisplayFontFamily } from "./ReadingDisplayFontFamily";
import { ReadingDisplayFontWeight } from "./ReadingDisplayFontWeight";
import { ReadingDisplayHyphens } from "./ReadingDisplayHyphens";
import { ReadingDisplayNormalizeText } from "./ReadingDisplayNormalizeText";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

const TextSettingsMap: { [key in ThTextSettingsKeys]: StatefulSettingsMapObject } = {
  [ThTextSettingsKeys.align]: {
    Comp: ReadingDisplayAlign
  },
  [ThTextSettingsKeys.fontFamily]: {
    Comp: ReadingDisplayFontFamily
  },
  [ThTextSettingsKeys.fontWeight]: {
    Comp: ReadingDisplayFontWeight
  },
  [ThTextSettingsKeys.hyphens]: {
    Comp: ReadingDisplayHyphens
  },
  [ThTextSettingsKeys.normalizeText]: {
    Comp: ReadingDisplayNormalizeText
  }
}

export const ReadingDisplayText = () => {
  const RSPrefs = useContext(PreferencesContext);
  const dispatch = useAppDispatch();

  const setTextContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.text));
  }, [dispatch]);

  return(
    <>
    <ReadingDisplayGroupWrapper 
      heading={ Locale.reader.settings.text.title }
      moreLabel={ Locale.reader.settings.text.advanced.trigger }
      moreTooltip={ Locale.reader.settings.text.advanced.tooltip }
      onPressMore={ setTextContainer }
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
  const displayOrder = RSPrefs.settings.text?.subPanel as ThTextSettingsKeys[] | null | undefined || defaultTextSettingsSubpanel;

  return(
    <>
    { displayOrder.map((key: ThTextSettingsKeys) => {
      const { Comp } = TextSettingsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}