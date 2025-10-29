package httpapi

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"publication_server/internal/config"
	"publication_server/internal/logging"
	"publication_server/internal/publications"
	"publication_server/internal/readium"
	"publication_server/internal/search"
)

type HealthResponse struct {
	Ok          bool  `json:"ok"`
	TimestampMs int64 `json:"timestamp_ms"`
}

type SearchRequest struct {
	PublicationID string `json:"publication_id"`
	Query         string `json:"query"`
	MaxResults    int    `json:"max_results"`
	ContextChars  int    `json:"context_chars"`
}

type LocatorLocations struct {
	Position         *int     `json:"position,omitempty"`
	Progression      *float64 `json:"progression,omitempty"`
	TotalProgression *float64 `json:"totalProgression,omitempty"`
}

type LocatorText struct {
	Before    *string `json:"before,omitempty"`
	Highlight *string `json:"highlight,omitempty"`
	After     *string `json:"after,omitempty"`
}

type Locator struct {
	Href      string            `json:"href"`
	Type      string            `json:"type"`
	Title     *string           `json:"title,omitempty"`
	Locations *LocatorLocations `json:"locations,omitempty"`
	Text      *LocatorText      `json:"text,omitempty"`
}

type SearchHit struct {
	Href    string  `json:"href"`
	Locator Locator `json:"locator"`
}

type SearchResponse struct {
	Hits []SearchHit `json:"hits"`
}

func Router() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		respondJSON(w, http.StatusOK, HealthResponse{Ok: true, TimestampMs: time.Now().UnixMilli()})
	})
	r.Post("/search", handleSearch)
	return r
}

func handleSearch(w http.ResponseWriter, r *http.Request) {
	var req SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}
	if req.PublicationID == "" || req.Query == "" {
		http.Error(w, "publication_id and query are required", http.StatusBadRequest)
		return
	}
	if req.MaxResults <= 0 {
		req.MaxResults = 20
	}
	if req.ContextChars <= 0 {
		req.ContextChars = 120
	}

	baseDir := config.PublicationsDir()
	path, err := publications.ResolvePublicationPath(baseDir, req.PublicationID)
	if err != nil {
		http.Error(w, "publication not found", http.StatusNotFound)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 15*time.Second)
	defer cancel()
	publication, err := readium.OpenPublication(ctx, path)
	if err != nil {
		logging.L.Printf("open pub error: %v", err)
		http.Error(w, "failed to open publication", http.StatusInternalServerError)
		return
	}

	segCh, err := readium.IterateTextSegments(ctx, publication)
	if err != nil {
		logging.L.Printf("content segments error: %v", err)
		http.Error(w, "failed to read content", http.StatusInternalServerError)
		return
	}

	resp := SearchResponse{Hits: make([]SearchHit, 0)}
	for seg := range segCh {
		matches := search.FindMatches(seg.Text, req.Query, req.MaxResults-len(resp.Hits), req.ContextChars)
		for _, m := range matches {
			before := m.Before
			highlight := m.Match
			after := m.After
			locText := &LocatorText{Before: &before, Highlight: &highlight, After: &after}
			href := seg.Locator.Href.String()
			loc := Locator{Href: href, Type: "", Text: locText}
			resp.Hits = append(resp.Hits, SearchHit{Href: href, Locator: loc})
			if len(resp.Hits) >= req.MaxResults {
				// Enough results; cancel context to stop the iterator.
				cancel()
				break
			}
		}
		if len(resp.Hits) >= req.MaxResults {
			break
		}
	}

	respondJSON(w, http.StatusOK, resp)
}

func respondJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
