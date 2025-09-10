"use client";

import { UnstableShortcutMetaKeywords, UnstableShortcutRepresentation } from "@/core/Helpers/keyboardUtilities";
import { ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";
import { 
  ThActionsKeys, 
  ThBreakpoints, 
  ThDockingTypes, 
  ThDockingKeys, 
  ThSettingsKeys, 
  ThSheetTypes, 
  ThThemeKeys,  
  ThLayoutDirection,
  ThLineHeightOptions,
  ThTextSettingsKeys,
  ThSheetHeaderVariant,
  ThLayoutUI,
  ThBackLinkVariant,
  ThProgressionFormat,
  ThRunningHeadFormat
} from "./models/enums";
import { createPreferences } from "./preferences";

import ReadiumCSSColors from "@readium/css/css/vars/colors.json";

export const defaultPreferences = createPreferences({
//  direction: ThLayoutDirection.ltr,
//  locale: "en",
  typography: {
    minimalLineLength: 35, // undefined | null | number of characters. If 2 cols will switch to 1 based on this
    optimalLineLength: 60, // number of characters. If auto layout, picks colCount based on this
    maximalLineLength: 70, // undefined | null | number of characters.
    pageGutter: 20
  },
  theming: {
    header: {
      backLink: {
        variant: ThBackLinkVariant.arrow,
        visibility: "partially",
        href: "/"
      },
      runningHead: {
        format: {
          reflow: ThRunningHeadFormat.title,
          fxl: ThRunningHeadFormat.title
        }
      }
    },
    progression: {
      format: {
        reflow: [
          ThProgressionFormat.positionsOfTotal, 
          ThProgressionFormat.progressionOfResource
        ],
        fxl: [
          ThProgressionFormat.positionsOfTotal, 
          ThProgressionFormat.overallProgression,
          ThProgressionFormat.none
        ]
      }
    },
    arrow: {
      size: 40, // Size of the left and right arrows in px
      offset: 5 // offset of the arrows from the edges in px
    },
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
    },
    layout: {
      ui: {
        reflow: ThLayoutUI.layered,
        fxl: ThLayoutUI.layered
      },
      radius: 5, // border-radius of containers
      spacing: 20, // padding of containers/sheets
      defaults: {
        dockingWidth: 340, // default width of resizable panels
        scrim: "rgba(0, 0, 0, 0.2)" // default scrim/underlay bg-color
      },
      constraints: {
        [ThSheetTypes.bottomSheet]: 600, // Max-width of all bottom sheets
        [ThSheetTypes.popover]: 600, // Max-width of all popover sheets
        pagination: null // Max-width of pagination component
      }
    },
    breakpoints: {
      // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
      [ThBreakpoints.compact]: 600, // Phone in portrait
      [ThBreakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
      [ThBreakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
      [ThBreakpoints.large]: 1600, // Desktop
      [ThBreakpoints.xLarge]: null // Desktop Ultra-wide
    },
    themes: {
      reflowOrder: [
        "auto", 
        ThThemeKeys.light, 
        ThThemeKeys.sepia, 
        ThThemeKeys.paper, 
        ThThemeKeys.dark, 
        ThThemeKeys.contrast1, 
        ThThemeKeys.contrast2, 
        ThThemeKeys.contrast3
      ],
      fxlOrder: [
        "auto",
        ThThemeKeys.light,
        ThThemeKeys.dark
      ],
      systemThemes: {
        light: ThThemeKeys.light,
        dark: ThThemeKeys.dark
      },
      keys: {
        [ThThemeKeys.light]: {
          background: ReadiumCSSColors.RS__backgroundColor, // Color of background
          text: ReadiumCSSColors.RS__textColor,    // Color of text
          link: "#0000ee",                // Color of links
          visited: "#551a8b",             // Color of visited links
          subdue: "#808080",              // Color of subdued elements
          disable: "#808080",             // color for :disabled
          hover: "#d9d9d9",               // color of background for :hover
          onHover: ReadiumCSSColors.RS__textColor, // color of text for :hover
          select: "#b4d8fe",              // color of selected background
          onSelect: "inherit",            // color of selected text
          focus: "#0067f4",               // color of :focus-visible
          elevate: "0px 0px 2px #808080", // drop shadow of containers
          immerse: "0.6"                  // opacity of immersive mode
        },
        [ThThemeKeys.sepia]: {
          background: "#faf4e8",
          text: "#121212",
          link: "#0000EE",
          visited: "#551A8B",
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#edd7ab",
          onHover: "#121212",
          select: "#b4d8fe",
          onSelect: "inherit",
          focus: "#0067f4",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.5"
        },
        [ThThemeKeys.dark]: {
          background: "#000000",
          text: "#FEFEFE",
          link: "#63caff",
          visited: "#0099E5",
          subdue: "#808080",
          disable: "#808080",
          hover: "#404040",
          onHover: "#FEFEFE",
          select: "#b4d8fe",
          onSelect: "inherit",
          focus: "#0067f4",
          elevate: "0px 0px 2px #808080",
          immerse: "0.4"
        },
        [ThThemeKeys.paper]: {
          background: "#e9ddc8",
          text: "#000000",
          link: "#0000EE",
          visited: "#551A8B",
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#ccb07f",
          onHover: "#000000",
          select: "#b4d8fe",
          onSelect: "inherit",
          focus: "#004099",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.45"
        },
        [ThThemeKeys.contrast1]: {
          background: "#000000",
          text: "#ffff00",
          link: "#63caff",
          visited: "#0099E5",
          subdue: "#808000",
          disable: "#808000",
          hover: "#404040",
          onHover: "#ffff00",
          select: "#b4d8fe",
          onSelect: "inherit",
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
          onHover: "#ffffff",
          select: "#b4d8fe",
          onSelect: "inherit",
          focus: "#6BA9FF",
          elevate: "0px 0px 2px #808080",
          immerse: "0.4"
        },
        [ThThemeKeys.contrast3]: {
          background: "#c5e7cd",
          text: "#000000",
          link: "#0000EE",
          visited: "#551A8B",
          subdue: "#8c8c8c",
          disable: "#8c8c8c",
          hover: "#6fc383",
          onHover: "#000000",
          select: "#b4d8fe",
          onSelect: "inherit",
          focus: "#004099",
          elevate: "0px 0px 2px #8c8c8c",
          immerse: "0.45"
        }
      }
    }
  },
  affordances: { 
    scroll: {
      hintInImmersive: true,
      toggleOnMiddlePointer: ["tap"],
      hideOnForwardScroll: true,
      showOnBackwardScroll: true
    }
  },
  shortcuts: {
    representation: UnstableShortcutRepresentation.symbol,
    joiner: "+"
  },
  actions: {
    reflowOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.jumpToPosition
    ],
    fxlOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.jumpToPosition
    ],
    collapse: {
      // Number of partially icons to display
      // value "all" a keyword for the length of displayOrder above
      // Icons with visibility always are excluded from collapsing
      [ThBreakpoints.compact]: 2,
      [ThBreakpoints.medium]: 3
    }, 
    keys: {
      [ThActionsKeys.settings]: {
        visibility: ThCollapsibilityVisibility.partially,
        shortcut: null, // `${ UnstableShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+P`,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [ThBreakpoints.compact]: ThSheetTypes.bottomSheet
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
        visibility: ThCollapsibilityVisibility.partially,
        shortcut: null
      },
      [ThActionsKeys.toc]: {
        visibility: ThCollapsibilityVisibility.partially,
        shortcut: null, // `${ UnstableShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+T`,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [ThBreakpoints.compact]: ThSheetTypes.fullscreen,
            [ThBreakpoints.medium]: ThSheetTypes.fullscreen
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
      [ThActionsKeys.jumpToPosition]: {
        visibility: ThCollapsibilityVisibility.overflow,
        shortcut: null, // `${ UnstableShortcutMetaKeywords.shift }+${ ShortcutMetaKeywords.alt }+J`,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [ThBreakpoints.compact]: ThSheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: ThDockingTypes.none
        },
        snapped: {
          scrim: true,
          minHeight: "content-height"
        }
      }
    }
  },
  docking: {
    displayOrder: [
      ThDockingKeys.transient,
      ThDockingKeys.start,
      ThDockingKeys.end
    ],
    dock: {
      [ThBreakpoints.compact]: ThDockingTypes.none,
      [ThBreakpoints.medium]: ThDockingTypes.none,
      [ThBreakpoints.expanded]: ThDockingTypes.start,
      [ThBreakpoints.large]: ThDockingTypes.both,
      [ThBreakpoints.xLarge]: ThDockingTypes.both
    },
    collapse: true,
    keys: {
      [ThDockingKeys.start]: {
        visibility: ThCollapsibilityVisibility.overflow,
        shortcut: null
      },
      [ThDockingKeys.end]: {
        visibility: ThCollapsibilityVisibility.overflow,
        shortcut: null
      },
      [ThDockingKeys.transient]: {
        visibility: ThCollapsibilityVisibility.overflow,
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
        range: [0.7, 4],
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