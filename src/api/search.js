import { apiFetch } from "./client"

export function searchSynthesis(project, query) {

  return apiFetch(`/search/synthesis?project=${project}`, {
    method: "POST",
    body: JSON.stringify({
      query,
      limit: 10
    })
  })
}
