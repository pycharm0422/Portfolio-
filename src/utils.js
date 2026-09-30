// Resolve an image path from the JSON: full URLs are used as-is, everything
// else is treated as a file inside the /public folder.
export function asset(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}

export function storageGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}
