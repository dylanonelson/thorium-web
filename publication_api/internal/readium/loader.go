package readium

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/readium/go-toolkit/pkg/asset"
	"github.com/readium/go-toolkit/pkg/pub"
	"github.com/readium/go-toolkit/pkg/streamer"
	uturl "github.com/readium/go-toolkit/pkg/util/url"
)

// OpenPublication opens a publication from a file path (epub or exploded dir)
// and returns a Publication instance.
func OpenPublication(ctx context.Context, path string) (*pub.Publication, error) {
	// Build a File asset from the local path and open via Streamer.
	u, err := uturl.FromFilepath(filepath.Clean(path))
	if err != nil {
		return nil, fmt.Errorf("file url: %w", err)
	}
	s := streamer.New(streamer.Config{})
	publication, err := s.Open(ctx, asset.File(u), "")
	if err != nil {
		return nil, fmt.Errorf("open publication: %w", err)
	}
	return publication, nil
}
