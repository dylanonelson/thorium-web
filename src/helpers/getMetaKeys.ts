import { isMacish } from "./getPlatform";

export interface IPlatformModifier {
  [key: string]: string;
  longform: string;
  shortform: string;
  modifier: "altKey" | "ctrlKey" | "metaKey" | "shiftKey";
  icon: "⌥" | "^" | "⌘" | "⊞" | "⇧";
}

export interface IMetaKeys {
  [key: string]: IPlatformModifier;
  alt: IPlatformModifier;
  ctrl: IPlatformModifier;
  meta: IPlatformModifier;
  shift: IPlatformModifier;
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

const altModifier: IPlatformModifier = {
  longform: "Alt",
  shortform: "Alt",
  modifier: "altKey",
  icon: "⌥"
}

const ctrlModifier: IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  icon: "^"
}

const metaModifierMac: IPlatformModifier = {
  longform: "Command",
  shortform: "Cmd",
  modifier: "metaKey",
  icon: "⌘"   
}

const metaModifierWin: IPlatformModifier = {
  longform: "Windows",
  shortform: "Win",
  modifier: "metaKey",
  icon: "⊞"
}

const shiftModifier: IPlatformModifier = {
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