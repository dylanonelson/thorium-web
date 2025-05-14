"use client";

import { Breakpoints } from "@/packages/Hooks/useBreakpoints";
import { ShortcutMetaKeywords, ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { SheetHeaderVariant } from "../models/sheets";
import { ReadingDisplayLineHeightOptions } from "../models/layout";
import { TextSettingsKeys } from "../models/settings";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { 
  ActionKeys, 
  DockingTypes, 
  DockingKeys, 
  ScrollBackTo, 
  SettingsKeys, 
  SheetTypes, 
  ThemeKeys, 
  ThPreferences, 
  ThLayoutDirection,
  ThLayoutStrategy
} from "./preferences";

import dayMode from "@readium/css/css/vars/day.json";
import sepiaMode from "@readium/css/css/vars/sepia.json";
import nightMode from "@readium/css/css/vars/night.json";

export const defaultPreferences: ThPreferences = {
  direction: ThLayoutDirection.ltr,
  locale: "en",
  typography: {
    minimalLineLength: 45, // undefined | null | number of characters. If 2 cols will switch to 1 based on this
    optimalLineLength: 65, // number of characters. If auto layout, picks colCount based on this
    maximalLineLength: 75, // undefined | null | number of characters.
    pageGutter: 20, // body padding in px
    layoutStrategy: ThLayoutStrategy.lineLength
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
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
    },
    layout: {
      radius: 5, // border-radius of containers
      spacing: 20, // padding of containers/sheets
      defaults: {
        dockingWidth: 340, // default width of resizable panels
        scrim: "rgba(0, 0, 0, 0.2)" // default scrim/underlay bg-color
      },
      constraints: {
        [SheetTypes.bottomSheet]: 600, // Max-width of all bottom sheets
        [SheetTypes.popover]: 600 // Max-width of all popover sheets
      }
    },
    breakpoints: {
      // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
      [Breakpoints.compact]: 600, // Phone in portrait
      [Breakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
      [Breakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
      [Breakpoints.large]: 1600, // Desktop
      [Breakpoints.xLarge]: null // Desktop Ultra-wide
    },
    themes: {
      reflowOrder: [
        ThemeKeys.auto, 
        ThemeKeys.light, 
        ThemeKeys.sepia, 
        ThemeKeys.paper, 
        ThemeKeys.dark, 
        ThemeKeys.contrast1, 
        ThemeKeys.contrast2, 
        ThemeKeys.contrast3
      ],
      fxlOrder: [
        ThemeKeys.auto,
        ThemeKeys.light,
        ThemeKeys.dark
      ],
      keys: {
        [ThemeKeys.light]: {
          background: dayMode.RS__backgroundColor, // Color of background
          text: dayMode.RS__textColor,    // Color of text
          link: "#0000ee",                // Color of links
          visited: "#551a8b",             // Color of visited links
          subdue: "#808080",              // Color of subdued elements
          disable: "#808080",             // color for :disabled
          hover: "#d9d9d9",               // color of background for :hover
          onHover: dayMode.RS__textColor, // color of text for :hover
          select: "#b4d8fe",              // color of selected background
          onSelect: "inherit",            // color of selected text
          focus: "#0067f4",               // color of :focus-visible
          elevate: "0px 0px 2px #808080", // drop shadow of containers
          immerse: "0.6"                  // opacity of immersive mode
        },
        [ThemeKeys.sepia]: {
          background: sepiaMode.RS__backgroundColor,
          text: sepiaMode.RS__textColor,
          link: sepiaMode.RS__linkColor,
          visited: sepiaMode.RS__visitedColor,
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#edd7ab",
          onHover: sepiaMode.RS__textColor,
          select: sepiaMode.RS__selectionBackgroundColor,
          onSelect: sepiaMode.RS__selectionTextColor,
          focus: "#0067f4",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.5"
        },
        [ThemeKeys.dark]: {
          background: nightMode.RS__backgroundColor,
          text: nightMode.RS__textColor,
          link: nightMode.RS__linkColor,
          visited: nightMode.RS__visitedColor,
          subdue: "#808080",
          disable: "#808080",
          hover: "#404040",
          onHover: nightMode.RS__textColor,
          select: nightMode.RS__selectionBackgroundColor,
          onSelect: nightMode.RS__selectionTextColor,
          focus: "#0067f4",
          elevate: "0px 0px 2px #808080",
          immerse: "0.4"
        },
        [ThemeKeys.paper]: {
          background: "#e9ddc8",
          text: "#000000",
          link: sepiaMode.RS__linkColor,
          visited: sepiaMode.RS__visitedColor,
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#ccb07f",
          onHover: sepiaMode.RS__textColor,
          select: sepiaMode.RS__selectionBackgroundColor,
          onSelect: sepiaMode.RS__selectionTextColor,
          focus: "#004099",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.45"
        },
        [ThemeKeys.contrast1]: {
          background: "#000000",
          text: "#ffff00",
          link: nightMode.RS__linkColor,
          visited: nightMode.RS__visitedColor,
          subdue: "#808000",
          disable: "#808000",
          hover: "#404040",
          onHover: nightMode.RS__textColor,
          select: nightMode.RS__selectionBackgroundColor,
          onSelect: nightMode.RS__selectionTextColor,
          focus: "#0067f4",
          elevate: "0px 0px 2px #808000",
          immerse: "0.4"
        },
        [ThemeKeys.contrast2]: {
          background: "#181842",
          text: "#ffffff",
          link: "#adcfff",
          visited: "#7ab2ff",
          subdue: "#808080",
          disable: "#808080",
          hover: "#4444bb",
          onHover: nightMode.RS__textColor,
          select: nightMode.RS__selectionBackgroundColor,
          onSelect: nightMode.RS__selectionTextColor,
          focus: "#6BA9FF",
          elevate: "0px 0px 2px #808080",
          immerse: "0.4"
        },
        [ThemeKeys.contrast3]: {
          background: "#c5e7cd",
          text: "#000000",
          link: sepiaMode.RS__linkColor,
          visited: sepiaMode.RS__visitedColor,
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#6fc383",
          onHover: sepiaMode.RS__textColor,
          select: sepiaMode.RS__selectionBackgroundColor,
          onSelect: sepiaMode.RS__selectionTextColor,
          focus: "#004099",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.45"
        }
      }
    }
  },
  shortcuts: {
    representation: ShortcutRepresentation.symbol,
    joiner: "+"
  },
  actions: {
    displayOrder: [
      ActionKeys.settings,
      ActionKeys.toc,
      ActionKeys.fullscreen,
      ActionKeys.layoutStrategy
    //  ActionKeys.jumpToPosition
    ],
    collapse: {
      // Number of partially icons to display
      // value "all" a keyword for the length of displayOrder above
      // Icons with visibility always are excluded from collapsing
      [Breakpoints.compact]: 2,
      [Breakpoints.medium]: 3
    }, 
    keys: {
      [ActionKeys.settings]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+P`,
        sheet: {
          defaultSheet: SheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: SheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: DockingTypes.none,
          width: 340
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      },
      [ActionKeys.fullscreen]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null
      },
      [ActionKeys.toc]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+T`,
        sheet: {
          defaultSheet: SheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: SheetTypes.fullscreen,
            [Breakpoints.medium]: SheetTypes.fullscreen
          }
        },
        docked: {
          dockable: DockingTypes.both,
          dragIndicator: false,
          width: 360,
          minWidth: 320,
          maxWidth: 450
        }
      },
      [ActionKeys.layoutStrategy]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null,
        sheet: {
          defaultSheet: SheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: SheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: DockingTypes.none
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      },
      [ActionKeys.jumpToPosition]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+J`,
        docked: {
          dockable: DockingTypes.none
        }
      }
    }
  },
  docking: {
    displayOrder: [
      DockingKeys.transient,
      DockingKeys.start,
      DockingKeys.end
    ],
    dock: {
      [Breakpoints.compact]: DockingTypes.none,
      [Breakpoints.medium]: DockingTypes.none,
      [Breakpoints.expanded]: DockingTypes.start,
      [Breakpoints.large]: DockingTypes.both,
      [Breakpoints.xLarge]: DockingTypes.both
    },
    collapse: true,
    keys: {
      [DockingKeys.start]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      },
      [DockingKeys.end]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      },
      [DockingKeys.transient]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      }
    }
  },
  settings: {
    reflowOrder: [
      SettingsKeys.zoom,
      SettingsKeys.text,
      SettingsKeys.theme,
      SettingsKeys.spacing,
      SettingsKeys.layout,
      SettingsKeys.columns
    ],
    fxlOrder: [
      SettingsKeys.theme,
      SettingsKeys.columns
    ],
    text: {
      header: SheetHeaderVariant.previous,
      subPanel: [
        TextSettingsKeys.fontFamily,
        TextSettingsKeys.fontWeight,
        TextSettingsKeys.align,
        TextSettingsKeys.hyphens,
        TextSettingsKeys.normalizeText
      ]
    },
    spacing: {
      header: SheetHeaderVariant.previous,
      lineHeight: {
        [ReadingDisplayLineHeightOptions.small]: 1.3,
        [ReadingDisplayLineHeightOptions.medium]: 1.5,
        [ReadingDisplayLineHeightOptions.large]: 1.75
      }
    }
  }
}