# Image Integration Testing Rules (FLORAai plant scan)

- Always use base64-encoded images (data URL accepted; server strips the prefix).
- Accepted formats: JPEG, PNG, WEBP only. Transcode others to PNG/JPEG first.
- Use real plant photos with visible features (leaves, edges, textures). No blank/solid images.
- Animated images: extract first frame only. Resize large images to reasonable bounds.
- Endpoint: POST /api/scans  body: { "image_base64": "<data-url-or-base64>", "plant_name": "Turmeric" }
  (authenticated — send cookies). Returns { scan: {... health_score, status, confidence, diagnosis, issues, remedies, is_mock } }.
- Model: gemini-3.1-pro-preview via EMERGENT_LLM_KEY. If the model is unavailable the server
  returns a deterministic reference result with is_mock=true (app still functions).
- Ownership: a user can only GET/DELETE their own scans; cross-user access returns 404.
