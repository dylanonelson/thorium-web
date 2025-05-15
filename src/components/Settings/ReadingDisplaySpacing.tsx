import { useCallback, useContext } from "react";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsSubpanel, 
  PreferencesContext, 
  ThSettingsContainerKeys, 
  ThSpacingSettingsKeys 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { StatefulSettingsMapObject } from "./models/settings";

import { ReadingDisplayGroupWrapper } from "./Wrappers/ReadingDisplayGroupWrapper";

import { ReadingDisplayLetterSpacing } from "./ReadingDisplayLetterSpacing";
import { ReadingDisplayLineHeight } from "./ReadingDisplayLineHeight";
import { ReadingDisplayParaIndent } from "./ReadingDisplayParaIndent";
import { ReadingDisplayParaSpacing } from "./ReadingDisplayParaSpacing";
import { ReadingDisplayPublisherStyles } from "./ReadingDisplayPublisherStyles";
import { ReadingDisplayWordSpacing } from "./ReadingDisplayWordSpacing";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

const StatefulSpacingSettingsMap: { [key in ThSpacingSettingsKeys]: StatefulSettingsMapObject } = {
  [ThSpacingSettingsKeys.letterSpacing]: {
    Comp: ReadingDisplayLetterSpacing
  },
  [ThSpacingSettingsKeys.lineHeight]: {
    Comp: ReadingDisplayLineHeight
  },
  [ThSpacingSettingsKeys.paraIndent]: {
    Comp: ReadingDisplayParaIndent
  },
  [ThSpacingSettingsKeys.paraSpacing]: {
    Comp: ReadingDisplayParaSpacing
  },
  [ThSpacingSettingsKeys.publisherStyles]: {
    Comp: ReadingDisplayPublisherStyles
  },
  [ThSpacingSettingsKeys.wordSpacing]: {
    Comp: ReadingDisplayWordSpacing
  }
}

export const ReadingDisplaySpacing = () => {
  const RSPrefs = useContext(PreferencesContext);
  const dispatch = useAppDispatch();
  
  const setSpacingContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.spacing));
  }, [dispatch]);

  return (
    <>
    <ReadingDisplayGroupWrapper 
      heading={ Locale.reader.settings.spacing.title }
      moreLabel={ Locale.reader.settings.spacing.advanced.trigger }
      moreTooltip={ Locale.reader.settings.spacing.advanced.tooltip }
      onPressMore={ setSpacingContainer }
      settingsMap={ StatefulSpacingSettingsMap }
      prefs={ RSPrefs.settings.spacing }
      defaultPrefs={ {
        main: defaultSpacingSettingsMain, 
        subPanel: defaultSpacingSettingsSubpanel
      }}
    />
    </>
  );
}

export const ReadingDisplaySpacingContainer = () => {
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.spacing?.subPanel as ThSpacingSettingsKeys[] | null | undefined || defaultSpacingSettingsSubpanel;

  return(
    <>
    { displayOrder.map((key: ThSpacingSettingsKeys) => {
      const { Comp } = StatefulSpacingSettingsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}