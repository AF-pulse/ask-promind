const BASE_URL = "https://YOUR-PROMIND-API"

export async function apiFetch(path, apiKey) {

  const res = await fetch(BASE_URL + path, {
    headers: {
      "X-API-KEY": apiKey
    }
  })

  if (!res.ok) {
    throw new Error("API error")
  }

  return res.json()
}
