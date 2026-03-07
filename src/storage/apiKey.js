const KEY = "PROMIND_API_KEY"

export function getApiKey() {
  return localStorage.getItem(KEY)
}

export function setApiKey(key) {
  localStorage.setItem(KEY, key)
}
