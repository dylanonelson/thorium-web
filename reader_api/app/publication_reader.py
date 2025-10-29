import os
from typing import Any

import httpx


CONTENT_SERVICE_URL = os.getenv("CONTENT_SERVICE_URL", "http://127.0.0.1:8091")


async def search_publication(
    publication_id: str,
    query: str,
    max_results: int = 20,
    context_chars: int = 120,
) -> list[dict[str, Any]]:
    url = f"{CONTENT_SERVICE_URL}/search"
    payload = {
        "publication_id": publication_id,
        "query": query,
        "max_results": max_results,
        "context_chars": context_chars,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("hits", [])
