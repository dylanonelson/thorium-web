import React, { useContext } from "react";

import { PreferencesContext } from "@/preferences";

import { IShortcut, ShortcutRepresentation, buildShortcut, metaKeys } from "@/packages/Helpers/keyboardUtilities";

import { Keyboard } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";

export const Shortcut: React.FC<IShortcut> = ({
  className,
  rawForm,
  representation,
  joiner
}) => {
  const RSPrefs = useContext(PreferencesContext);
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

  representation = representation ? representation : RSPrefs.shortcuts.representation || ShortcutRepresentation.symbol;
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
          shortcutRepresentation.push(metaKey[representation as ShortcutRepresentation]);
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
