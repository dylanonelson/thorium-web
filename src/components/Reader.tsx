"use client";

import { RSPrefs, ScrollBackTo } from "@/preferences";
import Locale from "../resources/locales/en.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";

import { useCallback, useEffect, useRef } from "react";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { ReaderFooter } from "./ReaderFooter";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import Peripherals from "@/helpers/peripherals";
import { CUSTOM_SCHEME, ScrollActions } from "@/helpers/scrollAffordance";
import { propsToCSSVars } from "@/helpers/propsToCSSVars";
import { localData } from "@/helpers/localData";

import { setImmersive, setBreakpoint, setHovering, toggleImmersive } from "@/lib/readerReducer";
import { setFXL, setRTL, setProgression, setRunningHead } from "@/lib/publicationReducer";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import debounce from "debounce";

interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
}

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const publication = useRef<Publication | null>(null);
  const localDataKey = useRef(`${selfHref}-current-location`);

  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount);

  const RCSSSettings = useRef<IRCSSSettings>({
    paginated: isPaged,
    colCount: colCount
  });
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isImmersiveRef = useRef(isImmersive);

  const runningHead = useAppSelector(state => state.publication.runningHead);
  const atPublicationStart = useAppSelector(state => state.publication.atPublicationStart);
  const atPublicationEnd = useAppSelector(state => state.publication.atPublicationEnd);

  const dispatch = useAppDispatch();

  const { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goLeft, 
    goRight, 
    goBackward, 
    goForward,
    navLayout,
    currentLocator,
    getCframes,
    applyColumns, 
    applyScrollable, 
    scrollBackTo, 
    applyReadiumCSSStyles,
    handleColCountReflow,
    setFXLPages,  
    handleProgression
  } = useEpubNavigator();

  const activateImmersiveOnAction = useCallback(() => {
    if (!isImmersiveRef.current) dispatch(setImmersive(true));
  }, [isImmersive, dispatch]);

  const toggleIsImmersive = useCallback(() => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(toggleImmersive());
  }, [dispatch]);

  useEffect(() => {
    isImmersiveRef.current = isImmersive;
  }, [isImmersive]);

  const handleTap = (event: FrameClickEvent) => {
    const _cframes = getCframes();
    if (_cframes && RCSSSettings.current.paginated) {
      const oneQuarter = ((_cframes.length === 2 ? _cframes[0]!.window.innerWidth + _cframes[1]!.window.innerWidth : _cframes![0]!.window.innerWidth) * window.devicePixelRatio) / 4;
    
      if (event.x < oneQuarter) {
        goLeft(true, activateImmersiveOnAction);
      } 
      else if (event.x > oneQuarter * 3) {
        goRight(true, activateImmersiveOnAction);
      } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
        toggleIsImmersive();
      }
    } else {
      toggleIsImmersive();
    }
  };

  const initReadingEnv = async () => {
    if (navLayout() === EPUBLayout.reflowable) {
      applyReadiumCSSStyles({
        "--RS__pageGutter": `${RSPrefs.typography.pageGutter}px`
      });
      if (RCSSSettings.current.paginated) {
        await applyColumns(RCSSSettings.current.colCount);
      } else {
        await applyScrollable();
      }
    } else if (navLayout() === EPUBLayout.fixed) {
      // [TMP] Working around positionChanged not firing consistently for FXL
      // Init’ing so that progression can be populated on first spread loaded
      const cLoc = currentLocator();
      if (cLoc) handleProgression(cLoc);
    }
  };

  const p = new Peripherals({
    moveTo: (direction) => {
      switch(direction) {
        case "right":
          if (RCSSSettings.current.paginated) goRight(true, activateImmersiveOnAction);
          break;
        case "left":
          if (RCSSSettings.current.paginated) goLeft(true, activateImmersiveOnAction);
          break;
        case "up":
        case "home":
          // Home should probably go to first column/page of chapter in reflow?
          if (!RCSSSettings.current.paginated) activateImmersiveOnAction();
          break;
        case "down":
        case "end":
          // End should probably go to last column/page of chapter in reflow?
          if (!RCSSSettings.current.paginated) activateImmersiveOnAction();
          break;
        default:
          break;
      }
    },
    goProgression: (shiftKey) => {
      if (RCSSSettings.current.paginated) {
        shiftKey 
          ? goBackward(true, activateImmersiveOnAction) 
          : goForward(true, activateImmersiveOnAction);
      } else {
        activateImmersiveOnAction();
      }
    }
  });

  const listeners: EpubNavigatorListeners = {
    frameLoaded: async function (_wnd: Window): Promise<void> {
      await initReadingEnv();
      const _cframes = getCframes();
      _cframes?.forEach(
        (frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) p.observe(frameManager.window);
        }
      );
      p.observe(window);
    },
    positionChanged: debounce(function (locator: Locator): void {
      window.focus();

      // This can’t be relied upon with FXL to handleProgression at the moment,
      // Only reflowable snappers will register the "progress" event
      // that triggers positionChanged every time the progression changes
      // in FXL, only first_visible_locator will, which is why it triggers when
      // the spread has not been shown yet, but won’t if you just slid to them.
      if (navLayout() === EPUBLayout.reflowable) {
        handleProgression(locator);
        localData.set(localDataKey.current, locator);
      }
    }, 250),
    tap: function (_e: FrameClickEvent): boolean {
      handleTap(_e);
      return true;
    },
    click: function (_e: FrameClickEvent): boolean {
      toggleIsImmersive()
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
    RCSSSettings.current.paginated = isPaged;

    const applyLayout = async () => {
      if (isPaged) { 
        await applyColumns(colCount);
      } else {
        await applyScrollable();
      }
    }
    applyLayout()
      .catch(console.error);
      
  }, [isPaged, applyColumns, applyScrollable]);

  useEffect(() => {
    RCSSSettings.current.colCount = colCount;

    if (navLayout() === EPUBLayout.reflowable) {
      handleColCountReflow(colCount);
    } else if (navLayout() === EPUBLayout.fixed) {
      colCount === "1" ? setFXLPages(1) : setFXLPages(0);
    }
  }, [colCount, handleColCountReflow]);

  const handleResize = debounce(() => {
    if (navLayout() === EPUBLayout.reflowable) {
      if (RCSSSettings.current.paginated) {
        handleColCountReflow(RCSSSettings.current.colCount);
      }
    }
  }, 250);

  const mq = "(min-width:"+ RSPrefs.breakpoint + "px)";
  const breakpointQuery = window.matchMedia(mq);
  const handleBreakpointChange = useCallback((event: MediaQueryListEvent) => {
    dispatch(setBreakpoint(event.matches))}, [dispatch]);

  useEffect(() => {
    breakpointQuery.addEventListener("change", handleBreakpointChange);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    return () => {
      breakpointQuery.removeEventListener("change", handleBreakpointChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    }
  }, [breakpointQuery, handleBreakpointChange, handleResize]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    publication.current = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    let positionsList: Locator[] | undefined;

    dispatch(setRunningHead(publication.current.metadata.title.getTranslation("en")));    
    dispatch(setRTL(publication.current.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.current.metadata.getPresentation()?.layout === EPUBLayout.fixed));

    dispatch(setProgression({ currentPublication: runningHead }));

    const fetchPositions = async () => {
      const positionsJSON = publication.current?.manifest.links.findWithMediaType("application/vnd.readium.position-list+json");
      if (positionsJSON) {
        const fetcher = new HttpFetcher(undefined, selfHref);
        const fetched = fetcher.get(positionsJSON);
        try {
          const positionObj = await fetched.readAsJSON() as {total: number, positions: Locator[]};
          positionsList = positionObj.positions;
          dispatch(setProgression( { totalPositions: positionObj.total }));
        } catch(err) {
          console.error(err)
        }
      }
    };

    fetchPositions()
      .catch(console.error);
    
    const initialPosition = localData.get(localDataKey.current);

    EpubNavigatorLoad({
      container: container.current, 
      publication: publication.current,
      listeners: listeners, 
      positionsList: positionsList,
      initialPosition: initialPosition,
      localDataKey: localDataKey.current,
    }, () => p.observe(window));

    return () => {
      EpubNavigatorDestroy(() => p.destroy());
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <main style={ propsToCSSVars(RSPrefs.theming) }>
      <ReaderHeader 
        runningHead={ runningHead } 
      />

    { isPaged ? 
      <nav className={ arrowStyles.container } id={ arrowStyles.left }>
        <ArrowButton 
          direction="left" 
          disabled={ atPublicationStart } 
          onPressCallback={ () => goLeft(true, () => {}) }
        />
      </nav> : 
      <></>
    }

      <article id="wrapper" aria-label={ Locale.reader.app.publicationWrapper }>
        <div id="container" ref={ container }></div>
      </article>

    { isPaged ?
      <nav className={ arrowStyles.container } id={ arrowStyles.right }>
        <ArrowButton 
          direction="right"  
          disabled={ atPublicationEnd } 
          onPressCallback={ () => goRight(true, () => {}) }
        />
      </nav> : 
      <></>
    }

    { isPaged ? <ReaderFooter /> : <></>}
  </main>
  </>
)};