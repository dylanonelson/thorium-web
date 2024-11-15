import React, { PropsWithChildren } from "react";

import { useAppStore } from "@/lib/hooks";
import { buildShortcut } from "@/helpers/keyboard/buildShortcut";
import { metaKeys } from "@/helpers/keyboard/getMetaKeys";
import { Keyboard } from "react-aria-components";

export type ShortcutRepresentation = "icon" | "shortform" | "longform";

export interface IShortcut {
  className?: string;
  rawForm: string;
  representation?: ShortcutRepresentation; 
  joinChar?: string;
}

export const Shortcut: React.FC<IShortcut> = ({
  className,
  rawForm,
  representation = "icon",
  joinChar = "+"
}) => {
  const store = useAppStore();
  const platformModifier = store.getState().reader.platformModifier;

  const shortcutObj = buildShortcut(rawForm);

  if (shortcutObj) {
    let shortcutRepresentation = [];

    for (const prop in shortcutObj) {
      if (prop !== "key" && prop !== "platformKey") {
        const metaKey = metaKeys[prop];
        shortcutRepresentation.push(metaKey[representation]);
      } else if (prop === "platformKey") {
        shortcutRepresentation.push(platformModifier[representation]);
      } else {
        shortcutRepresentation.push(shortcutObj[prop]);
      }
    }

    if (shortcutRepresentation.length > 0) {
      const displayShortcut = shortcutRepresentation.join(joinChar);
      
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