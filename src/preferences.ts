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
  day = "day",
  sepia = "sepia",
  night = "night",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3",
  contrast4 = "contrast4"
}

export const RSPrefs = {
  breakpoints: {
    // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
    [StaticBreakpoints.compact]: 600, // Phone in portrait
    [StaticBreakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
    [StaticBreakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
    [StaticBreakpoints.large]: 1600, // Desktop
    [StaticBreakpoints.xLarge]: null // Desktop Ultra-wide
  },
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
    color: {
    //  primary: "#4d4d4d",
    //  secondary: "white",
      disabled: "#767676",
      subdued: "#999999",
      hover: "#eaeaea",
      selected: "#eaeaea"
    },
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
    },
    themes: {
      displayOrder: [
        Themes.auto, 
        Themes.day, 
        Themes.sepia, 
        Themes.paper, 
        Themes.night, 
        Themes.contrast1, 
        Themes.contrast2, 
        Themes.contrast3, 
        Themes.contrast4
      ],
      [Themes.day]: {
        backgroundColor: dayMode.RS__backgroundColor,
        color: dayMode.RS__textColor
      },
      [Themes.sepia]: {
        backgroundColor: sepiaMode.RS__backgroundColor,
        color: sepiaMode.RS__textColor
      },
      [Themes.night]: {
        backgroundColor: nightMode.RS__backgroundColor,
        color: nightMode.RS__textColor
      },
      [Themes.paper]: {
        backgroundColor: "#e9ddc8",
        color: "#000000"
      },
      [Themes.contrast1]: {
        backgroundColor: "#000000",
        color: "#ffffff"
      },
      [Themes.contrast2]: {
        backgroundColor: "#000000",
        color: "#ffff00"
      },
      [Themes.contrast3]: {
        backgroundColor: "#181842",
        color: "#ffffff"
      },
      [Themes.contrast4]: {
        backgroundColor: "#c5e7cd",
        color: "#000000"
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