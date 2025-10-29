package publications

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

// ResolvePublicationPath attempts to resolve a publication path from an ID.
// It checks for <id>.epub, then <id>/ directory under baseDir.
func ResolvePublicationPath(baseDir string, publicationID string) (string, error) {
	if publicationID == "" {
		return "", errors.New("empty publication_id")
	}

	// Prefer <id>.epub
	epubPath := filepath.Join(baseDir, fmt.Sprintf("%s.epub", publicationID))
	log.Printf("epubPath: %s", epubPath)
	if fi, err := os.Stat(epubPath); err == nil && !fi.IsDir() {
		return epubPath, nil
	}

	// Fallback to exploded directory <id>/
	dirPath := filepath.Join(baseDir, publicationID)
	if fi, err := os.Stat(dirPath); err == nil && fi.IsDir() {
		return dirPath, nil
	}

	return "", fmt.Errorf("publication not found: %s", publicationID)
}
