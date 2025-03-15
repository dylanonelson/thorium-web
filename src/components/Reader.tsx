"use client";

import { useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import fontStacks from "@readium/css/css/vars/fontStacks.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";

import { StaticBreakpoints } from "@/models/staticBreakpoints";
import { ScrollBackTo } from "@/models/preferences";
import { ActionKeys } from "@/models/actions";
import { ThemeKeys } from "@/models/theme";
import { ICache } from "@/models/reader";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigatorListeners, FrameManager, FXLFrameManager, PaginationStrategy } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";

import { ReaderWithDock } from "./ReaderWithPanels";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { ReaderFooter } from "./ReaderFooter";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useTheming } from "@/hooks/useTheming";
import { usePrevious } from "@/hooks/usePrevious";

import Peripherals from "@/helpers/peripherals";
import { CUSTOM_SCHEME, ScrollActions } from "@/helpers/scrollAffordance";
import { localData } from "@/helpers/localData";
import { getPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { createTocTree } from "@/helpers/toc/createTocTree";

import { setImmersive, setHovering, toggleImmersive, setPlatformModifier, setDirection, setArrows } from "@/lib/readerReducer";
import { setFXL, setRTL, setProgression, setRunningHead, setTocTree } from "@/lib/publicationReducer";
import { toggleActionOpen } from "@/lib/actionsReducer";
import { useAppSelector, useAppDispatch, useAppStore } from "@/lib/hooks";

import debounce from "debounce";
import { I18nProvider } from "react-aria";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const publication = useRef<Publication | null>(null);
  const localDataKey = useRef(`${selfHref}-current-location`);
  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));

  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount);
  const paginationStrategy = useAppSelector(state => state.reader.paginationStrategy);
  const theme = useAppSelector(state => state.theming.theme);
  const previousTheme = usePrevious(theme);
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);

  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
  const arrowsOccupySpace = staticBreakpoint && 
    (staticBreakpoint === StaticBreakpoints.large || staticBreakpoint === StaticBreakpoints.xLarge);
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);

  // We need to use a cache so that we can use updated values
  // without re-rendering the component, and reloading EpubNavigator
  const cache = useRef<ICache>({
    isImmersive: isImmersive,
    arrowsOccupySpace: arrowsOccupySpace || false,
    settings: {
      paginated: isPaged,
      colCount: colCount,
      paginationStrategy: paginationStrategy,
      theme: theme
    },
    colorScheme: colorScheme,
    reducedMotion: reducedMotion
  });

  const atPublicationStart = useAppSelector(state => state.publication.atPublicationStart);
  const atPublicationEnd = useAppSelector(state => state.publication.atPublicationEnd);

  const dispatch = useAppDispatch();

  const fs = useFullscreen();

  // The reason why we’re not using theming for states e.g theming.theme 
  // instead of useAppSelector is that theming will move to a higher-level component 
  // and not reside in Reader anymore so we would eventually have to use Redux states
  const theming = useTheming();

  const { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goLeft, 
    goRight, 
    goBackward, 
    goForward, 
    scrollBackTo, 
    listThemeProps, 
    applyConstraint, 
    handleProgression,
    navLayout,
    currentLocator,
    getCframes,
    applyScroll,
    applyTheme
  } = useEpubNavigator();

  const activateImmersiveOnAction = useCallback(() => {
    if (!cache.current.isImmersive) dispatch(setImmersive(true));
  }, [dispatch]);

  const toggleIsImmersive = useCallback(() => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(setArrows(false));
    dispatch(toggleImmersive());
  }, [dispatch]);

  useEffect(() => {
    cache.current.isImmersive = isImmersive;
  }, [isImmersive]);

  // Warning: this is using navigator’s internal methods that will become private, do not rely on them
  // See https://github.com/readium/playground/issues/25
  const handleTap = (event: FrameClickEvent) => {
    const _cframes = getCframes();
    if (_cframes && cache.current.settings.paginated) {
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
      toggleIsImmersive();
    }
  };

  const initReadingEnv = async () => {
    if (navLayout() === EPUBLayout.fixed) {
      // [TMP] Working around positionChanged not firing consistently for FXL
      // Init’ing so that progression can be populated on first spread loaded
      const cLoc = currentLocator();
      if (cLoc) handleProgression(cLoc);
    }
  };

  const p = new Peripherals(useAppStore(), {
    moveTo: (direction) => {
      switch(direction) {
        case "right":
          if (cache.current.settings.paginated) goRight(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "left":
          if (cache.current.settings.paginated) goLeft(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "up":
        case "home":
          // Home should probably go to first column/page of chapter in reflow?
          if (!cache.current.settings.paginated) activateImmersiveOnAction();
          break;
        case "down":
        case "end":
          // End should probably go to last column/page of chapter in reflow?
          if (!cache.current.settings.paginated) activateImmersiveOnAction();
          break;
        default:
          break;
      }
    },
    goProgression: (shiftKey) => {
      if (cache.current.settings?.paginated) {
        shiftKey 
          ? goBackward(!cache.current.reducedMotion, activateImmersiveOnAction) 
          : goForward(!cache.current.reducedMotion, activateImmersiveOnAction);
      } else {
        activateImmersiveOnAction();
      }
    },
    toggleAction: (actionKey) => {  
      switch (actionKey) {
        case ActionKeys.fullscreen:
          fs.handleFullscreen();
          break;
        case ActionKeys.settings:
        case ActionKeys.toc:
          dispatch(toggleActionOpen({
            key: actionKey
          }))
          break;
        case ActionKeys.jumpToPosition:
        default:
          break
      }
    }
  });

  const listeners: EpubNavigatorListeners = {
    frameLoaded: async function (_wnd: Window): Promise<void> {
      await initReadingEnv();
      // Warning: this is using navigator’s internal methods that will become private, do not rely on them
      // See https://github.com/readium/playground/issues/25
      const _cframes = getCframes();
      _cframes?.forEach(
        (frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) p.observe(frameManager.window);
        }
      );
      p.observe(window);
    },
    positionChanged: async function (locator: Locator): Promise<void> {
      window.focus();

      // This can’t be relied upon with FXL to handleProgression at the moment,
      // Only reflowable snappers will register the "progress" event
      // that triggers positionChanged every time the progression changes
      // in FXL, only first_visible_locator will, which is why it triggers when
      // the spread has not been shown yet, but won’t if you just slid to them.
      if (navLayout() === EPUBLayout.reflowable) {
        // Due to the lack of injection API we need to force scroll 
        // to mount/unmount scroll affordances ATM
        const currentLocator = localData.get(localDataKey.current);
        
        const debouncedHandleProgression = debounce(
          async () => {
            // TMP: To mount/unmount scroll affordances in the absence of the injection API. 
            // We need to debounce because of swipe, which has a 150ms animation in Column Snapper, 
            // otherwise the iframe will stay hidden since we must change the ReadingProgression,
            // that requires re-loading the frame pool
            if (currentLocator?.href !== locator.href) {
              await applyScroll(!cache.current.settings.paginated);
            } 
            handleProgression(locator);
            localData.set(localDataKey.current, locator);
          }, 250);
        debouncedHandleProgression();
      }
    },
    tap: function (_e: FrameClickEvent): boolean {
      handleTap(_e);
      return true;
    },
    click: function (_e: FrameClickEvent): boolean {
      return true;
    },
    zoom: function (_scale: number): void {},
    miscPointer: function (_amount: number): void {},
    customEvent: function (_key: string, _data: unknown): void {},
    handleLocator: function (locator: Locator): boolean {
      const href = locator.href;

      // Scroll Affordances
      // That’s not great though
      if (href.includes(CUSTOM_SCHEME)) {
        if (href.includes(ScrollActions.prev)) {
          goLeft(false, () => { scrollBackTo(RSPrefs.scroll.backTo) }); 
        } else if (href.includes(ScrollActions.next)) {
          goRight(false, () => { scrollBackTo(ScrollBackTo.top) });
        }
      } else if (
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

  useEffect(() => {
    cache.current.settings.paginated = isPaged;
  }, [isPaged]);

  useEffect(() => {
    cache.current.settings.colCount = colCount;
  }, [colCount]);

  useEffect(() => {
    cache.current.settings.paginationStrategy = paginationStrategy;
  }, [paginationStrategy]);

  // Handling side effects on Navigator
  useEffect(() => {
    cache.current.settings.theme = theme;
  }, [theme]);

  useEffect(() => {
    cache.current.arrowsOccupySpace = arrowsOccupySpace || false;
  }, [arrowsOccupySpace]);

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

    // Protecting against re-applying on theme change
    if (theme !== ThemeKeys.auto && previousTheme !== theme) return;

    const applyCurrentTheme = async () => {
      await applyTheme(theme, colorScheme);
    };

    applyCurrentTheme()
      .catch(console.error);
  }, [theme, previousTheme, colorScheme, applyTheme]);

  useEffect(() => {
    RSPrefs.direction && dispatch(setDirection(RSPrefs.direction));
    dispatch(setPlatformModifier(getPlatformModifier()));
  }, [dispatch]);

  useEffect(() => {
    const handleConstraint = async () => {
      await applyConstraint(arrowsOccupySpace ? arrowsWidth.current : 0)
    }
    handleConstraint()
      .catch(console.error);
  }, [arrowsOccupySpace, applyConstraint]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    publication.current = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });    

    dispatch(setRTL(publication.current.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.current.metadata.getPresentation()?.layout === EPUBLayout.fixed));

    const pubTitle = publication.current.metadata.title.getTranslation("en");

    dispatch(setRunningHead(pubTitle));
    dispatch(setProgression({ currentPublication: pubTitle }));

    let positionsList: Locator[] | undefined;

    // Create a heirarchical tree structure for the table of contents
    // where each entry has a unique id property and store this on the publication state
    let idCounter = 0;
    const idGenerator = () => `toc-${++idCounter}`;
    const tocTree = createTocTree(publication.current.tableOfContents?.items || [], idGenerator);
    dispatch(setTocTree(tocTree));

    const fetchPositions = async () => {
      positionsList = await publication.current?.positionsFromManifest();
      if (positionsList && positionsList.length > 0) dispatch(setProgression( { totalPositions: positionsList.length }));
    };

    fetchPositions()
      .catch(console.error)
      .then(() => {
        const initialPosition = localData.get(localDataKey.current);

        const initialConstraint = cache.current.arrowsOccupySpace ? arrowsWidth.current : 0;
        const themeProps = listThemeProps(cache.current.settings.theme, cache.current.colorScheme);
  
        EpubNavigatorLoad({
          container: container.current, 
          publication: publication.current!,
          listeners: listeners, 
          positionsList: positionsList,
          initialPosition: initialPosition,
          preferences: {
            pageGutter: RSPrefs.typography.pageGutter,
            optimalLineLength: RSPrefs.typography.optimalLineLength,
            minimalLineLength: RSPrefs.typography.minimalLineLength,
            maximalLineLength: RSPrefs.typography.maximalLineLength,
            fontFamily: fontStacks.RS__oldStyleTf,
            constraint: initialConstraint,
            paginationStrategy: RSPrefs.typography.paginationStrategy as unknown as PaginationStrategy,
            ...themeProps
          },
          localDataKey: localDataKey.current,
        }, () => p.observe(window));
      });

    return () => {
      EpubNavigatorDestroy(() => p.destroy());
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <I18nProvider locale={  RSPrefs.locale  }>
    <main>
      <ReaderWithDock>
        <div id="reader-main">
          <ReaderHeader />

        { isPaged 
          ? <nav className={ arrowStyles.container } id={ arrowStyles.left }>
              <ArrowButton 
                direction="left" 
                occupySpace={ arrowsOccupySpace || false }
                disabled={ atPublicationStart } 
                onPressCallback={ () => goLeft(!reducedMotion, activateImmersiveOnAction) }
              />
          </nav> 
          : <></> }

          <article id="wrapper" aria-label={ Locale.reader.app.publicationWrapper }>
            <div id="container" ref={ container }></div>
          </article>

        { isPaged 
          ? <nav className={ arrowStyles.container } id={ arrowStyles.right }>
              <ArrowButton 
                direction="right" 
                occupySpace={ arrowsOccupySpace || false }
                disabled={ atPublicationEnd } 
                onPressCallback={ () => goRight(!reducedMotion, activateImmersiveOnAction) }
              />
            </nav> 
          : <></> }

        { isPaged ? <ReaderFooter /> : <></> }
        </div>
    </ReaderWithDock>
  </main>
  </I18nProvider>
  </>
)};