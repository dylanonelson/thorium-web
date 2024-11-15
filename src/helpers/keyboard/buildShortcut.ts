import { metaKeys, ShortcutMetaKeysTemplates } from "./getMetaKeys";
import { useAppStore } from "@/lib/hooks";

export interface PShortcut {
  [key: string]: string | boolean | undefined;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  platformKey?: boolean;
  shiftKey?: boolean;
  key?: string;
}

export type ShortcutRepresentation = "icon" | "shortform" | "longform";

export const buildShortcut = (str: string) => {
  let shortcutObj: PShortcut = {}
  
  const shortcutArray = str.split(/\s*?[+-]\s*?/);

  shortcutArray.filter((val) => {
    if ((Object.values(ShortcutMetaKeysTemplates) as string[]).includes(val)) {
      const specialKey = val.substring(2, val.length - 2).trim();
      shortcutObj[specialKey] = true;
    } else {
      shortcutObj.key = val.trim();
    }
  });

  return shortcutObj.key ? shortcutObj : null;
}

export const buildShortcutRepresentation = (rawForm: string, representation: ShortcutRepresentation = "icon", joinChar: string = "") => {
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

    if (shortcutRepresentation.length > 0) return shortcutRepresentation.join(joinChar);
  }
  return null;
}