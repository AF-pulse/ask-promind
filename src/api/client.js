const API_BASE = "/api"

export async function apiFetch(path, options = {}) {

  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
