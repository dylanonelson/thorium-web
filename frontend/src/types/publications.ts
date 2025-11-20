export type PublicationConfig = {
  id: string;
  title: string;
  author: string;
  filename: string;
  manifestUrl: string;
  urlSlug: string;
};

export type PublicationManifestMap = Record<string, PublicationConfig>;
