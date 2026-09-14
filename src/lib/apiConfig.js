// Base URL for the Sahan backend API.
// Reads VITE_API_URL at build time; empty string means "no backend".

export function getApiBaseUrl() {
  const raw = import.meta.env?.VITE_API_URL ?? "";
  const trimmed = String(raw).trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

export function hasApi() {
  return getApiBaseUrl().length > 0;
}

export function apiUrl(path) {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${suffix}`;
}
