import { apiFetch } from "./client"

export function searchSynthesis(apiKey, project, query) {

  return apiFetch(
    `/search/synthesis?project=${project}`,
    apiKey,
    {
      method: "POST",
      body: JSON.stringify({
        query,
        limit: 10
      })
    }
  )
}
