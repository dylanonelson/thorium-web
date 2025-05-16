"use client";

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

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { StatefulTextAlign } from "./StatefulTextAlign";
import { StatefulFontFamily } from "./StatefulFontFamily";
import { StatefulFontWeight } from "./StatefulFontWeight";
import { StatefulHyphens } from "./StatefulHyphens";
import { StatefulTextNormalize } from "./StatefulTextNormalize";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

const TextSettingsMap: { [key in ThTextSettingsKeys]: StatefulSettingsMapObject } = {
  [ThTextSettingsKeys.fontFamily]: {
    Comp: StatefulFontFamily
  },
  [ThTextSettingsKeys.fontWeight]: {
    Comp: StatefulFontWeight
  },
  [ThTextSettingsKeys.hyphens]: {
    Comp: StatefulHyphens
  },
  [ThTextSettingsKeys.textAlign]: {
    Comp: StatefulTextAlign
  },
  [ThTextSettingsKeys.textNormalize]: {
    Comp: StatefulTextNormalize
  }
}

export const StatefulTextGroup = () => {
  const RSPrefs = useContext(PreferencesContext);
  const dispatch = useAppDispatch();

  const setTextContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.text));
  }, [dispatch]);

  return(
    <>
    <StatefulGroupWrapper 
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

export const StatefulTextGroupContainer = () => {
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