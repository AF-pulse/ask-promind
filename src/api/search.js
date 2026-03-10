// src/api/search.js

import { request } from "./client";

/*
------------------------------------------------------
Semantic Search API adapter
------------------------------------------------------

Responsibility:
- Call ProMind backend search endpoint
- Pass project context
- Return normalized result structure

No ranking logic
No formatting logic
No UI logic
*/

export async function search({
  owner,
  project,
  query,
  topK = 10,
}) {
  if (!owner || !project) {
    throw new Error("search requires owner and project");
  }

  if (!query || !query.trim()) {
    return [];
  }

  const payload = {
    owner,
    project,
    query,
    top_k: topK,
  };

  const response = await request("/api/search", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response?.results) {
    return [];
  }

  return response.results.map((r) => ({
    chunk_id: r.chunk_id,
    score: r.score,
    preview: r.preview,
    document: r.document,
    owner: r.owner,
    project: r.project,
  }));
}
