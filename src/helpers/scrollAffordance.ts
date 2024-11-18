import { RSPrefs, ScrollAffordancePref } from "@/preferences";
import Locale from "../resources/locales/en.json";

export interface IScrollAffordanceConfig {
  pref: ScrollAffordancePref;
  placement: "top" | "bottom";
  className?: string;
  styleSheetContent?: string;
}

// Button posting message from iFrame won’t work since Navigator handles click
// so the message is never received.
// Link href is relative to selfhref but https and http links are
// handled as external links in Reader, opening a new window.
// Trying a custom scheme to avoid conflicts and progress on scroll for MVP
// but not particularly happy about that.
// React Portal has a lots of caveats too but it may at least protect
// the component from Navigator’s handling, although I’m not 100% sure yet.
export const CUSTOM_SCHEME = "readium-playground:";
export enum ScrollActions {
  prev = CUSTOM_SCHEME + "go_prev",
  next = CUSTOM_SCHEME + "go_next"
}
const STYLESHEET_ID = "scroll-affordance-stylesheet"

export class ScrollAffordance {
  private pref: ScrollAffordancePref;
  private placement: "top" | "bottom";
  public id: string;
  public className: string;
  private styleSheetContent?: string;

  constructor(config: IScrollAffordanceConfig) {
    this.pref = config.pref;
    this.placement = config.placement;
    this.id = `playground-scroll-affordance-wrapper-${config.placement}`;
    this.className = config.className || "playground-scroll-affordance-wrapper";
    this.styleSheetContent = config.styleSheetContent;
  }

  private createStyleSheet = (cssContent?: string) => {
    const styleSheet = document.createElement("style");
    styleSheet.id = STYLESHEET_ID;
    styleSheet.dataset.readium = "true";
    styleSheet.textContent = cssContent || `.playground-scroll-affordance-wrapper {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      gap: 20px;
    }
    .playground-scroll-affordance-wrapper:focus-within {
      /* to get around hidden overflow cutting off focus ring w/o being too noticeable */
      padding: 0 2px;
    }
    #playground-scroll-affordance-wrapper-top {
      /* to get around hidden overflow cutting off focus ring */
      padding-top: 0.25rem;
      margin-bottom: 1.25rem;
    }
    #playground-scroll-affordance-wrapper-bottom {
      margin-top: 1.5rem;
      /* to get around hidden overflow cutting off focus ring */
      padding-bottom: 1.5rem;
    }
    .playground-scroll-affordance-wrapper > a {
      box-sizing: border-box;
      border: 1px solid ${RSPrefs.theming.color.subdued};
      border-radius: 3px;
      padding: 0.75rem;
      text-decoration: none;
      font-weight: bold;
      flex: 1 1 0;
      text-align: left;
    }
    .playground-scroll-affordance-wrapper > a:first-child:not(:last-child) {
      text-align: right;
    }
    .playground-scroll-affordance-wrapper > a.playground-scroll-affordance-button-prev > span:before {
      content: "←";
      float: left;
      margin-right: 10px;
      color: ${RSPrefs.theming.color.subdued};
    }
    .playground-scroll-affordance-wrapper > a.playground-scroll-affordance-button-next > span:after {
      content: "→";
      float: right;
      margin-left: 10px;
      color: ${RSPrefs.theming.color.subdued};
    }`;
    return styleSheet;
  };

  public render = (doc: Document) => {
    if (doc) {
      // Prevent duplicates
      this.destroy(doc);

      let wrapper: HTMLElement | null = null;

      if (this.pref !== ScrollAffordancePref.none) {
        let prevAnchor: HTMLAnchorElement | undefined;
        let nextAnchor: HTMLAnchorElement | undefined;

        if ((this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.prev)) {
          prevAnchor = doc.createElement("a");
          prevAnchor.className = `playground-scroll-affordance-button-prev`;
          prevAnchor.id = `playground-scroll-affordance-button-prev-${this.placement}`;
          prevAnchor.href = ScrollActions.prev;

          // In practice browsers don’t do anything with this? And since the href
          // is a custom scheme, they wouldn’t be able to preload the document
          // that is handled by navigator anyway. So not sure it hurts or has any benefit…
          prevAnchor.rel = "prev";
          prevAnchor.setAttribute("aria-label", Locale.reader.navigation.scroll.prevA11yLabel);

          prevAnchor.innerHTML = `<span>${Locale.reader.navigation.scroll.prevLabel}</span>`;
        }

        if ((this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.next)) {
          nextAnchor = doc.createElement("a");
          nextAnchor.className = `playground-scroll-affordance-button-next`;
          nextAnchor.id = `<a id="playground-scroll-affordance-button-next-${this.placement}`;
          nextAnchor.href = ScrollActions.next;

          // In practice browsers don’t do anything with this? And since the href
          // is a custom scheme, they wouldn’t be able to preload the document
          // that is handled by navigator anyway. So not sure it hurts or has any benefit…
          nextAnchor.rel = "next";
          nextAnchor.setAttribute("aria-label", Locale.reader.navigation.scroll.nextA11yLabel);

          nextAnchor.innerHTML = `<span>${Locale.reader.navigation.scroll.nextLabel}</span>`
        }

        if (prevAnchor || nextAnchor) {
          wrapper = doc.createElement("nav");
          wrapper.id = `playground-scroll-affordance-wrapper-${this.placement}`;
          wrapper.className = this.className || "playground-scroll-affordance-wrapper";
          wrapper.dataset.playground = "true";
          wrapper.setAttribute("aria-label", Locale.reader.navigation.scroll.wrapper);

          if (prevAnchor) wrapper.append(prevAnchor);
          if (nextAnchor) wrapper.append(nextAnchor);
        }
      }

      if (wrapper) {
        const styleSheet = this.createStyleSheet(this.styleSheetContent);
        doc.head.append(styleSheet);
        this.placement === "top" ? doc.body.prepend(wrapper) : doc.body.append(wrapper);
      }
    }
  }

  public destroy = (doc: Document) => {
    if (doc) {
      const stylesheet = doc.getElementById(`#${ STYLESHEET_ID }`);
      if (stylesheet) stylesheet.remove();

      const wrapper = doc.getElementById(this.id);
      if (wrapper) {
        wrapper.remove();
      }
    }
  }
}