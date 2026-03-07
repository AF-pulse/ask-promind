import { apiFetch } from "./client"

export function fetchProjects(apiKey) {
  return apiFetch("/projects", apiKey)
}
