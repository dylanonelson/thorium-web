import { StaticBreakpoints } from "./hooks/useBreakpoints";
import { ScrollAffordancePref, ScrollBackTo } from "./helpers/scrollAffordance";
import { ActionKeys, ActionVisibility } from "./components/Templates/ActionComponent";
import { ShortcutRepresentation } from "./components/Shortcut";
import { ShortcutMetaKeywords } from "./helpers/keyboard/getMetaKeys";

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
      primary: "#4d4d4d",
      secondary: "white",
      disabled: "#767676",
      subdued: "#999999",
      hover: "#eaeaea",
      selected: "#eaeaea"
    },
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
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
      ActionKeys.toc,
      ActionKeys.jumpToPosition
    ],
    [ActionKeys.settings]: {
      visibility: ActionVisibility.partially,
      shortcut: `${ShortcutMetaKeywords.platform}+P`
    },
    [ActionKeys.fullscreen]: {
      visibility: ActionVisibility.partially,
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