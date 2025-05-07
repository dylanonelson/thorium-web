import { Key, useCallback, useRef } from "react";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayFontFamilyOptions } from "@/models/layout";
import { IAdvancedDisplayProps } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { ThDropdown } from "@/packages/Components";

import { ListBox, ListBoxItem } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFontFamily } from "@/lib/settingsReducer";

export const ReadingDisplayFontFamily: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontFamilyOptions = useRef(Object.entries(ReadingDisplayFontFamilyOptions).map(([property, stack]) => ({
      id: property,
      label: Locale.reader.settings.fontFamily.labels[property as keyof typeof Locale.reader.settings.fontFamily.labels],
      value: stack
    }))
  );
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (key: Key) => {
    if (key === fontFamily) return;

    const selectedOption = fontFamilyOptions.current.find((option) => option.id === key) as {
      id: keyof typeof ReadingDisplayFontFamilyOptions;
      label: string;
      value: string | null;
    };
    
    if (selectedOption) {
      await submitPreferences({ fontFamily: selectedOption.value });
      
      const currentSetting = getSetting("fontFamily");
      const selectedOptionId = Object.keys(ReadingDisplayFontFamilyOptions).find(key => ReadingDisplayFontFamilyOptions[key as keyof typeof ReadingDisplayFontFamilyOptions] === currentSetting) as keyof typeof ReadingDisplayFontFamilyOptions;
      dispatch(setFontFamily(selectedOptionId || ReadingDisplayFontFamilyOptions.publisher));
    }
  }, [fontFamily, submitPreferences, getSetting, dispatch]);

  return(
    <>
    <ThDropdown 
      { ...(standalone 
        ? { 
          className: settingsStyles.readerSettingsGroup,
          label: Locale.reader.settings.fontFamily.title
        } 
        : {
          "aria-label": Locale.reader.settings.fontFamily.title
        }) }
      selectedKey={ fontFamily }
      onSelectionChange={ async (key) => await updatePreference(key) }
      compounds={ {
        label: {
          className: settingsStyles.readerSettingsLabel
        },
        button: {
          className: settingsStyles.readerSettingsDropdownButton
        },
        popover: {
          className: settingsStyles.readerSettingsDropdownPopover,
          placement: "bottom"
        },
        listbox: (
          <ListBox
            className={ settingsStyles.readerSettingsDropdownListbox }
            items={ fontFamilyOptions.current }
          >
            { (item) => (
              <ListBoxItem
                className={ settingsStyles.readerSettingsDropdownListboxItem }
                id={ item.id }
                key={ item.id }
                textValue={ item.value || undefined }
                style={{ fontFamily: item.value || undefined }}
              >
                { item.label }
              </ListBoxItem>
            )}
          </ListBox>
        )
      }}
    />
    </>
  )
}