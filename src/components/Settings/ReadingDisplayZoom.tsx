import React from "react";

import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../assets/styles/readerSettings.module.css";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

import { Button, Group, Input, Label, NumberField } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayZoom = () => {
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  
  const { 
    applyZoom, 
    getSizeStep, 
    getSizeRange 
  } = useEpubNavigator();

  return (
    <NumberField 
      className={ settingsStyles.readerSettingsGroup }
      defaultValue={ 1 }
      value={ fontSize }
      minValue={ getSizeRange()?.[0] }
      maxValue={ getSizeRange()?.[1] }
      step={ getSizeStep() || 0.1 }
      formatOptions={{ style: "percent" }} 
      onChange={ async(value) => await applyZoom(value) }
      decrementAriaLabel={ isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.fontSize.decrease }
      incrementAriaLabel={ isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.fontSize.increase }
      isWheelDisabled={ true }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>
        { isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
      </Label>

      <Group className={ settingsStyles.readerSettingsGroupWrapper }>
        <Button 
          slot="decrement" 
          className={ readerSharedUI.icon }
        >
          { isFXL 
            ? <ZoomOut aria-hidden="true" focusable="false" /> 
            : <Decrease aria-hidden="true" focusable="false" /> 
          }
        </Button>

        <Input className={ settingsStyles.readerSettingsInput } inputMode="none" />

        <Button 
          slot="increment" 
          className={ readerSharedUI.icon }
        >
          { isFXL 
            ? <ZoomIn aria-hidden="true" focusable="false" /> 
            : <Increase aria-hidden="true" focusable="false" />
          }
        </Button>
      </Group>
    </NumberField>
  );
};