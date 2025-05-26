"use client";

import { ThSettingsWrapperButton } from "./ThSettingsWrapperButton";

import { Heading, HeadingProps } from "react-aria-components";
import { HTMLAttributesWithRef, WithRef } from "../../customTypes";
import { ThActionButtonProps } from "../../Buttons";

export interface ThSettingsEntry {
  Comp: React.ComponentType<any>
}

export interface ThSettingsPrefs {
  main: string[];
  subPanel?: string[] | null;
}

export interface ThSettingsWrapperProps extends HTMLAttributesWithRef<HTMLDivElement> {
  items?: Record<string, ThSettingsEntry> | null;
  prefs: ThSettingsPrefs;
  compounds?: {
    /**
     * Label for advanced settings that will be displayed as a heading
     */
    label?: string;
    /**
     * Props for the heading. See `HeadingProps` for more information.
     */
    heading?: WithRef<HeadingProps, HTMLHeadingElement>;
    /**
     * Props for the button that triggers the subpanel. See `ThActionButtonProps` for more information.
     */
    button?: ThActionButtonProps;
  }
}

// TODO: Handle Standalone and Usage as Group
export const ThSettingsWrapper = ({
  ref,
  items,
  prefs,
  compounds,
  ...props
}: ThSettingsWrapperProps) => {
  const main = prefs.main;
  const displayOrder = prefs.subPanel;
  
  const isAdvanced = items &&(
    main.length < Object.keys(items).length && 
    displayOrder && displayOrder.length > 0
  );

  if (items) {
    return(
      <>
      <div 
        ref={ ref }
        { ...props }
      >
        { isAdvanced && compounds?.label &&
          <Heading { ...compounds?.heading }>
            { compounds.label }
          </Heading> }
        { main.map((key, index) => {
          const match = items[key];
          return match && <match.Comp key={ key } standalone={ !isAdvanced || index !== 0 } { ...props } />;
        }) }
        { isAdvanced && (
          <ThSettingsWrapperButton
            { ...compounds?.button }
          />
        ) }
      </div>
      </>
    )
  }
}