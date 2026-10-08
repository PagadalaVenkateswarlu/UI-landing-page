const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// credentials: "include" sends the httpOnly session cookie. No tokens in localStorage.
export async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", signal });
  if (res.status === 401) { window.location.assign("/signed-out"); throw new Error("Session expired"); }
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
