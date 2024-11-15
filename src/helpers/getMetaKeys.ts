import { isMacish } from "./getPlatform";

interface IKey {
  [key: string]: string;
  longform: string;
  shortform: string;
}

export interface IMetaKey extends IKey {
  modifier: "altKey" | "ctrlKey" | "metaKey" | "shiftKey";
  icon: "⌥" | "^" | "⌘" | "⊞" | "⇧";
}

export interface IPlatformModifier extends IKey {
  modifier: "ctrlKey" | "metaKey";
  icon: "^" | "⌘";
}

export interface IMetaKeys {
  [key: string]: IMetaKey;
  alt: IMetaKey;
  ctrl: IMetaKey;
  meta: IMetaKey;
  shift: IMetaKey;
}

export enum ShortcutMetaKeysTemplates {
  alt = "{{altKey}}",
  ctrl = "{{ctrlKey}}",
  meta = "{{metaKey}}",
  platform = "{{platformKey}}",
  shift = "{{shiftkey}}"
}

export const handleJSONTemplating = (str: string) => {
  if ((Object.values(ShortcutMetaKeysTemplates) as string[]).includes(str)) {
    return str.substring(2, str.length - 2).trim();
  }
  return str;
}

const altModifier: IMetaKey = {
  longform: "Alt",
  shortform: "Alt",
  modifier: "altKey",
  icon: "⌥"
}

const ctrlModifier: IMetaKey & IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  icon: "^"
}

const metaModifierMac: IMetaKey & IPlatformModifier = {
  longform: "Command",
  shortform: "Cmd",
  modifier: "metaKey",
  icon: "⌘"   
}

const metaModifierWin: IMetaKey = {
  longform: "Windows",
  shortform: "Win",
  modifier: "metaKey",
  icon: "⊞"
}

const shiftModifier: IMetaKey = {
  longform: "Shift",
  shortform: "Shift",
  modifier: "shiftKey",
  icon: "⇧"
}

export const metaKeys: IMetaKeys = {
  alt: altModifier,
  ctrl: ctrlModifier,
  meta: isMacish() ? metaModifierMac : metaModifierWin,
  shift: shiftModifier
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