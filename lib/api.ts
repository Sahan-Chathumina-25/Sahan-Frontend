export const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return BACKEND_URL ? BACKEND_URL + path : path;
}
