import { isMacish } from "./getPlatform";

export interface IPlatformModifier {
  [key: string]: string;
  longform: string;
  shortform: string;
  modifier: "metaKey" | "ctrlKey";
  icon: "⌘" | "^";
}

export const defaultModifier: IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  icon: "^"
}

export const buildPlatformModifier = (): IPlatformModifier => {
  if (isMacish()) {
    return {
      longform: "Command",
      shortform: "Cmd",
      modifier: "metaKey",
      icon: "⌘"    
    }
  } else {
    return defaultModifier;
  }
}