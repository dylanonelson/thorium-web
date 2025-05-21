"use client";

import React, { useCallback, useContext, useEffect, useRef } from "react";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsSubpanel, 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext, 
  SettingsKeyType, 
  SpacingSettingsKeyType, 
  TextSettingsKeyType, 
  usePreferenceKeys
} from "@/preferences";

import Locale from "../../../resources/locales/en.json";

import { 
  ThActionsKeys, 
  ThSettingsContainerKeys, 
  ThSheetHeaderVariant
} from "@/preferences/models/enums";
import { StatefulActionContainerProps } from "../models/actions";

import settingsStyles from "../../Settings/assets/styles/settings.module.css";

import { StatefulSheetWrapper } from "../../Sheets/StatefulSheetWrapper";

import { StatefulSpacingGroupContainer } from "../../Settings/StatefulSpacingGroup";
import { StatefulTextGroupContainer } from "../../Settings/StatefulTextGroup";

import { usePlugins } from "@/components/Plugins/PluginProvider";
import { useDocking } from "../../Docking/hooks/useDocking";

import { setHovering, setSettingsContainer } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export const StatefulSettingsContainer = ({ 
  triggerRef
}: StatefulActionContainerProps) => {
  const { 
    fxlSettingsKeys, 
    mainSpacingSettingsKeys,
    mainTextSettingsKeys,
    reflowSettingsKeys,
    subPanelSpacingSettingsKeys,
    subPanelTextSettingsKeys,
  } = usePreferenceKeys();
  const RSPrefs = useContext(PreferencesContext);
  const { settingsComponentsMap, textSettingsComponentsMap, spacingSettingsComponentsMap } = usePlugins();
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const contains = useAppSelector(state => state.reader.settingsContainer);
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.settings]);
  const dispatch = useAppDispatch();

  const settingItems = useRef(isFXL ? fxlSettingsKeys : reflowSettingsKeys);
  
  const docking = useDocking(ThActionsKeys.settings);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ThActionsKeys.settings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  const setInitial = useCallback(() => {
    dispatch(setSettingsContainer(ThSettingsContainerKeys.initial));
  }, [dispatch]);

  const isTextNested = useCallback((key: string) => {
    const textSettings = [
      mainTextSettingsKeys || defaultTextSettingsMain,
      subPanelTextSettingsKeys || defaultTextSettingsSubpanel,
    ].flat() as string[];
  
    return textSettings.includes(key);
  }, [mainTextSettingsKeys, subPanelTextSettingsKeys]);
  
  const isSpacingNested = useCallback((key: string) => {
    const spacingSettings = [
      mainSpacingSettingsKeys || defaultSpacingSettingsMain,
      subPanelSpacingSettingsKeys || defaultSpacingSettingsSubpanel,
    ].flat() as string[];
  
    return spacingSettings.includes(key);
  }, [mainSpacingSettingsKeys, subPanelSpacingSettingsKeys]);

  const renderSettings = useCallback(() => {
    switch (contains) {
      case ThSettingsContainerKeys.text:
        return <StatefulTextGroupContainer />;
      
      case ThSettingsContainerKeys.spacing:
        return <StatefulSpacingGroupContainer />;

      case ThSettingsContainerKeys.initial:
      default:
        return (
          <>
            { settingItems.current.length > 0 && settingsComponentsMap 
              ? settingItems.current
                .filter((key) => !(isTextNested(key) || isSpacingNested(key)))
                .map((key) => {
                  const match = settingsComponentsMap[key];
                  return match && <match.Comp key={ key } { ...match.props } />;
                })
              : <></>
            }
          </>
        );
    }
  }, [settingsComponentsMap, contains, isTextNested, isSpacingNested]);

  const getHeading = useCallback(() => {
    switch (contains) {
      case ThSettingsContainerKeys.text:
        return Locale.reader.settings.text.title;

      case ThSettingsContainerKeys.spacing:
        return Locale.reader.settings.spacing.title;

      case ThSettingsContainerKeys.initial:
      default:
        return Locale.reader.settings.heading;
    }
  }, [contains]);

  const getHeaderVariant = useCallback(() => {
    switch (contains) {
      case ThSettingsContainerKeys.text:
        return RSPrefs.settings.text?.header || ThSheetHeaderVariant.close;

      case ThSettingsContainerKeys.spacing:
        return RSPrefs.settings.spacing?.header || ThSheetHeaderVariant.close;

      case ThSettingsContainerKeys.initial:
      default:
        return ThSheetHeaderVariant.close;
    }
  }, [contains, RSPrefs.settings.spacing, RSPrefs.settings.text]);

useEffect(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && contains !== ThSettingsContainerKeys.initial) {
      dispatch(setSettingsContainer(ThSettingsContainerKeys.initial));
    }
  };

  document.addEventListener("keydown", handleEscape, true);

  return () => {
    document.removeEventListener("keydown", handleEscape, true);
  };
}, [contains, dispatch]);


  // Reset when closed
  useEffect(() => {
    if (!actionState.isOpen) setInitial();
  }, [actionState.isOpen, setInitial]);

  return(
    <>
    <StatefulSheetWrapper 
      sheetType={ sheetType }
      sheetProps={ {
        id: ThActionsKeys.settings,
        triggerRef: triggerRef,
        heading: getHeading(),
        headerVariant: getHeaderVariant(),
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChange: setOpen, 
        onPressClose: () => { contains === ThSettingsContainerKeys.initial ? setOpen(false) : setInitial() },
        docker: docking.getDocker(),
        resetFocus: contains,
        dismissEscapeKeyClose: contains !== ThSettingsContainerKeys.initial
      } }
    >
      { renderSettings() }
    </StatefulSheetWrapper>
    </>
  )
}