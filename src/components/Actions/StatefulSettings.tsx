"use client";

import React, { useCallback, useContext, useEffect, useRef } from "react";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsSubpanel, 
  defaultTextSettingsMain, 
  defaultTextSettingsSubpanel, 
  PreferencesContext 
} from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { 
  ThActionsKeys, 
  ThSettingsContainerKeys, 
  ThSettingsKeys, 
  ThSheetHeaderVariant, 
  ThSpacingSettingsKeys, 
  ThTextSettingsKeys 
} from "@/preferences/models/enums";
import { StatefulActionContainerProps, StatefulActionTriggerProps } from "./models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { StatefulSettingsMapObject } from "../Settings/models/settings";

import settingsStyles from "../Settings/assets/styles/settings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { spacingComponentsMap, textComponentsMap } from "../Settings/SettingsComponentsMap";

import { StatefulSheetWrapper } from "../Sheets/StatefulSheetWrapper";
import { StatefulActionIcon } from "./Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "./Triggers/StatefulOverflowMenuItem";

import { StatefulSpacingGroupContainer } from "../Settings/StatefulSpacingGroup";
import { StatefulTextGroupContainer } from "../Settings/StatefulTextGroup";

import { useComponentsMap } from "../ComponentsMapContext";
import { useDocking } from "../Docking/hooks/useDocking";

import { setHovering, setSettingsContainer } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export const StatefulSettingsContainer = ({ 
  triggerRef
}: StatefulActionContainerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const { settingsComponentsMap, spacingComponentsMap, textComponentsMap } = useComponentsMap();
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const contains = useAppSelector(state => state.reader.settingsContainer);
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.settings]);
  const dispatch = useAppDispatch();

  const settingItems = useRef(isFXL ? RSPrefs.settings.fxlOrder : RSPrefs.settings.reflowOrder);
  
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

  const isTextNested = useCallback((key: ThSettingsKeys) => {
    const textSettings = [
      RSPrefs.settings.text?.main || defaultTextSettingsMain,
      RSPrefs.settings.text?.subPanel || defaultTextSettingsSubpanel,
    ].flat() as ThTextSettingsKeys[];
  
    return textSettings.includes(key as unknown as ThTextSettingsKeys);
  }, [RSPrefs.settings.text]);
  
  const isSpacingNested = useCallback((key: ThSettingsKeys) => {
    const spacingSettings = [
      RSPrefs.settings.spacing?.main || defaultSpacingSettingsMain,
      RSPrefs.settings.spacing?.subPanel || defaultSpacingSettingsSubpanel,
    ].flat() as ThSpacingSettingsKeys[];
  
    return spacingSettings.includes(key as unknown as ThSpacingSettingsKeys);
  }, [RSPrefs.settings.spacing]);

  const renderSettings = useCallback(() => {
    switch (contains) {
      case ThSettingsContainerKeys.text:
        return <StatefulTextGroupContainer componentsMap={ textComponentsMap }/>;
      
      case ThSettingsContainerKeys.spacing:
        return <StatefulSpacingGroupContainer componentsMap={ spacingComponentsMap} />;

      case ThSettingsContainerKeys.initial:
      default:
        return (
          <>
            {
              settingItems.current
                .filter((key) => !(isTextNested(key) || isSpacingNested(key)))
                .map((key: ThSettingsKeys) => {
                  const setting = settingsComponentsMap[key];
                  return <setting.Comp key={ key } { ...setting.props } />;
                })
            }
          </>
        );
    }
  }, [settingsComponentsMap, textComponentsMap, spacingComponentsMap, contains, isTextNested, isSpacingNested]);

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

export const StatefulSettingsTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.settings]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ThActionsKeys.settings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.settings.trigger }
          SVGIcon={ TuneIcon }
          shortcut={ RSPrefs.actions.keys[ThActionsKeys.settings].shortcut } 
          id={ ThActionsKeys.settings }
          onAction={ () => setOpen(!actionState.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ RSPrefs.actions.keys[ThActionsKeys.settings].visibility }
          aria-label={ Locale.reader.settings.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.settings.tooltip } 
          onPress={ () => setOpen(!actionState.isOpen) }
        >
          <TuneIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}