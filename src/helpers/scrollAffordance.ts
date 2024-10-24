import { ScrollAffordancePref } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { Link } from "@readium/shared";

export interface IScrollAffordanceLinks {
  prev?: Link;
  next?: Link;
}

export interface IScrollAffordanceConfig {
  pref: ScrollAffordancePref;
  links: IScrollAffordanceLinks;
  placement: "top" | "bottom";
  className?: string;
  styleSheetContent?: string;
}

export class ScrollAffordance {
  public wrapper: HTMLDivElement | null = null;
  private container: Document | null = null;
  private pref: ScrollAffordancePref;
  private links: IScrollAffordanceLinks;
  private placement: "top" | "bottom";
  public id: string;
  public className: string;
  public styleSheet: HTMLStyleElement;

  constructor(config: IScrollAffordanceConfig) {
    this.pref = config.pref;
    this.links = config.links;
    this.placement = config.placement;
    this.id = `playground-scroll-affordance-wrapper-${config.placement}`;
    this.className = config.className || "playground-scroll-affordance-wrapper";
    this.styleSheet = ScrollAffordance.createStyleSheet(config.styleSheetContent);
  }

  private static createStyleSheet = (cssContent?: string) => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "scroll-affordance-stylesheet";
    styleSheet.dataset.readium = "true";
    styleSheet.textContent = cssContent || `.playground-scroll-affordance-wrapper {
      display: flex;
      width: 100%;
      gap: 20px;
      justify-content: space-between;
    }
    #playground-scroll-affordance-wrapper-top {
      margin-bottom: 1.5rem;
    }
    #playground-scroll-affordance-wrapper-bottom {
      margin-top: 1.5rem;
    }
    .playground-scroll-affordance-wrapper > a {
      box-sizing: border-box;
      border: 1px solid currentColor;
      border-radius: 3px;
      padding: 0.75rem;
      text-decoration: none;
      font-weight: bold;
      flex: 1 0 auto;
    }
    .playground-scroll-affordance-wrapper > a:first-child:not(:last-child) {
      text-align: right;
    }
    .playground-scroll-affordance-wrapper > a > span {
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.75;
      display: block;
    }`;
    return styleSheet;
  };

  public create = (container: Document) => {
    if (this.pref !== ScrollAffordancePref.none) {
      this.container = container; 
      this.wrapper = document.createElement("div");
      this.wrapper.id = `playground-scroll-affordance-wrapper-${this.placement}`; 
      this.wrapper.className = this.className || "playground-scroll-affordance-wrapper";
      this.wrapper.dataset.playground = "true";
        
      if (this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.prev) {
        this.wrapper.innerHTML = `<a id="playground-scroll-affordance-button-prev-${ this.placement }" href=${ this.links.prev?.href }><span>${ Locale.reader.navigation.scroll.prevLabel }</span> ${ this.links.prev?.title || Locale.reader.navigation.scroll.prevTitleFallback }</a>`;
      }
        
      if (this.pref === ScrollAffordancePref.both || this.pref === ScrollAffordancePref.next) {
        this.wrapper.innerHTML += `<a id="playground-scroll-affordance-button-next-${ this.placement }" href=${ this.links.next?.href }><span>${ Locale.reader.navigation.scroll.nextLabel }</span> ${ this.links.next?.title || Locale.reader.navigation.scroll.nextTitleFallback }</a>`;
      }
    }

    if (this.container && this.wrapper) {
      this.container.head.append(this.styleSheet);
      this.placement === "top" ? this.container.body.prepend(this.wrapper) : this.container.body.append(this.wrapper);
    }
  }

  public update = (container: Document, links: IScrollAffordanceLinks) => {
    this.destroy;
    this.links = links;
    this.create(container);
  }

  public destroy = () => {
    this.styleSheet.remove();
    this.wrapper?.remove();
  }
}