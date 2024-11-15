import { ShortcutMetaKeysTemplates } from "./getMetaKeys";

export interface PShortcut {
  [key: string]: string | boolean | undefined;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  platformKey?: boolean;
  shiftKey?: boolean;
  key?: string;
}

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