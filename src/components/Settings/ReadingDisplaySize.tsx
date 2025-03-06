import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../assets/styles/readerSettings.module.css";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";

import { Button, Group, Tooltip, TooltipTrigger } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

export const ReadingDisplaySize = () => {
  const [currentSize, setCurrentSize] = React.useState<number | null>(null);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  
  const { 
    incrementSize, 
    decrementSize,
    getCurrentSize,
    getSizeRange 
  } = useEpubNavigator();

  const updateSize = () => {
    const size = getCurrentSize();
    size && setCurrentSize(size);
  };

  React.useEffect(() => {
    updateSize();
  }, []);

  return (
    <Group 
      className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.tmpDisabling) }
      aria-labelledby="displaySizeTitle" 
    >
      <div 
        className={ settingsStyles.readerSettingsGroupTitle }
        id="displaySizeTitle"
      >
        { isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.text.title }
      </div>

      <div className={ settingsStyles.readerSettingsGroupWrapper }>
        <TooltipTrigger
          { ...(RSPrefs.theming.icon.tooltipDelay 
            ? { 
              delay: RSPrefs.theming.icon.tooltipDelay,
              closeDelay: RSPrefs.theming.icon.tooltipDelay
            } 
            : {}
          )}
        >
          <Button 
            className={ readerSharedUI.icon }
            aria-label={ isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.text.decrease }
            onPress={ async() => {
              await decrementSize();
              updateSize();
            } }
          //  isDisabled={ getSizeRange() !== null && currentSize === getSizeRange()?.[0] }
          isDisabled={ true }
          >
            <Decrease aria-hidden="true" focusable="false" />
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement={ "bottom" } 
            offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
          >
            { isFXL ? Locale.reader.settings.zoom.decreaseTooltip : Locale.reader.settings.text.decreaseTooltip }
          </Tooltip>
        </TooltipTrigger>

        <span className={ settingsStyles.readerSettingsGroupValue }>
          { `${Math.round((currentSize ?? 1) * 100)}%` }
        </span>

        <TooltipTrigger
          { ...(RSPrefs.theming.icon.tooltipDelay 
            ? { 
              delay: RSPrefs.theming.icon.tooltipDelay,
              closeDelay: RSPrefs.theming.icon.tooltipDelay
            } 
            : {}
          )}
        >
          <Button 
            className={ readerSharedUI.icon }
            aria-label={ isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.text.increase }
            onPress={ async () => {
              await incrementSize();
              updateSize();
            } }
            // isDisabled={ getSizeRange() !== null && currentSize === getSizeRange()?.[1] }
            isDisabled={ true }
          >
            <Increase aria-hidden="true" focusable="false" />
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement={ "bottom" } 
            offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
          >
            { isFXL ? Locale.reader.settings.zoom.increaseTooltip : Locale.reader.settings.text.increaseTooltip }
          </Tooltip>
        </TooltipTrigger>
      </div>
    </Group>
  );
};
