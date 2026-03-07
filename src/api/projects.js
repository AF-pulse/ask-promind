import { apiFetch } from "./client"

export async function fetchProjects(apiKey) {

  const data = await apiFetch(
    "/projects/overview",
    apiKey
  )

  return data.projects
}

 
