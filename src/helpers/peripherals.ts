// Peripherals based on XBReader

import { useAppStore } from "@/lib/hooks";
import { isInteractiveElement } from "./isInteractiveElement";
import { ActionKeys, RSPrefs } from "@/preferences";

export interface PCallbacks {
  moveTo: (direction: "left" | "right" | "up" | "down" | "home" | "end") => void;
  goProgression: (shiftKey?: boolean) => void;
  toggleFullscreen: () => void;
}

interface PShortcut {
  [key: string]: string[] | boolean;
  keys: string[];
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  platformKey: boolean;
  shiftKey: boolean;
}

interface PShortcuts {
  [key: string]: PShortcut;
}

export default class Peripherals {
  private readonly observers = ["keydown"];
  private targets: EventTarget[] = [];
  private readonly callbacks: PCallbacks;
  private readonly store = useAppStore();
  private readonly shortcuts: PShortcuts;

  constructor(callbacks: PCallbacks) {
    this.observers.forEach((method) => {
      (this as any)["on" + method] = (this as any)["on" + method].bind(this);
    });
    this.callbacks = callbacks;
    this.shortcuts = this.retrieveShortcuts();
  }

  private getPlatformModifier() {
    return this.store.getState().reader.platformModifier.modifier;
  }

  private retrieveShortcuts() {
    const shortcutsObj: PShortcuts = {};

    for (const actionKey in ActionKeys) {
      let shortcutObj: PShortcut = {
        keys: [],
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        platformKey: false,
        shiftKey: false
      }

      const shortcutString = RSPrefs.actions[actionKey as keyof typeof ActionKeys].shortcut;
      const shortcutArray = shortcutString.split(/\s*?[+-]\s*?/);

      shortcutArray.filter((val) => {
        if (val.includes("{{") && val.includes("}}")) {
          const specialKey = val.substring(2, val.length - 2).trim();
          shortcutObj[specialKey] = true;
        } else {
          shortcutObj.keys.push(val.trim());
        }
      });

      Object.defineProperty(shortcutsObj, actionKey, {
        value: shortcutObj,
        writable: false,
        enumerable: true
      });
    }

    return shortcutsObj;
  }

  destroy() {
    this.targets.forEach((t) => this.unobserve(t));
  }

  unobserve(item: EventTarget) {
    if (!item) return;
    this.observers.forEach((EventName) => {
      item.removeEventListener(
        EventName,
        (this as any)["on" + EventName],
        false
      );
    });
    this.targets = this.targets.filter((t) => t !== item);
  }

  observe(item: EventTarget) {
    if (!item) return;
    if (this.targets.includes(item)) return;
    this.observers.forEach((EventName) => {
      item.addEventListener(EventName, (this as any)["on" + EventName], false);
    });
    this.targets.push(item);
  }

  onkeydown(e: KeyboardEvent) {
    if (!isInteractiveElement(document.activeElement)) {
      switch(e.code) {
        case "Space":
          this.callbacks.goProgression(e.shiftKey);
          break;
        case "ArrowRight":
          this.callbacks.moveTo("right");
          break;
        case "ArrowLeft":
          this.callbacks.moveTo("left");
          break;
        case "ArrowUp":
        case "PageUp":
          this.callbacks.moveTo("up");
          break;
        case "ArrowDown":
        case "PageDown":
          this.callbacks.moveTo("down");
          break;
        case "Home":
          this.callbacks.moveTo("home");
          break;
        case "End":
          this.callbacks.moveTo("end");
          break;
        case "F11":
          if (e[this.getPlatformModifier()]) this.callbacks.toggleFullscreen();
          break;
        default:
          break;
      } 
    }
  }
}