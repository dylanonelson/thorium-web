"use client";

import React from "react";

import { UnstableShortcut, UnstableShortcutRepresentation, buildShortcut, metaKeys } from "@/core/Helpers/keyboardUtilities";

import { Keyboard } from "react-aria-components";

import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppSelector } from "@/lib/hooks";

export const UnstableStatefulShortcut = ({
  className,
  rawForm,
  representation,
  joiner
}: UnstableShortcut) => {
  const RSPrefs = usePreferences();
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

  representation = representation ? representation : RSPrefs.shortcuts.representation || UnstableShortcutRepresentation.symbol;
  joiner = joiner ? joiner : RSPrefs.shortcuts.joiner || " + ";

  const shortcutObj = buildShortcut(rawForm);

  if (shortcutObj) {
    let shortcutRepresentation = [];

    for (const prop in shortcutObj.modifiers) {
      if (shortcutObj.modifiers[prop]) {
        if (prop === "platformKey") {
          shortcutRepresentation.push(platformModifier[representation]);
        } else {
          const metaKey = metaKeys[prop];
          shortcutRepresentation.push(metaKey[representation as UnstableShortcutRepresentation]);
        }
      }
    }

    if (shortcutObj.char) {
      shortcutRepresentation.push(shortcutObj.char);
    }

    if (shortcutRepresentation.length > 0) {
      const displayShortcut = shortcutRepresentation.join(joiner);
      
      return (
        <Keyboard className={ className }>{ displayShortcut }</Keyboard>
      ) 
    } else {
      return (
        <></>
      )
    }
  }

  return (
    <></>
  );
}
