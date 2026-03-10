import { apiFetch } from "./client"

/*
--------------------------------------------------
Search adapter for ProMind semantic search
--------------------------------------------------

Responsibilities
- Call backend /search endpoint
- Provide project context
- Return normalized results

No ranking logic
No UI logic
No formatting
*/

export async function search({
  owner,
  project,
  query,
  apiKey,
  topK = 10
}) {

  if (!query || !query.trim()) {
    return []
  }

  const payload = {
    owner,
    project,
    query,
    top_k: topK
  }

  const data = await apiFetch(
    "/search",
    apiKey,
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  )

  if (!data || !data.results) {
    return []
  }

  return data.results.map(r => ({
    chunk_id: r.chunk_id,
    score: r.score,
    preview: r.preview,
    document: r.document,
    owner: r.owner,
    project: r.project
  }))
}
