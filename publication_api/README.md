# Publication Server (Go)

HTTP/JSON service providing keyword search over EPUB publications using Readium Go toolkit's ContentService.

## Run (dev)

```
make run # PORT=8091 PUBLICATIONS_DIR=publications
```

- Health: `GET http://127.0.0.1:8091/health`
- Search: `POST http://127.0.0.1:8091/search`

Request body:

```
{
  "publication_id": "david-copperfield",
  "query": "Murdstone",
  "max_results": 20,
  "context_chars": 120
}
```

Response body (example):

```
{
  "hits": [
    {
      "href": "text/chapter-001.xhtml",
      "locator": {
        "href": "text/chapter-001.xhtml",
        "type": "application/xhtml+xml",
        "text": { "before": "…", "highlight": "Murdstone", "after": "…" }
      }
    }
  ],
  "count": 1
}
```

## Build

```
make build
./bin/publication-server
```

## Test

```
make test
```

## Config

- `PUBLICATION_SERVER_PORT` (default: `8091`)
- `PUBLICATIONS_DIR` (default: `publications`)

## Python integration

Set `CONTENT_SERVICE_URL` in the Python backend (defaults to `http://127.0.0.1:8091`). Use `backend/app/publication_reader.py:search_publication()`.
