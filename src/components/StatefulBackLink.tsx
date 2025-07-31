"use client";

import React from "react";

import backLinkStyles from "./assets/styles/backLink.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { ThBackLinkVariant } from "@/preferences/models/enums";

import { ThHome } from "@/core/Components/Links";
import { ThLibrary } from "@/core/Components/Links";
import { ThLink } from "@/core/Components/Links";

import { useI18n } from "@/i18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

export const StatefulBackLink = ({ 
  className 
}: { 
  className?: string 
}) => {
  const { t } = useI18n();
  const RSPrefs = usePreferences();
  
  const variant = RSPrefs.header.backLink?.variant || ThBackLinkVariant.home;
  const href = RSPrefs.header.backLink?.href;
  const content = RSPrefs.header.backLink?.content;

  const compounds = {
    tooltipTrigger: {
      delay: RSPrefs.theming.arrow.tooltipDelay,
      closeDelay: RSPrefs.theming.arrow.tooltipDelay
    },
    tooltip: {
      className: readerSharedUI.tooltip
    },
    label: t("reader.app.header.backLink.tooltip")
  };

  if (!href) return null;

  switch (variant) {
    case ThBackLinkVariant.home:
      return (
        <div className={ className }>
          <ThHome 
            className={ backLinkStyles.backLink } 
            href={ href } 
            aria-label={ t("reader.app.header.backLink.trigger") }
            compounds={ compounds }
          />
        </div>
      );

    case ThBackLinkVariant.library:
      return (
        <div className={ className }>
          <ThLibrary 
            className={ backLinkStyles.backLink } 
            href={ href } 
            aria-label={ t("reader.app.header.backLink.trigger") }
            compounds={ compounds }
          />
        </div>
      );

    default:
      if (!content) return null;
      
      let contentNode: React.ReactNode = null;
      
      switch (content.type) {
        case "img":
          contentNode = <img alt={ content.alt ?? "" } src={ content.src } />;
          break;
          
        case "svg":
          // Parse the SVG string
          const parser = new DOMParser();
          const doc = parser.parseFromString(content.content, "image/svg+xml");
          const svgElement = doc.documentElement;
          
          // Extract all attributes
          const attributes: Record<string, string> = {};
          for (const { name, value } of Array.from(svgElement.attributes)) {
            attributes[name] = value;
          }
            
          // Create the SVG element with all its original attributes
          contentNode = React.createElement("svg", {
            ...attributes,
            "aria-hidden": "true",
            focusable: "false",
            xmlns: "http://www.w3.org/2000/svg",
            dangerouslySetInnerHTML: { 
              __html: svgElement.innerHTML 
            }
          });
          break;
      }
      
      return (
        <div className={ className }>
          <ThLink 
            className={ backLinkStyles.backLink } 
            href={ href } 
            aria-label={ t("reader.app.header.backLink.trigger") }
            compounds={ compounds }
          >
            { contentNode }
          </ThLink>
        </div>
      );
  }
}