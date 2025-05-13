"use client";

import { useContext, useEffect, useState } from "react";

import { HttpFetcher } from "@readium/shared";
import { Link } from "@readium/shared";

import "../app.css";

import dynamic from "next/dynamic";
const Reader = dynamic<{ rawManifest: object; selfHref: string }>(() => import("../../components/Reader").then((mod) => mod.Reader), { ssr: false });

import { Loader } from "@/components/Loader";

import { useTheming } from "@/packages/Hooks/useTheming";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ThemeKeys } from "@/models/theme";
import { PreferencesContext } from "@/preferences";
import { 
  setBreakpoint, 
  setColorScheme, 
  setContrast, 
  setForcedColors, 
  setMonochrome, 
  setReducedMotion, 
  setReducedTransparency 
} from "@/lib/themeReducer";

import { propsToCSSVars } from "@/packages/Helpers/propsToCSSVars";

// TODO page metadata w/ generateMetadata

export default function ReaderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [isClient, setIsClient] = useState(false);
  const [params, setParams] = useState<{ [key: string]: string | string[] | undefined } | null>(null);
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);

  const readerIsLoading = useAppSelector(state => state.reader.isLoading);

  const RSPrefs = useContext(PreferencesContext);
  const theme = useAppSelector(state => state.theming.theme);

  const dispatch = useAppDispatch();

  // Init theming (breakpoints, theme, media queries…)
  useTheming<Exclude<ThemeKeys, ThemeKeys.auto>>({ 
    theme: theme,
    lightKey: ThemeKeys.light,
    darkKey: ThemeKeys.dark,
    themeKeys: RSPrefs.theming.themes.keys,
    breakpointsMap: RSPrefs.theming.breakpoints,
    initProps: {
      ...propsToCSSVars(RSPrefs.theming.arrow, "arrow"), 
      ...propsToCSSVars(RSPrefs.theming.icon, "icon"),
      ...propsToCSSVars(RSPrefs.theming.layout, "layout")
    },
    onBreakpointChange: (breakpoint) => dispatch(setBreakpoint(breakpoint)),
    onColorSchemeChange: (colorScheme) => dispatch(setColorScheme(colorScheme)),
    onContrastChange: (contrast) => dispatch(setContrast(contrast)),
    onForcedColorsChange: (forcedColors) => dispatch(setForcedColors(forcedColors)),
    onMonochromeChange: (isMonochrome) => dispatch(setMonochrome(isMonochrome)),
    onReducedMotionChange: (reducedMotion) => dispatch(setReducedMotion(reducedMotion)),
    onReducedTransparencyChange: (reducedTransparency) => dispatch(setReducedTransparency(reducedTransparency))
  });

  useEffect(() => {
    setIsClient(true);
    searchParams.then((params) => setParams(params));
  }, [searchParams]);

  useEffect(() => {
    if (params && isClient) {
      let book = "moby-dick";
      let publicationURL = "";
      if (params["book"]) {
        book = Array.isArray(params["book"]) ? params["book"][0] : params["book"];
      }
      
      if (book.startsWith("http://") || book.startsWith("https://")) {
        // TODO: use URL.canParse()
        publicationURL = book;
        if (!book.endsWith("manifest.json") && !book.endsWith("/"))
          publicationURL += "/";
      } else {
        throw new Error("book parameter is required");
      }
  
      const manifestLink = new Link({ href: "manifest.json" });
      const fetcher = new HttpFetcher(undefined, publicationURL);
      const fetched = fetcher.get(manifestLink);
      fetched.link().then((link) => {
        setSelfLink(link.toURL(publicationURL));
      });

      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ publicationURL }: ${ error.message }`);
      });
    }
  }, [params, isClient]);

  return (
    <>
    { error 
      ? <span>{ error }</span> 
      : <Loader isLoading={ readerIsLoading }>
          { isClient && manifest && selfLink && <Reader rawManifest={ manifest } selfHref={ selfLink } /> }
        </Loader>        
    }
    </>
  );
}