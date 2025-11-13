package publications

import (
	"os"
	"path/filepath"
	"testing"
)

func TestResolvePublicationPath(t *testing.T) {
	ResetStoreCache()

	tmpDir := t.TempDir()
	writeCatalog(t, tmpDir, `---
- id: "book-epub"
  title: "Epub Title"
  author: "Author One"
  filename: "book-epub.epub"
- id: "book-dir"
  title: "Dir Title"
  author: "Author Two"
  filename: "book-dir"
`)

	epubPath := filepath.Join(tmpDir, "book-epub.epub")
	if err := os.WriteFile(epubPath, []byte("dummy"), 0o644); err != nil {
		t.Fatalf("write epub: %v", err)
	}

	dirPath := filepath.Join(tmpDir, "book-dir")
	if err := os.MkdirAll(dirPath, 0o755); err != nil {
		t.Fatalf("mkdir book-dir: %v", err)
	}

	got, err := ResolvePublicationPath(tmpDir, "book-epub")
	if err != nil {
		t.Fatalf("ResolvePublicationPath epub: %v", err)
	}
	if got != epubPath {
		t.Fatalf("epub path mismatch: got %q want %q", got, epubPath)
	}

	got, err = ResolvePublicationPath(tmpDir, "book-dir")
	if err != nil {
		t.Fatalf("ResolvePublicationPath dir: %v", err)
	}
	if got != dirPath {
		t.Fatalf("dir path mismatch: got %q want %q", got, dirPath)
	}

	if _, err := ResolvePublicationPath(tmpDir, "missing"); err == nil {
		t.Fatalf("expected error for missing publication")
	}
}

func TestGetPublicationMetadata(t *testing.T) {
	ResetStoreCache()

	tmpDir := t.TempDir()
	writeCatalog(t, tmpDir, `---
- id: "book-1"
  title: "Title One"
  author: "Author One"
  filename: "book-1.epub"
`)
	if err := os.WriteFile(filepath.Join(tmpDir, "book-1.epub"), []byte("dummy"), 0o644); err != nil {
		t.Fatalf("write epub: %v", err)
	}

	metadata, err := GetPublicationMetadata(tmpDir, "book-1")
	if err != nil {
		t.Fatalf("GetPublicationMetadata: %v", err)
	}
	if metadata.Title != "Title One" || metadata.Author != "Author One" || metadata.Filename != "book-1.epub" {
		t.Fatalf("unexpected metadata: %+v", metadata)
	}
}

func writeCatalog(t *testing.T, baseDir string, contents string) {
	t.Helper()
	path := filepath.Join(baseDir, catalogFilename)
	if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
		t.Fatalf("write catalog: %v", err)
	}
}
