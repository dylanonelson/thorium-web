import { useEffect, useState } from "react";

export const useMediaQuery = (query: string | null) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!query) return; 

    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const handleMatch = () => setMatches(media.matches);
    media.addEventListener("change", handleMatch);

    return () => media.removeEventListener("change", handleMatch);
  }, [matches, query]);

  return matches;
}