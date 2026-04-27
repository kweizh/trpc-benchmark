tRPC v11 enforces strict media type validation, automatically returning a `415 Unsupported Media Type` error for POST requests that lack an appropriate `Content-Type` header (e.g., `application/json`).

You need to update a manual webhook integration script in `scripts/webhook.ts` that triggers a tRPC mutation via standard `fetch`. Modify the request parameters to include the required HTTP headers so the request passes tRPC v11's strict Content-Type validation.

**Constraints:**
- Do NOT modify the tRPC server settings to bypass or disable strict validation.
- The solution must use the native standard `fetch` API.