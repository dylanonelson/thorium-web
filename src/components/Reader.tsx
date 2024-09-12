"use client";

import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./reader.css";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher } from "@readium/shared";
import Peripherals from "@/helpers/peripherals";
import { useEffect, useRef } from "react";

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
      menu: (_show) => {
        // No UI that hides/shows at the moment
      },
      goProgression: (_shiftKey) => {
        nav.goForward(true, () => {});
      },
    });

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        /*nav._cframes.forEach((frameManager: FrameManager | FXLFrameManager) => {
                        frameManager.msg!.send(
                            "set_property",
                            ["--USER__colCount", 1],
                            (ok: boolean) => (ok ? {} : {})
                        );
                    })*/
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
    console.log("load new nav!", selfHref, rawManifest);
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
            nav.goLink(link, true, (ok) => {
              // Hide TOC dialog if navigation was a success
              if (ok)
                (
                  document.getElementById("toc-dialog") as HTMLDialogElement
                ).close();
            });
            break;
          case "settings":
            (
              document.getElementById("settings-dialog") as HTMLDialogElement
            ).show();
            break;
          case "toc":
            // Seed TOC
            const container = document.getElementById(
              "toc-list"
            ) as HTMLElement;
            container
              .querySelectorAll(":scope > md-list-item, :scope > md-divider")
              .forEach((e) => e.remove()); // Clear TOC

            if (nav.publication.tableOfContents) {
              const template = container.querySelector(
                "template"
              ) as HTMLTemplateElement;
              nav.publication.tableOfContents.items.forEach((item) => {
                const clone = template.content.cloneNode(true) as HTMLElement;

                // Link
                const element: unknown = clone.querySelector("md-list-item")!;
                (element as HTMLAnchorElement).href = `javascript:control('goTo', '${item.href}')`;

                // Title
                const headlineSlot = (element as HTMLElement).querySelector(
                  "div[slot=headline]"
                ) as HTMLDivElement;
                headlineSlot.innerText = item.title || "[Untitled]";

                // Href for debugging
                const supportingTextSlot = (element as HTMLElement).querySelector(
                  "div[slot=supporting-text]"
                ) as HTMLDivElement;
                supportingTextSlot.innerText = item.href;

                container.appendChild(clone);
              });
            } else {
              container.innerText = "TOC is empty";
            }

            // Show the TOC dialog
            (document.getElementById("toc-dialog") as HTMLDialogElement).show();
            break;
          default:
            console.error("Unknown reader-control event", ev);
        }
      });
    });

    return () => {
      // Cleanup TODO!
      console.log("destroy nav");
      p.destroy();
      nav.destroy();
    };
  }, [rawManifest, selfHref]);

  const control = (command: any, data?: any) => {
    window.dispatchEvent(
      new CustomEvent("reader-control", { detail: {
        command: command,
        data: data
      }})
    );
  }

  return (
    <>
      <header id="top-bar" aria-label="Top Bar">
        <h3 aria-label="Publication title">
          {nav
            ? nav.publication.metadata.title.getTranslation("en")
            : "Loading..."}
        </h3>
        <div>
          <IconButton
            title="Table of Contents"
            onClick={() => {
              // control('toc')
            }}
          >
            <ListIcon></ListIcon>
          </IconButton>
          <IconButton
            title="Settings"
            onClick={() => {
              // control('settings')
            }}
          >
            <SettingsIcon></SettingsIcon>
          </IconButton>
        </div>
      </header>

      <div id="wrapper">
        <main id="container" ref={container} aria-label="Publication"></main>
      </div>

      <footer id="bottom-bar" aria-label="Bottom Bar">
        <IconButton
          title="Go left"
          onClick={() => {
            control("goLeft")
          }}
        >
          <ArrowBackIcon></ArrowBackIcon>
        </IconButton>
        <IconButton
          title="Go right"
          onClick={() => {
            control("goRight")
          }}
        >
          <ArrowForwardIcon></ArrowForwardIcon>
        </IconButton>
      </footer>
    </>
  );
};
