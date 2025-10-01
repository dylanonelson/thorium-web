"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { 
  defaultFontFamilyOptions, 
  ThemeKeyType, 
  usePreferenceKeys, 
  useTheming
} from "../../preferences";

import "../assets/styles/reader.css";
import arrowStyles from "../assets/styles/readerArrowButton.module.css";

import { 
  ThActionsKeys, 
  ThBreakpoints, 
  ThLineHeightOptions, 
  ThTextAlignOptions, 
  ThLayoutUI,
  ThDocumentTitleFormat,
  ThSpacingSettingsKeys
} from "../../preferences/models/enums";
import { ThColorScheme } from "@/core/Hooks/useColorScheme";

import { ThPlugin, ThPluginRegistry } from "../Plugins/PluginRegistry";

import { I18nProvider } from "react-aria";
import { ThPluginProvider } from "../Plugins/PluginProvider";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { 
  EpubNavigatorListeners, 
  FrameManager, 
  FXLFrameManager, 
  IEpubDefaults, 
  IEpubPreferences,  
  TextAlignment
} from "@readium/navigator";
import { 
  Locator, 
  Manifest, 
  Publication, 
  Fetcher, 
  HttpFetcher, 
  Layout, 
  ReadingProgression
} from "@readium/shared";

import { StatefulDockingWrapper } from "../Docking/StatefulDockingWrapper";
import { StatefulReaderHeader } from "../StatefulReaderHeader";
import { StatefulReaderArrowButton } from "../StatefulReaderArrowButton";
import { StatefulReaderFooter } from "../StatefulReaderFooter";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useFullscreen } from "@/core/Hooks/useFullscreen";
import { usePrevious } from "@/core/Hooks/usePrevious";
import { useI18n } from "@/i18n/useI18n";
import { useTimeline } from "@/core/Hooks/useTimeline";
import { useLocalStorage } from "@/core/Hooks/useLocalStorage";
import { useDocumentTitle } from "@/core/Hooks/useDocumentTitle";
import { useSpacingPresets } from "./Settings/Spacing/hooks/useSpacingPresets";
import { useLineHeight } from "./Settings";

import { toggleActionOpen } from "@/lib/actionsReducer";
import { useAppSelector, useAppDispatch, useAppStore } from "@/lib/hooks";
import { AppDispatch } from "@/lib/store";
import { 
  setBreakpoint, 
  setColorScheme, 
  setContrast, 
  setForcedColors, 
  setMonochrome, 
  setReducedMotion, 
  setReducedTransparency, 
  setTheme 
} from "@/lib/themeReducer";
import { 
  setImmersive, 
  setLoading,
  setHovering, 
  toggleImmersive, 
  setPlatformModifier, 
  setDirection, 
  setArrows, 
  setFullscreen,
  setScrollAffordance
} from "@/lib/readerReducer";
import { 
  setFXL, 
  setRTL, 
  setPositionsList,
  setTimeline,
  setPublicationStart,
  setPublicationEnd
} from "@/lib/publicationReducer";
import { LineLengthStateObject } from "@/lib/settingsReducer";

import classNames from "classnames";
import debounce from "debounce";
import { buildThemeObject } from "@/preferences/helpers/buildThemeObject";
import { createDefaultPlugin } from "../Plugins/helpers/createDefaultPlugin";
import Peripherals from "../../helpers/peripherals";
import { getPlatformModifier } from "@/core/Helpers/keyboardUtilities";
import { deserializePositions } from "@/helpers/deserializePositions";
import { propsToCSSVars } from "@/core/Helpers/propsToCSSVars";

export interface ReadiumCSSSettings {
  columnCount: string;
  fontFamily: keyof typeof defaultFontFamilyOptions | null;
  fontSize: number;
  fontWeight: number;
  hyphens: boolean | null;
  letterSpacing: number | null;
  lineLength: LineLengthStateObject | null;
  lineHeight: ThLineHeightOptions | null;
  paragraphIndent: number | null;
  paragraphSpacing: number | null;
  publisherStyles: boolean;
  scroll: boolean;
  textAlign: ThTextAlignOptions | null;
  textNormalization: boolean;
  theme?: string;
  wordSpacing: number | null;
}

export interface StatelessCache {
  layoutUI: ThLayoutUI;
  isImmersive: boolean;
  isHovering: boolean;
  arrowsOccupySpace: boolean;
  settings: ReadiumCSSSettings;
  positionsList: Locator[];
  colorScheme?: ThColorScheme;
  reducedMotion?: boolean;
}

export interface StatefulReaderProps {
  rawManifest: object;
  selfHref: string;
  plugins?: ThPlugin[];
}

// We need to register plugins before hooks run
// otherwise we can’t access the values of spacing presets
// when the component is effectively mounted as we check
// if the component is registered and displayed from prefs
export const StatefulReader = ({
  rawManifest,
  selfHref,
  plugins
}: StatefulReaderProps) => {
  const [pluginsRegistered, setPluginsRegistered] = useState(false);

  useEffect(() => {
    if (plugins && plugins.length > 0) {
      plugins.forEach(plugin => {
        ThPluginRegistry.register(plugin);
      });
    } else {
      ThPluginRegistry.register(createDefaultPlugin());
    }
    setPluginsRegistered(true);
  }, [plugins]);

  if (!pluginsRegistered) {
    return null;
  }

  return (
    <>
      <ThPluginProvider>
        <StatefulReaderInner rawManifest={ rawManifest } selfHref={ selfHref } />
      </ThPluginProvider>
    </>
  );
};

const StatefulReaderInner = ({ rawManifest, selfHref }: { rawManifest: object; selfHref: string }) => {
  const { fxlThemeKeys, reflowThemeKeys } = usePreferenceKeys();
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const { getEffectiveSpacingValue } = useSpacingPresets();
  
  const [publication, setPublication] = useState<Publication | null>(null);

  const container = useRef<HTMLDivElement>(null);
  const localDataKey = useRef(`${selfHref}-current-location`);
  const arrowsWidth = useRef(2 * ((preferences.theming.arrow.size || 40) + (preferences.theming.arrow.offset || 0)));

  const isFXL = useAppSelector(state => state.publication.isFXL);
  const positionsList = useAppSelector(state => state.publication.positionsList);

  const textAlign = useAppSelector(state => state.settings.textAlign);
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontSize = useAppSelector(state => state.settings.fontSize);
  const fontWeight = useAppSelector(state => state.settings.fontWeight);
  const hyphens = useAppSelector(state => state.settings.hyphens);
  const letterSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.letterSpacing);
  const lineLength = useAppSelector(state => state.settings.lineLength);
  const lineHeight = getEffectiveSpacingValue(ThSpacingSettingsKeys.lineHeight);
  const paragraphIndent = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphIndent);
  const paragraphSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphSpacing);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);
  const scroll = useAppSelector(state => state.settings.scroll);
  const isScroll = scroll && !isFXL;
  const textNormalization = useAppSelector(state => state.settings.textNormalization);
  const wordSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.wordSpacing);
  const themeObject = useAppSelector(state => state.theming.theme);
  const theme = isFXL ? themeObject.fxl : themeObject.reflow;
  const previousTheme = usePrevious(theme);
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);

  const breakpoint = useAppSelector(state => state.theming.breakpoint);
  const arrowsOccupySpace = !isScroll && breakpoint &&
    (breakpoint === ThBreakpoints.large || breakpoint === ThBreakpoints.xLarge);
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const layoutUI = isFXL 
    ? preferences.theming.layout.ui?.fxl || ThLayoutUI.layered 
    : isScroll 
      ? preferences.theming.layout.ui?.reflow || ThLayoutUI.layered
      : ThLayoutUI.stacked;

  // Init theming (breakpoints, theme, media queries…)
  useTheming<ThemeKeyType>({ 
    theme: theme,
    themeKeys: preferences.theming.themes.keys,
    systemKeys: preferences.theming.themes.systemThemes,
    breakpointsMap: preferences.theming.breakpoints,
    initProps: {
      ...propsToCSSVars(preferences.theming.arrow, "arrow"), 
      ...propsToCSSVars(preferences.theming.icon, "icon"),
      ...propsToCSSVars(preferences.theming.layout, "layout")
    },
    onBreakpointChange: (breakpoint) => dispatch(setBreakpoint(breakpoint)),
    onColorSchemeChange: (colorScheme) => dispatch(setColorScheme(colorScheme)),
    onContrastChange: (contrast) => dispatch(setContrast(contrast)),
    onForcedColorsChange: (forcedColors) => dispatch(setForcedColors(forcedColors)),
    onMonochromeChange: (isMonochrome) => dispatch(setMonochrome(isMonochrome)),
    onReducedMotionChange: (reducedMotion) => dispatch(setReducedMotion(reducedMotion)),
    onReducedTransparencyChange: (reducedTransparency) => dispatch(setReducedTransparency(reducedTransparency))
  });

  const atPublicationStart = useAppSelector(state => state.publication.atPublicationStart);
  const atPublicationEnd = useAppSelector(state => state.publication.atPublicationEnd);

  const dispatch = useAppDispatch();

  const onFsChange = useCallback((isFullscreen: boolean) => {
      dispatch(setFullscreen(isFullscreen));
    }, [dispatch]);
  const fs = useFullscreen(onFsChange);

  const { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goLeft, 
    goRight, 
    goBackward, 
    goForward,  
    navLayout,
    currentLocator,
    currentPositions,
    canGoBackward,
    canGoForward,
    isScrollStart,
    isScrollEnd,
    getCframes,
    onFXLPositionChange,
    submitPreferences
  } = useEpubNavigator();

  const { setLocalData, getLocalData, localData } = useLocalStorage(localDataKey.current);

  const timeline = useTimeline({
    publication: publication,
    currentLocation: localData,
    currentPositions: currentPositions() || [],
    positionsList: positionsList,
    onChange: (timeline) => {
      dispatch(setTimeline(timeline));
    }
  });

  const lineHeightOptions = useLineHeight();

  const documentTitleFormat = preferences.metadata?.documentTitle?.format;
  
  let documentTitle: string | undefined;
  
  if (documentTitleFormat) {
    if (typeof documentTitleFormat === "object" && "key" in documentTitleFormat) {
      documentTitle = t(documentTitleFormat.key) || documentTitleFormat.fallback;
    } else {
      switch (documentTitleFormat) {
        case ThDocumentTitleFormat.title:
          documentTitle = timeline?.title;
          break;
        case ThDocumentTitleFormat.chapter:
          documentTitle = timeline?.progression?.currentChapter;
          break;
        case ThDocumentTitleFormat.titleAndChapter:
          if (timeline?.title && timeline?.progression?.currentChapter) {
            documentTitle = `${ timeline.title } – ${ timeline.progression.currentChapter }`;
          }
          break;
        case ThDocumentTitleFormat.none:
          documentTitle = undefined;
          break;
      }
    }
  }

  useDocumentTitle(documentTitle);

  // We need to use a cache so that we can use updated values
  // without re-rendering the component, and reloading EpubNavigator
  const cache = useRef<StatelessCache>({
    layoutUI: layoutUI,
    isImmersive: isImmersive,
    isHovering: isHovering,
    arrowsOccupySpace: arrowsOccupySpace || false,
    settings: {
      columnCount: columnCount,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      hyphens: hyphens,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight,
      lineLength: lineLength,
      paragraphIndent: paragraphIndent,
      paragraphSpacing: paragraphSpacing,
      publisherStyles: publisherStyles,
      scroll: isScroll,
      textAlign: textAlign,
      textNormalization: textNormalization,
      theme: theme,
      wordSpacing: wordSpacing
    },
    positionsList: positionsList || [],
    colorScheme: colorScheme,
    reducedMotion: reducedMotion
  });

  const activateImmersiveOnAction = useCallback(() => {
    if (!cache.current.isImmersive) dispatch(setImmersive(true));
  }, [dispatch]);

  const toggleIsImmersive = useCallback(() => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(setArrows(false));
    dispatch(toggleImmersive());
  }, [dispatch]);

  // Warning: this is using navigator’s internal methods that will become private, do not rely on them
  // See https://github.com/edrlab/thorium-web/issues/25
  const handleTap = (event: FrameClickEvent) => {
    const _cframes = getCframes();
    if (_cframes) {
      if (!cache.current.settings.scroll) {
        const oneQuarter = ((_cframes.length === 2 ? _cframes[0]!.window.innerWidth + _cframes[1]!.window.innerWidth : _cframes![0]!.window.innerWidth) * window.devicePixelRatio) / 4;
    
        if (event.x < oneQuarter) {
          goLeft(!cache.current.reducedMotion, activateImmersiveOnAction);
        } 
        else if (event.x > oneQuarter * 3) {
          goRight(!cache.current.reducedMotion, activateImmersiveOnAction);
        } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
          toggleIsImmersive();
        }
      } else {
        if (preferences.affordances.scroll.toggleOnMiddlePointer.includes("tap")) {
          toggleIsImmersive();
        }
      }
    }
  };

  // We need this as a workaround due to positionChanged being unreliable
  // in FXL – if the frame is in the pool hidden and is shown again,
  // positionChanged won’t fire.
  const handleFXLProgression = useCallback((locator: Locator) => {
    setLocalData(locator);
  }, [setLocalData]);

  onFXLPositionChange(handleFXLProgression);

  const initReadingEnv = async () => {
    if (navLayout() === Layout.fixed) {
      // [TMP] Working around positionChanged not firing consistently for FXL
      // Init’ing so that progression can be populated on first spread loaded
      const cLoc = currentLocator();
      if (cLoc) {
        handleFXLProgression(cLoc);
      };
    }
  };

  const p = new Peripherals(useAppStore(), preferences.actions, {
    moveTo: (direction) => {
      switch(direction) {
        case "right":
          if (!cache.current.settings.scroll) goRight(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "left":
          if (!cache.current.settings.scroll) goLeft(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "up":
        case "home":
          // Home should probably go to first column/page of chapter in reflow?
          break;
        case "down":
        case "end":
          // End should probably go to last column/page of chapter in reflow?
          break;
        default:
          break;
      }
    },
    goProgression: (shiftKey) => {
      if (!cache.current.settings?.scroll) {
        shiftKey 
          ? goBackward(!cache.current.reducedMotion, activateImmersiveOnAction) 
          : goForward(!cache.current.reducedMotion, activateImmersiveOnAction);
      }
    },
    toggleAction: (actionKey) => {
      switch (actionKey) {
        case ThActionsKeys.fullscreen:
          fs.handleFullscreen();
          break;
        case ThActionsKeys.settings:
        case ThActionsKeys.toc:
          dispatch(toggleActionOpen({
            key: actionKey
          }))
          break;
      //  case ThActionsKeys.jumpToPosition:
        default:
          break
      }
    }
  });

  const listeners: EpubNavigatorListeners = {
    frameLoaded: async function (_wnd: Window): Promise<void> {
      await initReadingEnv();
      // Warning: this is using navigator’s internal methods that will become private, do not rely on them
      // See https://github.com/edrlab/thorium-web/issues/25
      const _cframes = getCframes();
      _cframes?.forEach(
        (frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) p.observe(frameManager.window);
        }
      );
      p.observe(window);
    },
    positionChanged: async function (locator: Locator): Promise<void> {
      if (navLayout() !== Layout.fixed) {
        const debouncedHandleProgression = debounce(
          async () => {
            setLocalData(locator);
          }, 250);
        debouncedHandleProgression();
      }

      // We could use canGoBackward() and canGoForward() directly on arrows
      // but maybe we will need to sync the state for other features in the future
      if (canGoBackward()) {
        dispatch(setPublicationStart(false));
      } else {
        dispatch(setPublicationStart(true));
      }
      
      if (canGoForward()) {
        dispatch(setPublicationEnd(false));
      } else {
        dispatch(setPublicationEnd(true));
      }
    },
    tap: function (_e: FrameClickEvent): boolean {
      handleTap(_e);
      return true;
    },
    click: function (_e: FrameClickEvent): boolean {
      if (cache.current.layoutUI === ThLayoutUI.layered) {
        if (
          !cache.current.settings.scroll ||
          preferences.affordances.scroll.toggleOnMiddlePointer.includes("click")
        ) {
          handleTap(_e);
        }
      }
      return true;
    },
    zoom: function (_scale: number): void {},
    miscPointer: function (_amount: number): void {},
    scroll: function (_delta: number): void {
      if (
        cache.current.settings.scroll && 
        navLayout() !== Layout.fixed
      ) {        
        if (isScrollStart() || isScrollEnd()) {
          if (
            // Keep consistent with pagination behavior
            cache.current.layoutUI === ThLayoutUI.layered
          ) {
            dispatch(setScrollAffordance(true));
          }
        } else if (!cache.current.isImmersive && _delta > 20) {
          if (preferences.affordances.scroll.hideOnForwardScroll) {
            dispatch(setImmersive(true));
          }
        } else if (cache.current.isImmersive && _delta < -20) {
          if (
            // Keep consistent with pagination behavior
            cache.current.layoutUI === ThLayoutUI.layered && 
            preferences.affordances.scroll.showOnBackwardScroll
          ) {
            dispatch(setImmersive(false));
          }
        }
      }
    },
    customEvent: function (_key: string, _data: unknown): void {},
    handleLocator: function (locator: Locator): boolean {
      const href = locator.href;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        if (confirm(`Open "${href}" ?`)) window.open(href, "_blank");
      } else {
        console.warn("Unhandled locator", locator);
      }
      return false;
    },
    textSelected: function (_selection: BasicTextSelection): void {},
  };

  const applyConstraint = useCallback(async (value: number) => {
    await submitPreferences({
      constraint: value
    })
  }, [submitPreferences]);

  // Handling side effects on Navigator

  useEffect(() => {
    cache.current.isImmersive = isImmersive;
  }, [isImmersive]);

  useEffect(() => {
    cache.current.isHovering = isHovering;
  }, [isHovering]);

  useEffect(() => {
    cache.current.layoutUI = layoutUI;
  }, [layoutUI]);

  useEffect(() => {
    cache.current.settings.scroll = isScroll;

    // Reset top bar visibility and last position
    dispatch(setImmersive(false));
  }, [isScroll, dispatch]);

  useEffect(() => {
    cache.current.settings.columnCount = columnCount;
  }, [columnCount]);

  useEffect(() => {
    cache.current.settings.fontFamily = fontFamily;
  }, [fontFamily]);

  useEffect(() => {
    cache.current.settings.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    cache.current.settings.fontWeight = fontWeight;
  }, [fontWeight]);

  useEffect(() => {
    cache.current.settings.hyphens = hyphens;
  }, [hyphens]);

  useEffect(() => {
    cache.current.settings.letterSpacing = letterSpacing;
  }, [letterSpacing]);

  useEffect(() => {
    cache.current.settings.lineHeight = lineHeight;
  }, [lineHeight]);

  useEffect(() => {
    cache.current.settings.lineLength = lineLength;
  }, [lineLength]);

  useEffect(() => {
    cache.current.settings.paragraphIndent = paragraphIndent;
  }, [paragraphIndent]);

  useEffect(() => {
    cache.current.settings.paragraphSpacing = paragraphSpacing;
  }, [paragraphSpacing]);

  useEffect(() => {
    cache.current.settings.textAlign = textAlign;
  }, [textAlign]);

  useEffect(() => {
    cache.current.settings.textNormalization = textNormalization;
  }, [textNormalization]);

  useEffect(() => {
    cache.current.settings.theme = theme;
  }, [theme]);

  useEffect(() => {
    cache.current.settings.wordSpacing = wordSpacing;
  }, [wordSpacing]);

  useEffect(() => {
    cache.current.positionsList = positionsList || [];
  }, [positionsList]);

  useEffect(() => {
    cache.current.arrowsOccupySpace = arrowsOccupySpace || false;

    const handleConstraint = async () => {
      await applyConstraint(arrowsOccupySpace ? arrowsWidth.current : 0)
    }
    handleConstraint()
      .catch(console.error);
  }, [arrowsOccupySpace, applyConstraint]);

  useEffect(() => {
    cache.current.reducedMotion = reducedMotion;
  }, [reducedMotion]);

  // Theme can also change on colorScheme change so
  // we have to handle this side-effect but we can’t
  // from the ReadingDisplayTheme component since it
  // would have to be mounted for this to work
  useEffect(() => {
    if (cache.current.colorScheme !== colorScheme) {
      cache.current.colorScheme = colorScheme;
    }

    const theme = isFXL ? themeObject.fxl : themeObject.reflow;

    // Protecting against re-applying on theme change
    if (theme !== "auto" && previousTheme !== theme) return;

    const applyCurrentTheme = async () => {
      const themeKeys = isFXL ? fxlThemeKeys : reflowThemeKeys;
      const themeKey = themeKeys.includes(theme as any) ? theme : "auto";
      const themeProps = buildThemeObject<ThemeKeyType>({
        theme: themeKey,
        themeKeys: preferences.theming.themes.keys,
        systemThemes: preferences.theming.themes.systemThemes,
        colorScheme
      });
      await submitPreferences(themeProps);
      dispatch(setTheme({ 
        key: isFXL ? "fxl" : "reflow", 
        value: themeKey 
      }));
    };

    applyCurrentTheme()
      .catch(console.error);
  }, [themeObject, previousTheme, preferences.theming.themes, fxlThemeKeys, reflowThemeKeys, colorScheme, isFXL, submitPreferences, dispatch]);

  useEffect(() => {
    preferences.direction && dispatch(setDirection(preferences.direction));
    dispatch(setPlatformModifier(getPlatformModifier()));
  }, [preferences.direction, dispatch]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    setPublication(new Publication({
      manifest: manifest,
      fetcher: fetcher
    }));
  }, [rawManifest, selfHref]);

  useEffect(() => {
    if (!publication) return;

    dispatch(setRTL(publication.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.metadata.effectiveLayout === Layout.fixed));

    let positionsList: Locator[] | undefined;

    const fetchPositions = async () => {
      positionsList = await publication.positionsFromManifest();
      const deserializedPositionsList = deserializePositions(positionsList);
      dispatch(setPositionsList(deserializedPositionsList));
    };

    fetchPositions()
      .catch(console.error)
      .then(() => {
        const isFXL = publication.metadata.effectiveLayout === Layout.fixed;

        const initialPosition: Locator | null = getLocalData();

        const initialConstraint = cache.current.arrowsOccupySpace ? arrowsWidth.current : 0;
        
        const themeKeys = isFXL ? fxlThemeKeys : reflowThemeKeys;
        const theme = themeKeys.includes(cache.current.settings.theme as any) ? cache.current.settings.theme : "auto";
        const themeProps = buildThemeObject<ThemeKeyType>({
          theme: theme,
          themeKeys: preferences.theming.themes.keys,
          systemThemes: preferences.theming.themes.systemThemes,
          colorScheme: cache.current.colorScheme
        });

        const epubPreferences: IEpubPreferences = isFXL ? {} : {
          columnCount: cache.current.settings.columnCount === "auto" ? null : Number(cache.current.settings.columnCount),
          constraint: initialConstraint,
          fontFamily: cache.current.settings.fontFamily && defaultFontFamilyOptions[cache.current.settings.fontFamily],
          fontSize: cache.current.settings.fontSize,
          fontWeight: cache.current.settings.fontWeight,
          hyphens: cache.current.settings.hyphens,
          letterSpacing: cache.current.settings.publisherStyles ? undefined : cache.current.settings.letterSpacing,
          lineHeight: cache.current.settings.publisherStyles 
            ? undefined 
            : cache.current.settings.lineHeight === null 
              ? null 
              : lineHeightOptions[cache.current.settings.lineHeight],
          optimalLineLength: cache.current.settings.lineLength?.optimal != null 
            ? cache.current.settings.lineLength.optimal 
            : undefined,
          maximalLineLength: cache.current.settings.lineLength?.max?.isDisabled 
            ? null 
            : (cache.current.settings.lineLength?.max?.chars != null) 
              ? cache.current.settings.lineLength.max.chars 
              : undefined,
          minimalLineLength: cache.current.settings.lineLength?.min?.isDisabled 
            ? null 
            : (cache.current.settings.lineLength?.min?.chars != null) 
              ? cache.current.settings.lineLength.min.chars 
              : undefined,
          paragraphIndent: cache.current.settings.publisherStyles ? undefined :cache.current.settings.paragraphIndent,
          paragraphSpacing: cache.current.settings.publisherStyles ? undefined :cache.current.settings.paragraphSpacing,
          scroll: cache.current.settings.scroll,
          textAlign: cache.current.settings.textAlign as unknown as TextAlignment | null | undefined,
          textNormalization: cache.current.settings.textNormalization,
          wordSpacing: cache.current.settings.publisherStyles ? undefined : cache.current.settings.wordSpacing,
          ...themeProps
        };

        const defaults: IEpubDefaults = isFXL ? {} : {
          maximalLineLength: preferences.typography.maximalLineLength,
          minimalLineLength: preferences.typography.minimalLineLength,
          optimalLineLength: preferences.typography.optimalLineLength,
          pageGutter: preferences.typography.pageGutter,
          scrollPaddingTop: preferences.theming.layout.ui?.reflow === ThLayoutUI.layered 
            ? (preferences.theming.icon.size || 24) * 3 
            : (preferences.theming.icon.size || 24),
          scrollPaddingBottom: preferences.theming.layout.ui?.reflow === ThLayoutUI.layered 
            ? (preferences.theming.icon.size || 24) * 5 
            : (preferences.theming.icon.size || 24)
        }
  
        EpubNavigatorLoad({
          container: container.current, 
          publication: publication,
          listeners: listeners, 
          positionsList: positionsList,
          initialPosition: initialPosition ?? undefined,
          preferences: epubPreferences,
          defaults: defaults
        }, () => p.observe(window));
      })
      .finally(() => {
        const setLoadingThunk = (dispatch: AppDispatch) => {
          dispatch(setLoading(false));
        };
        dispatch(setLoadingThunk);
      });

    return () => {
      EpubNavigatorDestroy(() => p.destroy());
    };
  }, [publication, preferences, fxlThemeKeys, reflowThemeKeys]);

  // If breakpoint is not defined, we are not ready to render
  // since useDocking needs it to derive the sheet type
  // Same for arrows and collapsible actions.
  if (!breakpoint) return null;

  return (
    <>
    <I18nProvider locale={ preferences.locale }>
      <main id="reader-main">
        <StatefulDockingWrapper>
          <div 
            id="reader-shell" 
            className={ 
              classNames(
                isFXL ? "isFXL" : "isReflow",
                isImmersive ? "isImmersive" : "",
                isHovering ? "isHovering" : "",
                isScroll ? "isScroll" : "isPaged",
                layoutUI,
                breakpoint
              )
            }
          >
            <StatefulReaderHeader layout={ layoutUI } />

          { !isScroll 
            ? <nav className={ arrowStyles.container } id={ arrowStyles.left }>
                <StatefulReaderArrowButton 
                  direction="left" 
                  occupySpace={ arrowsOccupySpace || false }
                  isDisabled={ atPublicationStart } 
                  onPress={ () => goLeft(!reducedMotion, activateImmersiveOnAction) }
                />
            </nav> 
            : <></> }

            <article id="wrapper" aria-label={ t("reader.app.publicationWrapper") }>
              <div id="container" ref={ container }></div>
            </article>

          { !isScroll 
            ? <nav className={ arrowStyles.container } id={ arrowStyles.right }>
                <StatefulReaderArrowButton 
                  direction="right" 
                  occupySpace={ arrowsOccupySpace || false }
                  isDisabled={ atPublicationEnd } 
                  onPress={ () => goRight(!reducedMotion, activateImmersiveOnAction) }
                />
              </nav> 
            : <></> }

          <StatefulReaderFooter layout={ layoutUI } />
        </div>
      </StatefulDockingWrapper>
    </main>
  </I18nProvider>
  </>
)};