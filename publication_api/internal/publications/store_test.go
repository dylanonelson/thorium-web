package publications

import (
    "os"
    "path/filepath"
    "testing"
)

func TestResolvePublicationPath(t *testing.T) {
    tmpDir := t.TempDir()

    // Create <id>.epub
    epubID := "book-epub"
    epubPath := filepath.Join(tmpDir, epubID+".epub")
    if err := os.WriteFile(epubPath, []byte("dummy"), 0o644); err != nil {
        t.Fatalf("write epub: %v", err)
    }

    // Create exploded dir <id>/
    dirID := "book-dir"
    dirPath := filepath.Join(tmpDir, dirID)
    if err := os.MkdirAll(dirPath, 0o755); err != nil {
        t.Fatalf("mkdir: %v", err)
    }

    got, err := ResolvePublicationPath(tmpDir, epubID)
    if err != nil {
        t.Fatalf("ResolvePublicationPath epub: %v", err)
    }
    if got != epubPath {
        t.Fatalf("epub path mismatch: got %q want %q", got, epubPath)
    }

    got, err = ResolvePublicationPath(tmpDir, dirID)
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


