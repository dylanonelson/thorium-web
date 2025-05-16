"use client";

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

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

export interface StatefulSpacingGroupProps {
  componentsMap: { [key: string | number | symbol]: StatefulSettingsMapObject }
}

export const StatefulSpacingGroup = ({ 
  componentsMap 
}: StatefulSpacingGroupProps) => {
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
      componentsMap={ componentsMap }
      prefs={ RSPrefs.settings.spacing }
      defaultPrefs={ {
        main: defaultSpacingSettingsMain, 
        subPanel: defaultSpacingSettingsSubpanel
      }}
    />
    </>
  );
}

export const StatefulSpacingGroupContainer = ({   
  componentsMap 
}: StatefulSpacingGroupProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const displayOrder = RSPrefs.settings.spacing?.subPanel as ThSpacingSettingsKeys[] | null | undefined || defaultSpacingSettingsSubpanel;

  return(
    <>
    { displayOrder.map((key: ThSpacingSettingsKeys) => {
      const { Comp } = componentsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}