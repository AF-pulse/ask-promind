import { apiFetch } from "./client"

export async function fetchProjects() {

  const data = await apiFetch("/projects/overview")

  return data.projects
}
