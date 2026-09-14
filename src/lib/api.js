import { apiUrl, getApiBaseUrl, hasApi } from "./apiConfig.js";
import { projects as localProjects } from "../data/site.js";

export { getApiBaseUrl, hasApi, apiUrl };
export { sendContactMessage, sendContactMessage as sendContact } from "../api/contactApi.js";

// Fetch project list from GET /api/projects.
// Falls back to the bundled local list when no backend is configured,
// the request fails, or the payload is not a usable array.
export async function getProjects() {
  if (!hasApi()) {
    return localProjects;
  }
  try {
    const response = await fetch(apiUrl("/api/projects"), {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return localProjects;
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : data?.projects;
    if (!Array.isArray(list) || list.length === 0) {
      return localProjects;
    }
    return list;
  } catch {
    return localProjects;
  }
}
