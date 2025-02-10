import { useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

export const useMediaQuery = (query: string | null) => {
  const isClient = useIsClient();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!isClient || !query) return;

    const mq = window.matchMedia(query);

    // Checking if media query is supported or well-formed
    // The media property is the normalized and resolved string representation of the query. 
    // If matchMedia encounters something it doesn’t understand, that changes to "not all"
    const resolvedMediaQuery = mq.media;
    if (query !== resolvedMediaQuery) {
      console.error("Either this query is not supported or not well formed. Please double-check.");
      return;
    };

    if (mq.matches !== matches) {
      setMatches(mq.matches);
    }

    const handleMatch = () => setMatches(mq.matches);
    mq.addEventListener("change", handleMatch);

    return () => mq.removeEventListener("change", handleMatch);
  }, [isClient, matches, query]);

  return matches;
}