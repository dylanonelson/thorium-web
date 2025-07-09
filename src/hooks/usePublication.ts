import { useEffect, useState } from "react";
import { Link } from "@readium/shared";
import { HttpFetcher } from "@readium/shared";
import { MANIFEST_CONFIG } from "@/config/manifest";
import { useAppSelector } from "@/lib/hooks";

export interface UsePublicationOptions {
  url: string;
  onError?: (error: string) => void;
}

export function usePublication({ url, onError = () => {} }: UsePublicationOptions) {
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);
  const readerIsLoading = useAppSelector(state => state.reader.isLoading);

  // Validate manifest URL in production
  useEffect(() => {
    if (!MANIFEST_CONFIG.enabled) {
      setError("Manifest route is disabled in production mode");
      return;
    }

    // If in production and not force enabled, check domain whitelist
    if (process.env.NODE_ENV === "production" && !MANIFEST_CONFIG.forceEnable) {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      if (!MANIFEST_CONFIG.allowedDomains.includes(domain)) {
        setError(`Manifest from domain ${ domain } is not allowed`);
        return;
      }
    }
  }, [url]);

  // Fetch manifest
  useEffect(() => {
    if (!url) {
      setError("Manifest URL is required");
      return;
    }

    // Decode URL if needed
    const decodedUrl = decodeURIComponent(url);
    const manifestLink = new Link({ href: decodedUrl });
    const fetcher = new HttpFetcher(undefined);

    try {
      const fetched = fetcher.get(manifestLink);
      
      // Get self-link first
      fetched.link().then((link) => {
        setSelfLink(link.toURL(decodedUrl));
      });

      // Then get manifest data
      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ decodedUrl }: ${ error instanceof Error ? error.message : "Unknown error" }`);
      });
    } catch (error: unknown) {
      console.error("Error loading manifest:", error);
      setError(`Failed loading manifest ${ decodedUrl }: ${ error instanceof Error ? error.message : "Unknown error" }`);
    }
  }, [url]);

  // Call onError callback when error changes
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  return {
    error,
    manifest,
    selfLink,
    isLoading: readerIsLoading
  };
}
