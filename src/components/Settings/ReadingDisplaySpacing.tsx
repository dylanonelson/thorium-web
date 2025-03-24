import { useCallback } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsOrder, 
  ISettingsMapObject, 
  SettingsContainerKeys, 
  SpacingSettingsKeys 
} from "@/models/settings";

import { Heading } from "react-aria-components";

import { AdvancedIcon } from "./Wrappers/AdvancedIcon";

import { ReadingDisplayLetterSpacing } from "./ReadingDisplayLetterSpacing";
import { ReadingDisplayLineHeight } from "./ReadingDisplayLineHeight";
import { ReadingDisplayParaIndent } from "./ReadingDisplayParaIndent";
import { ReadingDisplayParaSpacing } from "./ReadingDisplayParaSpacing";
import { ReadingDisplayPublisherStyles } from "./ReadingDisplayPublisherStyles";
import { ReadingDisplayWordSpacing } from "./ReadingDisplayWordSpacing";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

import classNames from "classnames";

const SpacingSettingsMap: { [key in SpacingSettingsKeys]: ISettingsMapObject } = {
  [SpacingSettingsKeys.letterSpacing]: {
    Comp: ReadingDisplayLetterSpacing
  },
  [SpacingSettingsKeys.lineHeight]: {
    Comp: ReadingDisplayLineHeight
  },
  [SpacingSettingsKeys.paraIndent]: {
    Comp: ReadingDisplayParaIndent
  },
  [SpacingSettingsKeys.paraSpacing]: {
    Comp: ReadingDisplayParaSpacing
  },
  [SpacingSettingsKeys.publisherStyles]: {
    Comp: ReadingDisplayPublisherStyles
  },
  [SpacingSettingsKeys.wordSpacing]: {
    Comp: ReadingDisplayWordSpacing
  }
}

export const ReadingDisplaySpacing = () => {
  const main = RSPrefs.settings.spacing?.main || defaultSpacingSettingsMain;
  const isAdvanced = main.length < Object.keys(SpacingSettingsMap).length;
  
  const dispatch = useAppDispatch();
  
  const setSpacingContainer = useCallback(() => {
    dispatch(setSettingsContainer(SettingsContainerKeys.spacing));
  }, [dispatch]);

  return (
    <>
    <div className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }>
      { isAdvanced && 
        <Heading className={ classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsGroupLabel) }>
          { Locale.reader.settings.spacing.title }
        </Heading> }
      { main.map((key: SpacingSettingsKeys, index) => {
        const { Comp } = SpacingSettingsMap[key];
        return <Comp key={ key } standalone={ !isAdvanced || index !== 0 } />;
      }) }
      { isAdvanced && (
        <AdvancedIcon
          className={ settingsStyles.readerSettingsAdvancedIcon }
          ariaLabel={ Locale.reader.settings.spacing.advanced.trigger }
          placement="top"
          tooltipLabel={ Locale.reader.settings.spacing.advanced.tooltip }
          onPressCallback={ setSpacingContainer }
        />
      ) }
    </div>
    </>
  );
}


export const ReadingDisplaySpacingContainer = () => {
  const displayOrder = RSPrefs.settings.spacing?.displayOrder || defaultSpacingSettingsOrder;

  return(
    <>
    { displayOrder.map((key: SpacingSettingsKeys) => {
      const { Comp } = SpacingSettingsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}