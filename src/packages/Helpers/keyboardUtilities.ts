import { isMacish } from "./getPlatform";

export interface IKey {
  [key: string]: string;
  longform: string;
  shortform: string;
}

export interface IMetaKey extends IKey {
  modifier: "altKey" | "ctrlKey" | "metaKey" | "shiftKey";
  symbol: "⌥" | "^" | "⌘" | "⊞" | "⇧";
}

export interface IPlatformModifier extends IKey {
  modifier: "ctrlKey" | "metaKey";
  symbol: "^" | "⌘";
}

export interface IMetaKeys {
  [key: string]: IMetaKey;
  altKey: IMetaKey;
  ctrlKey: IMetaKey;
  metaKey: IMetaKey;
  shiftKey: IMetaKey;
}

export enum ShortcutMetaKeywords {
  alt = "altKey",
  ctrl = "ctrlKey",
  meta = "metaKey",
  platform = "platformKey",
  shift = "shiftKey"
}

export enum ShortcutRepresentation {
  symbol = "symbol",
  short = "shortform",
  long = "longform"
};

export interface IShortcut {
  className?: string;
  rawForm: string;
  representation?: ShortcutRepresentation; 
  joiner?: string;
}

export interface PShortcut {
  key?: string;
  char?: string;
  modifiers: {
    [key: string]: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    platformKey: boolean;
    shiftKey: boolean;
  }
}

const altModifier: IMetaKey = {
  longform: "Option",
  shortform: "Alt",
  modifier: "altKey",
  symbol: "⌥"
}

const ctrlModifier: IMetaKey & IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  symbol: "^"
}

const metaModifierMac: IMetaKey & IPlatformModifier = {
  longform: "Command",
  shortform: "Cmd",
  modifier: "metaKey",
  symbol: "⌘"   
}

const metaModifierWin: IMetaKey = {
  longform: "Windows",
  shortform: "Win",
  modifier: "metaKey",
  symbol: "⊞"
}

const shiftModifier: IMetaKey = {
  longform: "Shift",
  shortform: "Shift",
  modifier: "shiftKey",
  symbol: "⇧"
}

export const metaKeys: IMetaKeys = {
  altKey: altModifier,
  ctrlKey: ctrlModifier,
  metaKey: isMacish() ? metaModifierMac : metaModifierWin,
  shiftKey: shiftModifier
}

// Platform modifier differs from Mac to Windows so we have to get it dynamically

export const defaultPlatformModifier = ctrlModifier;

export const getPlatformModifier = (): IPlatformModifier => {
  if (isMacish()) {
    return metaModifierMac;
  } else {
    return ctrlModifier;
  }
}

export const buildShortcut = (str: string) => {
  let shortcutObj: PShortcut = {
    key: "",
    char: "",
    modifiers: {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      platformKey: false,
      shiftKey: false
    }
  }
  
  const shortcutArray = str.split(/\s*?[+-]\s*?/);

  shortcutArray.filter((val) => {
    if ((Object.values(ShortcutMetaKeywords) as string[]).includes(val)) {
      const trimmedKey = val.trim();
      shortcutObj.modifiers[trimmedKey] = true;
    } else {
      shortcutObj.char = val.trim().toUpperCase();
      shortcutObj.key = `Key${ val.trim().toUpperCase() }`;
    }
  });

  return shortcutObj.key ? shortcutObj : null;
}