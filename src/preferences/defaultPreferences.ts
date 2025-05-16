"use client";

import { Breakpoints } from "@/packages/Hooks/useBreakpoints";
import { ShortcutMetaKeywords, ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { 
  ThActionsKeys, 
  ThDockingTypes, 
  ThDockingKeys, 
  ThScrollBackTo, 
  ThSettingsKeys, 
  ThSheetTypes, 
  ThThemeKeys,  
  ThLayoutDirection,
  ThLayoutStrategy,
  ThLineHeightOptions,
  ThTextSettingsKeys,
  ThSheetHeaderVariant
} from "./models/enums";
import { createPreferences, ThPreferences } from "./preferences";

import dayMode from "@readium/css/css/vars/day.json";
import sepiaMode from "@readium/css/css/vars/sepia.json";
import nightMode from "@readium/css/css/vars/night.json";

const enum CustomActionKeys {
  fullscreen = "fullscreen",
  // jumpToPosition = "jumpToPosition",
  layoutStrategy = "layoutStrategy",
  settings = "settings",
  toc = "toc"
}

export const defaultPreferences: ThPreferences = createPreferences({
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
    backTo: ThScrollBackTo.top
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
        [ThSheetTypes.bottomSheet]: 600, // Max-width of all bottom sheets
        [ThSheetTypes.popover]: 600 // Max-width of all popover sheets
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
        ThThemeKeys.auto, 
        ThThemeKeys.light, 
        ThThemeKeys.sepia, 
        ThThemeKeys.paper, 
        ThThemeKeys.dark, 
        ThThemeKeys.contrast1, 
        ThThemeKeys.contrast2, 
        ThThemeKeys.contrast3
      ],
      fxlOrder: [
        ThThemeKeys.auto,
        ThThemeKeys.light,
        ThThemeKeys.dark
      ],
      keys: {
        [ThThemeKeys.light]: {
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
        [ThThemeKeys.sepia]: {
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
        [ThThemeKeys.dark]: {
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
        [ThThemeKeys.paper]: {
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
        [ThThemeKeys.contrast1]: {
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
        [ThThemeKeys.contrast2]: {
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
        [ThThemeKeys.contrast3]: {
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
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.layoutStrategy,
    //  ThActionsKeys.jumpToPosition
    ],
    collapse: {
      // Number of partially icons to display
      // value "all" a keyword for the length of displayOrder above
      // Icons with visibility always are excluded from collapsing
      [Breakpoints.compact]: 2,
      [Breakpoints.medium]: 3
    }, 
    keys: {
      [ThActionsKeys.settings]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+P`,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: ThSheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: ThDockingTypes.none,
          width: 340
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      },
      [ThActionsKeys.fullscreen]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null
      },
      [ThActionsKeys.toc]: {
        visibility: CollapsibilityVisibility.partially,
        shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+T`,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: ThSheetTypes.fullscreen,
            [Breakpoints.medium]: ThSheetTypes.fullscreen
          }
        },
        docked: {
          dockable: ThDockingTypes.both,
          dragIndicator: false,
          width: 360,
          minWidth: 320,
          maxWidth: 450
        }
      },
      [ThActionsKeys.layoutStrategy]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [Breakpoints.compact]: ThSheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: ThDockingTypes.none
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      },
      // [ThActionsKeys.jumpToPosition]: {
      //  visibility: CollapsibilityVisibility.overflow,
      //  shortcut: null, // `${ ShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+J`,
      //  docked: {
      //    dockable: ThDockingTypes.none
      //  }
      //}
    }
  },
  docking: {
    displayOrder: [
      ThDockingKeys.transient,
      ThDockingKeys.start,
      ThDockingKeys.end
    ],
    dock: {
      [Breakpoints.compact]: ThDockingTypes.none,
      [Breakpoints.medium]: ThDockingTypes.none,
      [Breakpoints.expanded]: ThDockingTypes.start,
      [Breakpoints.large]: ThDockingTypes.both,
      [Breakpoints.xLarge]: ThDockingTypes.both
    },
    collapse: true,
    keys: {
      [ThDockingKeys.start]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      },
      [ThDockingKeys.end]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      },
      [ThDockingKeys.transient]: {
        visibility: CollapsibilityVisibility.overflow,
        shortcut: null
      }
    }
  },
  settings: {
    reflowOrder: [
      ThSettingsKeys.zoom,
      ThSettingsKeys.textGroup,
      ThSettingsKeys.theme,
      ThSettingsKeys.spacingGroup,
      ThSettingsKeys.layout,
      ThSettingsKeys.columns
    ],
    fxlOrder: [
      ThSettingsKeys.theme,
      ThSettingsKeys.columns
    ],
    keys: {
      [ThSettingsKeys.lineHeight]: {
        [ThLineHeightOptions.small]: 1.3,
        [ThLineHeightOptions.medium]: 1.5,
        [ThLineHeightOptions.large]: 1.75
      },
      [ThSettingsKeys.zoom]: {
        range: [0.7, 2.5],
        step: 0.05
      }
    },
    text: {
      header: ThSheetHeaderVariant.previous,
      subPanel: [
        ThTextSettingsKeys.fontFamily,
        ThTextSettingsKeys.fontWeight,
        ThTextSettingsKeys.textAlign,
        ThTextSettingsKeys.hyphens,
        ThTextSettingsKeys.textNormalize
      ]
    },
    spacing: {
      header: ThSheetHeaderVariant.previous,
    }
  }
})