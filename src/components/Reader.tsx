"use client";

import "./reader.css";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout } from "@readium/shared";
import Peripherals from "@/helpers/peripherals";
import { useEffect, useRef } from "react";
import { ReaderFooter } from "./ReaderFooter";
import { ReaderHeader } from "./ReaderHeader";
import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { RSdefaults } from "@/defaults";
import { getOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  let nav: EpubNavigator | undefined;

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    const publication = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

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
        const colCount = autoPaginate(RSdefaults.breakpoint, container.current.clientWidth, optimalLineLength);

        nav._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) {
            frameManager.window.document.documentElement.style.setProperty("--RS__colCount", `${colCount}`);
            // Remove once v2 is merged
            frameManager.window.document.documentElement.style.setProperty("--RS__colWidth", `${"auto"}`);
            frameManager.window.document.documentElement.style.setProperty("--RS__defaultLineLength", `${optimalLineLength}px`);
            frameManager.window.document.documentElement.style.setProperty("--RS__pageGutter", `${RSdefaults.pageGutter}px`);
          }
        });
      }
    };

    const initReadingEnv = () => {
      if (nav.layout === EPUBLayout.reflowable) {
        optimalLineLength = getOptimalLineLength({
          chars: RSdefaults.lineLength,
          pageGutter: RSdefaults.pageGutter
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
      },
      tap: function (_e: FrameClickEvent): boolean {
        return false;
      },
      click: function (_e: FrameClickEvent): boolean {
        return false;
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
      <ReaderHeader title = { nav?.publication.metadata.title.getTranslation("en") } />

      <div id="wrapper">
        <main id="container" ref={container} aria-label="Publication"></main>
      </div>

      <ReaderFooter/>
    </>
  );
};
