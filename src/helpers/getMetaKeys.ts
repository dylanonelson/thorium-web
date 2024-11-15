import { isMacish } from "./getPlatform";

export interface IPlatformModifier {
  [key: string]: string;
  longform: string;
  shortform: string;
  modifier: "altKey" | "ctrlKey" | "metaKey" | "shiftKey";
  icon: "⌥" | "^" | "⌘" | "⊞" | "⇧";
}

export const altModifier: IPlatformModifier = {
  longform: "Alt",
  shortform: "Alt",
  modifier: "altKey",
  icon: "⌥"
}

export const ctrlModifier: IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  icon: "^"
}

export const metaModifierMac: IPlatformModifier = {
  longform: "Command",
  shortform: "Cmd",
  modifier: "metaKey",
  icon: "⌘"   
}

export const metaModifierWin: IPlatformModifier = {
  longform: "Windows",
  shortform: "Win",
  modifier: "metaKey",
  icon: "⊞"
}

export const shiftModifier: IPlatformModifier = {
  longform: "Shift",
  shortform: "Shift",
  modifier: "shiftKey",
  icon: "⇧"
}

// Platform modifier differs from Mac to Windows so we have to get it dynamically

export const defaultPlatformModifier = ctrlModifier;

export const buildPlatformModifier = (): IPlatformModifier => {
  if (isMacish()) {
    return metaModifierMac;
  } else {
    return ctrlModifier;
  }
}