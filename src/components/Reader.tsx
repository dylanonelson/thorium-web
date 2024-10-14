"use client";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import fontStacks from "readium-css/css/vars/fontStacks.json";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";

import Peripherals from "@/helpers/peripherals";
import { useEffect, useState, useRef } from "react";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { IProgression, ProgressionOf } from "./ProgressionOf";

import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { getOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";
import { propsToCSSVars } from "@/helpers/propsToCSSVars";
import { localData } from "@/helpers/localData";
import { setImmersive, setBreakpoint, setFXL, setRTL} from "@/lib/readerReducer";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import debounce from "debounce";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const nav = useRef<EpubNavigator | null>(null);
  const publication = useRef<Publication | null>(null);
  const optimalLineLength = useRef<number | null>(null);

  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));

  const publicationTitle = useRef(Locale.reader.app.header.title);
  const localDataKey = useRef(`${selfHref}-current-location`);

  const dispatch = useAppDispatch();
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const immersive = useRef(isImmersive);

  const isPublicationStart = useAppSelector(state => state.reader.isPublicationStart) || false;
  const isPublicationEnd = useAppSelector(state => state.reader.isPublicationEnd) || false;

  // In practice, selfHref is what is used to set the self link, which is our scope
  const [progression, setProgression] = useState<IProgression>({});

  // TMP: Nasty trick to get around usage in useEffect with explicit deps
  // i.e. isImmersive will stay the same as long as the entire navigator
  // is not re-rendered so we have to rely on an alias…
  // a toggle reducer wouldn’t help either, as activateImmersiveOnAction
  // always sees isImmersive as false and fires on every keyboard action
  useEffect(() => {
    immersive.current = isImmersive;
  }, [isImmersive]);

  const activateImmersiveOnAction = () => {
    if (!immersive.current) dispatch(setImmersive(true));
  }

  const toggleImmersive = () => {
    dispatch(setImmersive(!immersive.current));
  }

  const applyReadiumCSSStyles = (stylesObj: { [key: string]: string }) => {
    nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        for (const [key, value] of Object.entries(stylesObj)) {
          frameManager.window.document.documentElement.style.setProperty(key, value);
        }
      }
    });
  }

  useEffect(() => {
    isPaged ? applyReadiumCSSStyles({
      "--USER__view": "readium-paged-on"
    }) :
    applyReadiumCSSStyles({
      "--USER__view": "readium-scroll-on"
    })
  }, [isPaged])

  const handleReaderControl = (ev: Event) => {
    const detail = (ev as CustomEvent).detail as {
      command: string;
      data: unknown;
    };
    
    switch (detail.command) {
      case "goRight":
        nav.current?.goRight(true, () => {});
        break;
      case "goLeft":
        nav.current?.goLeft(true, () => {});
        break;
      case "goTo":
        const link = nav.current?.publication.linkWithHref(detail.data as string);
        if (!link) {
          console.error("Link not found", detail.data);
          return;
        }
        nav.current?.goLink(link, true, () => {});
        break;
      default:
        console.error("Unknown reader-control event", ev);
    }
  };

  useEffect(() => {
    window.addEventListener("reader-control", handleReaderControl);
    
    return () => {
      window.removeEventListener("reader-control", handleReaderControl);
    }
  });

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    publication.current = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    let positionsList: Locator[] | undefined;

    publicationTitle.current = publication.current.metadata.title.getTranslation("en");
    
    dispatch(setRTL(publication.current.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.current.metadata.getPresentation()?.layout === EPUBLayout.fixed));

    setProgression(progression => progression = { ...progression, currentPublication: publicationTitle.current});

    const fetchPositions = async () => {
      const positionsJSON = publication.current?.manifest.links.findWithMediaType("application/vnd.readium.position-list+json");
      if (positionsJSON) {
        const fetcher = new HttpFetcher(undefined, selfHref);
        const fetched = fetcher.get(positionsJSON);
        try {
          const positionObj = await fetched.readAsJSON() as {total: number, positions: Locator[]};
          positionsList = positionObj.positions;
          setProgression(progression => progression = { ...progression, totalPositions: positionObj.total });
        } catch(err) {
          console.error(err)
        }
      }
    };

    fetchPositions()
      .catch(console.error);

      const handleResize = () => {
        if (nav && container.current) {
          const currentBreakpoint = RSPrefs.breakpoint < container.current.clientWidth
          dispatch(setBreakpoint(currentBreakpoint));
    
          const containerWidth = currentBreakpoint ? window.innerWidth - arrowsWidth.current : window.innerWidth;
          container.current.style.width = `${containerWidth}px`;
    
          if (nav.current?.layout === EPUBLayout.reflowable && optimalLineLength.current) {
            const colCount = autoPaginate(RSPrefs.breakpoint, containerWidth, optimalLineLength.current);
    
            applyReadiumCSSStyles({
              "--RS__colCount": `${colCount}`,
              "--RS__defaultLineLength": `${optimalLineLength.current}rem`,
              "--RS__pageGutter": `${RSPrefs.typography.pageGutter}px`
            });
          }
        }
      };
    
      const initReadingEnv = () => {
        if (nav.current?.layout === EPUBLayout.reflowable) {
          optimalLineLength.current = getOptimalLineLength({
            chars: RSPrefs.typography.lineLength,
            fontFace: fontStacks.RS__oldStyleTf,
            pageGutter: RSPrefs.typography.pageGutter,
          //  letterSpacing: 2,
          //  wordSpacing: 2,
          //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
          });
          handleResize();
        }
      }
    
      const handleProgression = (locator: Locator) => {
        const relativeRef = locator.title || Locale.reader.app.progression.referenceFallback;
        
        setProgression(progression => progression = { ...progression, currentPositions: nav.current?.currentPositionNumbers, relativeProgression: locator.locations.progression, currentChapter: relativeRef, totalProgression: locator.locations.totalProgression });
      }
    
      const handleTap = (event: FrameClickEvent) => {
        const oneQuarter = ((nav.current?._cframes.length === 2 ? nav.current._cframes[0]!.window.innerWidth + nav.current._cframes[1]!.window.innerWidth : nav.current!._cframes[0]!.window.innerWidth) * window.devicePixelRatio) / 4;
        if (event.x < oneQuarter) {
          nav.current?.goLeft(true, activateImmersiveOnAction);
        } 
        else if (event.x > oneQuarter * 3) {
          nav.current?.goRight(true, activateImmersiveOnAction);
        } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
          toggleImmersive();
        }
      }

    const p = new Peripherals({
      moveTo: (direction) => {
        if (direction === "right") {
          nav.current?.goRight(true, activateImmersiveOnAction);
        } else if (direction === "left") {
          nav.current?.goLeft(true, activateImmersiveOnAction);
        }
      },
      goProgression: (shiftKey) => {
        shiftKey 
          ? nav.current?.goBackward(true, activateImmersiveOnAction) 
          : nav.current?.goForward(true, activateImmersiveOnAction);
      },
      resize: () => {
        handleResize();
      }
    });

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        initReadingEnv();
        nav.current?._cframes.forEach(
          (frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) p.observe(frameManager.window);
          }
        );
        p.observe(window);
      },
      positionChanged: debounce(function (locator: Locator): void {
        window.focus();

        handleProgression(locator);
        localData.set(localDataKey.current, locator);
      }, 250),
      tap: function (_e: FrameClickEvent): boolean {
        handleTap(_e);
        return true;
      },
      click: function (_e: FrameClickEvent): boolean {
        toggleImmersive()
        return true;
      },
      zoom: function (_scale: number): void {},
      miscPointer: function (_amount: number): void {},
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
    
    const currentLocation = localData.get(localDataKey.current);

    nav.current = new EpubNavigator(container.current!, publication.current, listeners, positionsList, currentLocation);
    nav.current.load().then(() => {
      p.observe(window);
    });

    return () => {
      // Cleanup TODO!
      p.destroy();
      nav.current?.destroy();
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <main style={propsToCSSVars(RSPrefs.theming)}>
      <ReaderHeader 
        title = { publicationTitle.current } 
      />

      <nav className={arrowStyles.container} id={arrowStyles.left}>
        <ArrowButton 
          direction="left" 
          disabled={isPublicationStart}
        />
      </nav>

      <article id="wrapper" aria-label={Locale.reader.app.publicationWrapper}>
        <div id="container" ref={container}></div>
      </article>

      <nav className={arrowStyles.container} id={arrowStyles.right}>
        <ArrowButton 
          direction="right"  
          disabled={isPublicationEnd}
        />
      </nav>

      <aside className={isImmersive ? readerStateStyles.immersive : ""}  id="bottom-bar">
        <ProgressionOf 
          progression={progression} 
        />
      </aside>
    </main>
    </>
  );
};
