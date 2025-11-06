export const PUBLICATION_MANIFESTS = {
  // url safe base64 encoded file name: e.g. (Python)
  // base64.urlsafe_b64encode("name.epub".encode()).decode().rstrip("=")
  "david-copperfield":
    "http://localhost:15080/ZGF2aWQtY29wcGVyZmllbGQuZXB1Yg/manifest.json",
  "anna-karenina":
    "http://localhost:15080/YW5uYS1rYXJlbmluYS5lcHVi/manifest.json",
} as const;
