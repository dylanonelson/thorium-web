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

import { StatefulGroupWrapper } from "./Wrappers/StatefulGroupWrapper";

import { StatefulLetterSpacing } from "./StatefulLetterSpacing";
import { StatefulLineHeight } from "./StatefulLineHeight";
import { StatefulParagraphIndent } from "./StatefulParagraphIndent";
import { StatefulParagraphSpacing } from "./StatefulParagraphSpacing";
import { StatefulPublisherStyles } from "./StatefulPublisherStyles";
import { StatefulWordSpacing } from "./StatefulWordSpacing";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

const StatefulSpacingSettingsMap: { [key in ThSpacingSettingsKeys]: StatefulSettingsMapObject } = {
  [ThSpacingSettingsKeys.letterSpacing]: {
    Comp: StatefulLetterSpacing
  },
  [ThSpacingSettingsKeys.lineHeight]: {
    Comp: StatefulLineHeight
  },
  [ThSpacingSettingsKeys.paragraphIndent]: {
    Comp: StatefulParagraphIndent
  },
  [ThSpacingSettingsKeys.paragraphSpacing]: {
    Comp: StatefulParagraphSpacing
  },
  [ThSpacingSettingsKeys.publisherStyles]: {
    Comp: StatefulPublisherStyles
  },
  [ThSpacingSettingsKeys.wordSpacing]: {
    Comp: StatefulWordSpacing
  }
}

export const StatefulSpacingGroup = () => {
  const RSPrefs = useContext(PreferencesContext);
  const dispatch = useAppDispatch();
  
  const setSpacingContainer = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.spacing));
  }, [dispatch]);

  return (
    <>
    <StatefulGroupWrapper 
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

export const StatefulSpacingGroupContainer = () => {
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