const API_BASE = "https://promind.fly.dev/api"

export async function apiFetch(path, apiKey, options = {}) {

  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey
    },
    ...options
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }

  return res.json()
}
