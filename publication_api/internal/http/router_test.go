package httpapi

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"publication_server/internal/readium"
)

func repoRootDir(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatalf("runtime.Caller failed")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(file), "../../../"))
}

func TestSearch_EndToEnd_SampleTwoChapters_ExactParagraph(t *testing.T) {
	// Point the server to the repo's publication_server/testdata directory.
	root := repoRootDir(t)
	pubs := filepath.Join(root, "publication_server", "testdata")
	if err := os.Setenv("PUBLICATIONS_DIR", pubs); err != nil {
		t.Fatalf("set env: %v", err)
	}
	defer os.Unsetenv("PUBLICATIONS_DIR")

	// Open the same publication via readium to obtain the exact paragraph text.
	epubPath := filepath.Join(pubs, "sample_two_chapters.epub")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	publication, err := readium.OpenPublication(ctx, epubPath)
	if err != nil {
		t.Skipf("skipping: OpenPublication failed (%v) — ensure go-toolkit streamer supports fixture on this platform", err)
	}
	segCh, err := readium.IterateTextSegments(ctx, publication)
	if err != nil {
		t.Skipf("skipping: content segments error (%v)", err)
	}
	// We will use the first lorem ipsum paragraph as the exact query.
	target := ""
	const expectedPara = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
	for seg := range segCh {
		if seg.Text == expectedPara {
			target = seg.Text
			break
		}
	}
	if target == "" {
		t.Fatalf("expected to find lorem ipsum paragraph in streamed segments")
	}

	// Build router and issue request.
	r := Router()
	srv := httptest.NewServer(r)
	defer srv.Close()

	reqBody := SearchRequest{
		PublicationID: "sample_two_chapters",
		Query:         target,
		MaxResults:    5,
		ContextChars:  10,
	}
	body, _ := json.Marshal(reqBody)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(srv.URL+"/search", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("post /search: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("unexpected status: %d", resp.StatusCode)
	}

	var sr SearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&sr); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(sr.Hits) == 0 {
		t.Fatalf("expected at least one hit, got len=%d", len(sr.Hits))
	}

	// We expect one of the hits to have highlight equal to the entire paragraph text.
	matched := false
	for _, h := range sr.Hits {
		if h.Locator.Text != nil && h.Locator.Text.Highlight != nil && *h.Locator.Text.Highlight == target {
			matched = true
			break
		}
	}
	if !matched {
		t.Fatalf("no hit had exact highlight equal to streamed paragraph text")
	}
}
