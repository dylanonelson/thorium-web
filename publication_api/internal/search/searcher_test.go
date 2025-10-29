package search

import "testing"

func TestFindMatches(t *testing.T) {
	text := "Hello Lorem, meet Mr. Lorem again."
	hits := FindMatches(text, "Lorem", 2, 5)
	if len(hits) != 2 {
		t.Fatalf("expected 2 hits, got %d", len(hits))
	}
	if hits[0].Match != "Lorem" {
		t.Fatalf("unexpected first match: %q", hits[0].Match)
	}
}
