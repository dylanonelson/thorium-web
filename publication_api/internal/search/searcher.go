package search

import (
	"strings"
)

type Hit struct {
	Href    string `json:"href"`
	Before  string `json:"before"`
	Match   string `json:"highlight"`
	After   string `json:"after"`
}

// FindMatches returns up to maxResults matches of query within text, with a
// context window of contextChars characters around each match.
func FindMatches(text string, query string, maxResults int, contextChars int) []Hit {
	if query == "" || text == "" || maxResults <= 0 {
		return nil
	}
	lowerText := strings.ToLower(text)
	lowerQuery := strings.ToLower(query)
	results := make([]Hit, 0, maxResults)
	start := 0
	for len(results) < maxResults {
		idx := strings.Index(lowerText[start:], lowerQuery)
		if idx < 0 {
			break
		}
		idx += start
		matchStart := idx
		matchEnd := idx + len(query)
		beforeStart := matchStart - contextChars
		if beforeStart < 0 {
			beforeStart = 0
		}
		afterEnd := matchEnd + contextChars
		if afterEnd > len(text) {
			afterEnd = len(text)
		}
		before := strings.TrimSpace(text[beforeStart:matchStart])
		match := text[matchStart:matchEnd]
		after := strings.TrimSpace(text[matchEnd:afterEnd])
		results = append(results, Hit{Before: before, Match: match, After: after})
		start = matchEnd
	}
	return results
}


