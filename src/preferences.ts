import { StaticBreakpoints } from "./hooks/useBreakpoints";
import { ScrollAffordancePref, ScrollBackTo } from "./helpers/scrollAffordance";
import { ActionKeys, ActionVisibility } from "./components/Templates/ActionComponent";
import { ShortcutRepresentation } from "./components/Shortcut";
import { ShortcutMetaKeywords } from "./helpers/keyboard/getMetaKeys";

import dayMode from "readium-css/css/vars/day.json";
import sepiaMode from "readium-css/css/vars/sepia.json";
import nightMode from "readium-css/css/vars/night.json";

export enum Themes {
  auto = "auto",
  light = "light",
  sepia = "sepia",
  dark = "dark",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3",
  contrast4 = "contrast4"
}

export const RSPrefs = {
  typography: {
    minimalLineLength: 35, // undefined | null | number of characters. If 2 cols will switch to 1 based on this
    optimalLineLength: 75, // number of characters. If auto layout, picks colCount based on this
    pageGutter: 20 // body padding in px
    // In the future we could have useDynamicBreakpoint: boolean so that devs can disable it and use breakpoints instead
  },
  scroll: {
    topAffordance: ScrollAffordancePref.none,
    bottomAffordance: ScrollAffordancePref.both,
    backTo: ScrollBackTo.top
  },
  theming: {
    arrow: {
      size: 40, // Size of the left and right arrows in px
      offset: 5 // offset of the arrows from the edges in px
    },
    // TMP for states
    semantic: {
      disabled: "color-mix(in srgb, var(--color-text) 50%, transparent)",
      subdued: "color-mix(in srgb, var(--color-text) 45%, transparent)",
      hover: "color-mix(in srgb, var(--color-text) 15%, transparent)",
      selected: "color-mix(in srgb, var(--color-text) 20%, transparent)",
      dropShadow: "0px 0px 2px var(--color-text)"
    },
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
    },
    breakpoints: {
      // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
      [StaticBreakpoints.compact]: 600, // Phone in portrait
      [StaticBreakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
      [StaticBreakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
      [StaticBreakpoints.large]: 1600, // Desktop
      [StaticBreakpoints.xLarge]: null // Desktop Ultra-wide
    },
    themes: {
      reflowOrder: [
        Themes.auto, 
        Themes.light, 
        Themes.sepia, 
        Themes.paper, 
        Themes.dark, 
        Themes.contrast1, 
        Themes.contrast2, 
        Themes.contrast3, 
        Themes.contrast4
      ],
      fxlOrder: [
        Themes.auto,
        Themes.light,
        Themes.paper,
        Themes.dark,
      ],
      [Themes.light]: {
        background: dayMode.RS__backgroundColor,
        text: dayMode.RS__textColor,
        // TODO
        // primary: "",
        // secondary: ""
      },
      [Themes.sepia]: {
        background: sepiaMode.RS__backgroundColor,
        text: sepiaMode.RS__textColor
      },
      [Themes.dark]: {
        background: nightMode.RS__backgroundColor,
        text: nightMode.RS__textColor
      },
      [Themes.paper]: {
        background: "#e9ddc8",
        text: "#000000"
      },
      [Themes.contrast1]: {
        background: "#000000",
        text: "#ffffff"
      },
      [Themes.contrast2]: {
        background: "#000000",
        text: "#ffff00"
      },
      [Themes.contrast3]: {
        background: "#181842",
        text: "#ffffff"
      },
      [Themes.contrast4]: {
        background: "#c5e7cd",
        text: "#000000"
      }
    }
  },
  shortcuts: {
    representation: ShortcutRepresentation.symbol,
    joiner: " + "
  },
  actions: {
    displayOrder: [
      ActionKeys.settings,
      ActionKeys.fullscreen,
    //  ActionKeys.toc,
    //  ActionKeys.jumpToPosition
    ],
    [ActionKeys.settings]: {
      visibility: ActionVisibility.always,
      shortcut: `${ShortcutMetaKeywords.platform}+P`
    },
    [ActionKeys.fullscreen]: {
      visibility: ActionVisibility.always,
      shortcut: `${ShortcutMetaKeywords.platform}+F11`
    },
    [ActionKeys.toc]: {
      visibility: ActionVisibility.partially,
      shortcut: `${ShortcutMetaKeywords.platform}+N`
    },
    [ActionKeys.jumpToPosition]: {
      visibility: ActionVisibility.overflow,
      shortcut: `${ShortcutMetaKeywords.platform}+J`
    }
  }
}