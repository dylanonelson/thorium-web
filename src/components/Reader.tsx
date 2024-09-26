"use client";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";
import fontStacks from "readium-css/css/vars/fontStacks.json";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";

import Peripherals from "@/helpers/peripherals";
import { useEffect, useState, useRef } from "react";

import { ArrowButton } from "./ArrowButton";
import { ReaderFooter } from "./ReaderFooter";
import { ReaderHeader } from "./ReaderHeader";

import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { getOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  let nav: EpubNavigator | undefined;
  let isRTL: boolean = false;

  const [immersive, setImmersive] = useState(false);
  const [fullscreen, setFullscren] = useState(false);
  const [publicationStart, setPublicationStart] = useState(true);
  const [publicationEnd, setPublicationEnd] = useState(false);
  const [breakpointReached, setBreakpointReached] = useState(false);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    const publication = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    isRTL = (publication.metadata.effectiveReadingProgression === ReadingProgression.rtl);

    const p = new Peripherals({
      moveTo: (direction) => {
        if (direction === "right") {
          nav.goRight(true, () => {});
        } else if (direction === "left") {
          nav.goLeft(true, () => {});
        }
      },
      goProgression: (shiftKey) => {
        shiftKey 
          ? nav.goBackward(true, () => {}) 
          : nav.goForward(true, () => {});
      },
      resize: () => {
        handleResize();
      }
    });

    let optimalLineLength: number;

    const handleResize = () => {
      if (nav && container.current) {
        const breakpointStatus = RSPrefs.breakpoint < container.current.clientWidth;
        setBreakpointReached(breakpointStatus);

        const containerWidth = breakpointStatus ? window.innerWidth - (2 * (RSPrefs.arrowSize || 32)) : window.innerWidth;
        container.current.style.width = `${containerWidth}px`;

        const colCount = autoPaginate(RSPrefs.breakpoint, containerWidth, optimalLineLength);

        nav._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) {
            frameManager.window.document.documentElement.style.setProperty("--RS__colCount", `${colCount}`);
            frameManager.window.document.documentElement.style.setProperty("--RS__defaultLineLength", `${optimalLineLength}rem`);
            frameManager.window.document.documentElement.style.setProperty("--RS__pageGutter", `${RSPrefs.pageGutter}px`);
          }
        });
      }
    };

    const initReadingEnv = () => {
      if (nav.layout === EPUBLayout.reflowable) {
        optimalLineLength = getOptimalLineLength({
          chars: RSPrefs.lineLength,
          fontFace: fontStacks.RS__oldStyleTf,
          pageGutter: RSPrefs.pageGutter,
        //  letterSpacing: 2,
        //  wordSpacing: 2,
        //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
        });
        handleResize();
      }
    }

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        initReadingEnv();
        nav._cframes.forEach(
          (frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) p.observe(frameManager.window);
          }
        );
        p.observe(window);
      },
      positionChanged: function (_locator: Locator): void {
        window.focus();
        
        // Start of publication
        if (_locator.locations.totalProgression === 0) {
          setPublicationStart(true);
        } else {
          setPublicationStart(false);
        }

        // End of publication TBD
      },
      tap: function (_e: FrameClickEvent): boolean {
        return false;
      },
      click: function (_e: FrameClickEvent): boolean {
        return false;
      },
      zoom: function (_scale: number): void {},
      miscPointer: function (_amount: number): void {
        setImmersive(immersive => !immersive);
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
    const nav = new EpubNavigator(container.current!, publication, listeners);
    nav.load().then(() => {
      p.observe(window);

      window.addEventListener("reader-control", (ev) => {
        const detail = (ev as CustomEvent).detail as {
          command: string;
          data: unknown;
        };
        switch (detail.command) {
          case "goRight":
            nav.goRight(true, () => {});
            break;
          case "goLeft":
            nav.goLeft(true, () => {});
            break;
          case "goTo":
            const link = nav.publication.linkWithHref(detail.data as string);
            if (!link) {
              console.error("Link not found", detail.data);
              return;
            }
            nav.goLink(link, true, () => {});
            break;
          default:
            console.error("Unknown reader-control event", ev);
        }
      });
    });

    return () => {
      // Cleanup TODO!
      p.destroy();
      nav.destroy();
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <main>
      <ReaderHeader 
        className={immersive ? "immersive" : ""} 
        title = { nav?.publication.metadata.title.getTranslation("en") } 
      />

      <nav className={arrowStyles.container} id={arrowStyles.left}>
        <ArrowButton 
          direction="left" 
          className={(immersive && !breakpointReached || fullscreen || publicationStart) ? arrowStyles.hidden : immersive ? arrowStyles.immersive : ""} 
          isRTL={isRTL} 
          disabled={publicationStart}
        />
      </nav>

      <article id="wrapper" aria-label={Locale.reader.app.publicationWrapper}>
        <div id="container" ref={container}></div>
      </article>

      <nav className={arrowStyles.container} id={arrowStyles.right}>
        <ArrowButton 
          direction="right" 
          className={(immersive && !breakpointReached || fullscreen || publicationEnd) ? arrowStyles.hidden : immersive ? arrowStyles.immersive : ""} 
          isRTL={isRTL} 
          disabled={publicationEnd}
        />
      </nav>

      <ReaderFooter
        className={immersive ? "immersive" : ""}
      />
    </main>
    </>
  );
};
