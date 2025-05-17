"use client";

import { useCallback, useMemo, useRef } from "react";

import { ThScrollBackTo } from "@/preferences/models/enums";
import { ScrollAffordance, ThScrollAffordancePref } from "./scrollAffordance";

import { 
  EPUBLayout, 
  Link, 
  Locator, 
  Publication 
} from "@readium/shared";
import { 
  EpubNavigator, 
  EpubNavigatorListeners, 
  EpubPreferences, 
  EpubSettings, 
  FrameManager, 
  FXLFrameManager, 
  IEpubDefaults, 
  IEpubPreferences
} from "@readium/navigator";

type cbb = (ok: boolean) => void;

// Module scoped, singleton instance of navigator
let navigatorInstance: EpubNavigator | null = null;

// Scroll Affordances as mutable, otherwise the callbacks
// will not work for components mounting before load
// They should not be part of the hook anyway
// And their existence is due to the lack of Injection API
let scrollAffordanceTop: ScrollAffordance | null = null;
let scrollAffordanceBottom: ScrollAffordance | null = null;

export interface EpubNavigatorLoadProps {
  container: HTMLDivElement | null;
  publication: Publication;
  listeners: EpubNavigatorListeners;
  positionsList?: Locator[];
  initialPosition?: Locator;
  preferences?: IEpubPreferences;
  defaults?: IEpubDefaults;
  scrollAffordances?: {
    top?: ThScrollAffordancePref;
    bottom?: ThScrollAffordancePref;
  }
}

export const useEpubNavigator = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const containerParent = useRef<HTMLElement | null>(null);
  const publication = useRef<Publication | null>(null);

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/edrlab/thorium-web/issues/25
  const mountScroll = useCallback(() => {
    navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {        
        scrollAffordanceTop?.render(frameManager.window.document);
        scrollAffordanceBottom?.render(frameManager.window.document)
      }
    });
  }, []);

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/edrlab/thorium-web/issues/25
  const unmountScroll = useCallback(() => {
    navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        scrollAffordanceTop?.destroy(frameManager.window.document);
        scrollAffordanceBottom?.destroy(frameManager.window.document)
      }
    });
  }, []);

  const handleScrollAffordances = useCallback((scroll: boolean) => {
    if (navigatorInstance === null || navigatorInstance.layout === EPUBLayout.fixed) return;
    scroll ? mountScroll() : unmountScroll();
  }, [mountScroll, unmountScroll]);

  const submitPreferences = useCallback(async (preferences: IEpubPreferences) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences(preferences));
  }, []);

  const getSetting = useCallback(<K extends keyof EpubSettings>(settingKey: K) => {
    return navigatorInstance?.settings[settingKey] as EpubSettings[K];
  }, []);

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/edrlab/thorium-web/issues/25
  const scrollBackTo = useCallback((position: ThScrollBackTo) => {
    if (position !== ThScrollBackTo.untouched) {
      navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
        if (frameManager) {
          const scrollingEl = frameManager.window.document.scrollingElement;
          if (position === ThScrollBackTo.top) {
            scrollingEl?.scrollTo(0, 0);
          } else {
            scrollingEl?.scrollTo(0, scrollingEl.scrollHeight);
          }
        }
      });
    }
  }, []);

  // [TMP] Working around positionChanged not firing consistently for FXL
  // We’re observing the FXLFramePoolManager spine div element’s style
  // and checking whether its translate3d has changed.
  // Sure IntersectionObserver should be the obvious one to use here,
  // observing iframes instead of the style attribute on the spine element
  // but there’s additional complexity to handle as a spread = 2 iframes
  // And keeping in sync while the FramePool is re-aligning on resize can be suboptimal
  let FXLPositionChangedCallback: ((locator: Locator) => void) | undefined;
  const FXLPositionChanged = useMemo(() => {  
    return new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        const re = /translate3d\(([^)]+)\)/;
        const newVal = (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);
        const oldVal = mutation.oldValue;
        if (newVal?.split(re)[1] !== oldVal?.split(re)[1]) {
          const locator = navigatorInstance?.currentLocator;
          if (locator) {
            FXLPositionChangedCallback?.(locator);
          }
        }
      }
    });
  }, [FXLPositionChangedCallback]);

  const EpubNavigatorLoad = useCallback((config: EpubNavigatorLoadProps, cb: Function) => {
    if (config.container) {
      container.current = config.container;
      containerParent.current = container.current? container.current.parentElement : null;
      
      publication.current = config.publication;

      if (config.scrollAffordances) {
        if (config.scrollAffordances.top) {
          scrollAffordanceTop = new ScrollAffordance({ pref: config.scrollAffordances.top, placement: "top" })
        }
        if (config.scrollAffordances.bottom) {
          scrollAffordanceBottom = new ScrollAffordance({ pref: config.scrollAffordances.bottom, placement: "bottom" })
        }
      }

      navigatorInstance = new EpubNavigator(
        config.container, 
        config.publication, 
        config.listeners, 
        config.positionsList, 
        config.initialPosition, 
        { preferences: config.preferences || {}, defaults: config.defaults || {} }
      );

      navigatorInstance.load().then(() => {
        cb();

        if (navigatorInstance?.layout === EPUBLayout.fixed) {
          // @ts-ignore
          FXLPositionChanged.observe((navigatorInstance?.pool.spineElement as HTMLElement), {
            attributeFilter: ["style"], 
            attributeOldValue: true
          });
        }
      });
    }
  }, [FXLPositionChanged]);

  const EpubNavigatorDestroy = useCallback((cb: Function) => {
    cb();

    if (navigatorInstance?.layout === EPUBLayout.fixed) {
      FXLPositionChanged.disconnect();
    }
    navigatorInstance?.destroy;
  }, [FXLPositionChanged]);

  const goRight = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goRight(animated, callback);
  }, []);

  const goLeft = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goLeft(animated, callback)
  }, []);

  const goBackward = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goBackward(animated, callback);
  }, []);

  const goForward = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goForward(animated, callback);
  }, []);

  const goLink = useCallback((link: Link, animated: boolean, callback: cbb) => {
    navigatorInstance?.goLink(link, animated, callback);
  }, []);

  const go = useCallback((locator: Locator, animated: boolean, callback: cbb) => {
    navigatorInstance?.go(locator, animated, callback);
  }, []);

  const navLayout = useCallback(() => {
    return navigatorInstance?.layout;
  }, []);

  const currentLocator = useCallback(() => {
    return navigatorInstance?.currentLocator;
  }, []);

  const currentPositions = useCallback(() => {
    return navigatorInstance?.currentPositionNumbers;
  }, []);

  // Warning: this is an internal member that will become private, do not rely on it
  // See https://github.com/edrlab/thorium-web/issues/25
  const getCframes = useCallback(() => {
    return navigatorInstance?._cframes;
  }, []);

  return { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goRight, 
    goLeft, 
    goBackward, 
    goForward,
    goLink, 
    go, 
    handleScrollAffordances,
    scrollBackTo, 
    navLayout, 
    currentLocator,
    currentPositions,
    preferencesEditor: navigatorInstance?.preferencesEditor,
    getSetting,
    submitPreferences,
    getCframes,
    onFXLPositionChange: (cb: (locator: Locator) => void) => {
      FXLPositionChangedCallback = cb;
    }
  }
}