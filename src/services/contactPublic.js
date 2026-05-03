const apiBase = () =>
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

/** Public GET — no auth. Returns { phone_number, updated_at } */
export async function fetchContactPublic() {
  const res = await fetch(`${apiBase()}/api/contact/`);
  if (!res.ok) {
    throw new Error("Failed to load contact");
  }
  return res.json();
}
