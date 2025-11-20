import type {
  PublicationConfig,
  PublicationManifestMap,
} from "@/types/publications";

const manifestMap = Object.freeze(
  parseManifestEnv(process.env.NEXT_PUBLIC_PUBLICATION_MANIFESTS),
);

export const PUBLICATION_MANIFESTS: Readonly<PublicationManifestMap> =
  manifestMap;

function parseManifestEnv(rawValue?: string): PublicationManifestMap {
  if (!rawValue) {
    logManifestWarning("No publication catalog was injected into the build.");
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, PublicationConfig>>(
      (acc, [key, value]) => {
        if (
          typeof key !== "string" ||
          !key.trim() ||
          !value ||
          typeof value !== "object"
        ) {
          logManifestWarning(
            "Invalid key or value found in publication catalog",
          );
          return acc;
        }
        const entry = value as Record<string, unknown>;
        const manifestUrl =
          typeof entry.manifestUrl === "string" ? entry.manifestUrl : "";
        const id = typeof entry.id === "string" ? entry.id : key;
        const title = typeof entry.title === "string" ? entry.title : "";
        const author = typeof entry.author === "string" ? entry.author : "";
        const filename =
          typeof entry.filename === "string" ? entry.filename : "";
        const urlSlug = typeof entry.urlSlug === "string" ? entry.urlSlug : "";

        if (!manifestUrl) {
          return acc;
        }

        acc[key] = { id, title, author, filename, manifestUrl, urlSlug };
        return acc;
      },
      {},
    );
  } catch (error) {
    logManifestWarning("Failed to parse injected publication catalog.", error);
    return {};
  }
}

function logManifestWarning(message: string, error?: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (error) {
    console.warn(`[publications] ${message}`, error);
    return;
  }

  console.warn(`[publications] ${message}`);
}
