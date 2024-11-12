import React from "react";

import { RSPrefs } from "../preferences";
import Locale from "../resources/locales/en.json";

import TargetIcon from "./assets/icons/target-icon.svg";

import { OverflowMenuItem } from "./templateComponents/OverflowMenuItem";

import { useAppSelector } from "@/lib/hooks";
import parseTemplate from "json-templates";

export const JumpToPositionAction = () => {
  const jsonTemplate = parseTemplate(RSPrefs.shortcuts.jumpToPosition);
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

  return(
    <>
    <OverflowMenuItem
      SVG={ TargetIcon } 
      label={ Locale.reader.jumpToPosition.label }
      shortcut={ jsonTemplate({ PlatformKey: platformModifier.icon }) } 
      onActionCallback={ () => {} }
    />
    </>
  )
}