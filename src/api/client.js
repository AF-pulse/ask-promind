const API_BASE =
  import.meta.env.DEV
    ? "/api"
    : "https://promind.fly.dev/api"

console.log("API_BASE =", API_BASE)

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
