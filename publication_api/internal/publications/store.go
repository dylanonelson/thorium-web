package publications

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"gopkg.in/yaml.v3"
)

const catalogFilename = "publications.yaml"

// Metadata represents catalog information for a publication.
type Metadata struct {
	ID       string `yaml:"id"`
	Title    string `yaml:"title"`
	Author   string `yaml:"author"`
	Filename string `yaml:"filename"`
}

// Store keeps publication metadata and resolves publication paths.
type Store struct {
	baseDir string
	catalog map[string]Metadata
}

var storeCache sync.Map // map[string]*Store keyed by absolute baseDir

// GetStore returns a cached store for the provided base directory.
func GetStore(baseDir string) (*Store, error) {
	if strings.TrimSpace(baseDir) == "" {
		return nil, errors.New("base directory must not be empty")
	}

	absBase, err := filepath.Abs(baseDir)
	if err != nil {
		return nil, fmt.Errorf("resolve base directory: %w", err)
	}

	if cached, ok := storeCache.Load(absBase); ok {
		return cached.(*Store), nil
	}

	store, err := newStore(absBase)
	if err != nil {
		return nil, err
	}

	actual, _ := storeCache.LoadOrStore(absBase, store)
	return actual.(*Store), nil
}

// ResetStoreCache clears the cached stores (useful for tests).
func ResetStoreCache() {
	storeCache = sync.Map{}
}

func newStore(baseDir string) (*Store, error) {
	catalogPath := filepath.Join(baseDir, catalogFilename)
	catalog, err := loadCatalog(catalogPath)
	if err != nil {
		return nil, fmt.Errorf("load catalog %s: %w", catalogPath, err)
	}

	return &Store{baseDir: baseDir, catalog: catalog}, nil
}

// GetMetadata returns metadata for a publication ID.
func (s *Store) GetMetadata(publicationID string) (Metadata, error) {
	trimmedID := strings.TrimSpace(publicationID)
	if trimmedID == "" {
		return Metadata{}, errors.New("empty publication_id")
	}

	meta, ok := s.catalog[trimmedID]
	if !ok {
		return Metadata{}, fmt.Errorf("publication not found: %s", trimmedID)
	}

	return meta, nil
}

// ResolvePublicationPath returns the filesystem path for a publication.
func (s *Store) ResolvePublicationPath(publicationID string) (string, error) {
	meta, err := s.GetMetadata(publicationID)
	if err != nil {
		return "", err
	}

	path := filepath.Join(s.baseDir, meta.Filename)
	if _, statErr := os.Stat(path); statErr != nil {
		if errors.Is(statErr, os.ErrNotExist) {
			return "", fmt.Errorf("publication not found on disk: %s", meta.ID)
		}
		return "", fmt.Errorf("stat publication: %w", statErr)
	}

	// Allow both files and directories; callers rely on the catalog filename for the exact location.
	return path, nil
}

// ResolvePublicationPath loads the catalog for baseDir and resolves the publication path.
func ResolvePublicationPath(baseDir string, publicationID string) (string, error) {
	store, err := GetStore(baseDir)
	if err != nil {
		return "", err
	}
	return store.ResolvePublicationPath(publicationID)
}

// GetPublicationMetadata loads the catalog and returns metadata for the ID.
func GetPublicationMetadata(baseDir string, publicationID string) (Metadata, error) {
	store, err := GetStore(baseDir)
	if err != nil {
		return Metadata{}, err
	}
	return store.GetMetadata(publicationID)
}

func loadCatalog(path string) (map[string]Metadata, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	var entries []Metadata
	if err := decoder.Decode(&entries); err != nil {
		if errors.Is(err, io.EOF) {
			return map[string]Metadata{}, nil
		}
		return nil, err
	}

	catalog := make(map[string]Metadata, len(entries))
	for _, entry := range entries {
		id := strings.TrimSpace(entry.ID)
		if id == "" {
			return nil, errors.New("catalog entry missing id")
		}
		filename := strings.TrimSpace(entry.Filename)
		if filename == "" {
			return nil, fmt.Errorf("catalog entry %s missing filename", id)
		}
		if _, exists := catalog[id]; exists {
			return nil, fmt.Errorf("duplicate catalog entry for id %s", id)
		}
		entry.ID = id
		entry.Title = strings.TrimSpace(entry.Title)
		entry.Author = strings.TrimSpace(entry.Author)
		entry.Filename = filename
		catalog[id] = entry
	}

	return catalog, nil
}
