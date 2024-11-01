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

export class ScrollAffordance {
  public wrapper: HTMLDivElement | null = null;
  private container: Document | null = null;
  private pref: ScrollAffordancePref;
  private placement: "top" | "bottom";
  public id: string;
  public className: string;
  public styleSheet: HTMLStyleElement | null = null;
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
    styleSheet.id = "scroll-affordance-stylesheet";
    styleSheet.dataset.readium = "true";
    styleSheet.textContent = cssContent || `.playground-scroll-affordance-wrapper {
      display: flex;
      width: 100%;
      gap: 20px;
    }
    #playground-scroll-affordance-wrapper-top {
      margin-bottom: 1.5rem;
    }
    #playground-scroll-affordance-wrapper-bottom {
      margin: 1.5rem 0;
    }
    .playground-scroll-affordance-wrapper > a {
      box-sizing: border-box;
      border: 1px solid ${RSPrefs.theming.color.subdued};
      border-radius: 3px;
      padding: 0.75rem;
      box-sizing: border-box;
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

  public render = (container: Document) => {
    if (this.pref !== ScrollAffordancePref.none) {
      this.container = container;

      let prevAnchor: HTMLAnchorElement | undefined;
      let nextAnchor: HTMLAnchorElement | undefined;
        
      if ((this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.prev) ) {
        prevAnchor = document.createElement("a");
        prevAnchor.className = `playground-scroll-affordance-button-prev`;
        prevAnchor.id = `playground-scroll-affordance-button-prev-${ this.placement }`;
        prevAnchor.href = ScrollActions.prev;
        prevAnchor.innerHTML = `<span>${ Locale.reader.navigation.scroll.prevLabel }</span>`;
      }
        
      if ((this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.next)) {
        nextAnchor = document.createElement("a");
        nextAnchor.className = `playground-scroll-affordance-button-next`;
        nextAnchor.id = `<a id="playground-scroll-affordance-button-next-${ this.placement }`;
        nextAnchor.href = ScrollActions.next;
        nextAnchor.innerHTML = `<span>${ Locale.reader.navigation.scroll.nextLabel }</span>`
      }

      if (prevAnchor || nextAnchor) {
        this.wrapper = document.createElement("div");
        this.wrapper.id = `playground-scroll-affordance-wrapper-${this.placement}`; 
        this.wrapper.className = this.className || "playground-scroll-affordance-wrapper";
        this.wrapper.dataset.playground = "true";

        if (prevAnchor) this.wrapper.append(prevAnchor);
        if (nextAnchor) this.wrapper.append(nextAnchor);
      }
    }

    if (this.container && this.wrapper) {
      this.styleSheet = this.createStyleSheet(this.styleSheetContent);
      this.container.head.append(this.styleSheet);
      this.placement === "top" ? this.container.body.prepend(this.wrapper) : this.container.body.append(this.wrapper);
    }
  }

  public destroy = () => {
    this.styleSheet?.remove();
    this.wrapper?.remove();
  }
}