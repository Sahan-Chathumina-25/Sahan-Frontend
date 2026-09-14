import { apiUrl, hasApi } from "../lib/apiConfig.js";

export const CONTACT_EMAIL = "chathuminacsahan25@gmail.com";
export const MIN_MESSAGE_LENGTH = 10;

// Sends a contact message via the backend API when VITE_API_URL is set.
// Returns "api" on success, "mailto" when no backend is configured.
// Throws an Error on validation failure or a failed API request.
export async function sendContactMessage({ name, email, message }) {
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (!cleanName) {
    throw new Error("Name is required.");
  }
  if (!cleanEmail) {
    throw new Error("Email is required.");
  }
  if (cleanMessage.length < MIN_MESSAGE_LENGTH) {
    throw new Error(`Message must be at least ${MIN_MESSAGE_LENGTH} characters.`);
  }

  if (!hasApi()) {
    return "mailto";
  }

  const response = await fetch(apiUrl("/api/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: cleanName, email: cleanEmail, message: cleanMessage }),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const data = await response.json();
      if (data && typeof data.error === "string" && data.error.trim()) {
        detail = data.error.trim();
      }
    } catch {
      // Ignore JSON parse errors; fall through to the generic message.
    }
    throw new Error(detail || `Request failed with status ${response.status}.`);
  }

  return "api";
}
