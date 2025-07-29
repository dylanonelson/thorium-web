"use client";

import Locale from "@/resources/locales/en.json";

import backLinkStyles from "./assets/styles/backLink.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { ThBackLinkVariant } from "@/preferences/models/enums";

import { ThHome } from "@/core/Components/Links";
import { ThLibrary } from "@/core/Components/Links";
import { ThLink } from "@/core/Components/Links";

import { usePreferences } from "@/preferences/hooks/usePreferences";

export const StatefulBackLink = ({ 
  className 
}: { 
  className?: string 
}) => {
  const RSPrefs = usePreferences();
  
  const variant = RSPrefs.header.backLink?.variant || ThBackLinkVariant.home;
  const href = RSPrefs.header.backLink?.href;
  const img = RSPrefs.header.backLink?.img;

  const compounds = {
    tooltipTrigger: {
      delay: RSPrefs.theming.arrow.tooltipDelay,
      closeDelay: RSPrefs.theming.arrow.tooltipDelay
    },
    tooltip: {
      className: readerSharedUI.tooltip
    },
    label: Locale.reader.app.header.backLink.tooltip
  };

  if (!href) return null;

  switch (variant) {
    case ThBackLinkVariant.home:
      return (
        <div className={ className }>
          <ThHome 
            className={ backLinkStyles.backLink } 
            href={ href } 
            aria-label={ Locale.reader.app.header.backLink.trigger }
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
            aria-label={ Locale.reader.app.header.backLink.trigger }
            compounds={ compounds }
          />
        </div>
      );

    default:
      if (img) {
        return (
          <div className={ className }>
            <ThLink 
              className={ backLinkStyles.backLink } 
              href={ href } 
              aria-label={ Locale.reader.app.header.backLink.trigger }
              compounds={ compounds }
            >
              <img alt={ img.alt ?? "" } src={ img.src } />
            </ThLink>
          </div>
        );
      }
      
      return null;
  }
}