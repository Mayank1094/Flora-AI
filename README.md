# FLORAai 🌿

AI-powered plant-health diagnostics for **Indian subcontinent spice plants** — curry leaf,
cardamom, turmeric, black pepper, clove and cinnamon. Users capture or upload a plant photo and
receive a health score, probable disease, confidence level and an organic remedy plan, all saved
privately to their account.

Built with **FastAPI + MongoDB + React** and a complete JWT authentication system.

---

## Features

- Public marketing homepage (browse without an account).
- Full email + password auth: register, login, logout, refresh, email verification, password reset.
- Protected dashboard: upload/capture plant photo → AI diagnosis (Gemini vision) → saved report.
- Private scan history with search, status filter, detail view, delete and JSON data export.
- Profile management, preferences & privacy settings, password change, account deletion.
- Role-based access control (user / admin) with a protected admin dashboard (stats, charts,
  user role management, scan logs).

## Pages / Routes

`/` `/login` `/signup` `/forgot-password` `/reset-password` `/verify-email` `/dashboard`
`/history` `/profile` `/settings` `/admin`

## API

```
POST   /api/auth/register          POST   /api/auth/login
POST   /api/auth/logout            POST   /api/auth/refresh
GET    /api/auth/me                POST   /api/auth/verify-email
POST   /api/auth/resend-verification
POST   /api/auth/forgot-password   POST   /api/auth/reset-password
PATCH  /api/users/me               PATCH  /api/users/me/password
DELETE /api/users/me               GET    /api/users/me/history   GET /api/users/me/export
GET    /api/spices
POST   /api/scans                  GET /api/scans   GET/DELETE /api/scans/{id}
GET    /api/admin/stats            GET /api/admin/users   GET /api/admin/scans
PATCH  /api/admin/users/{id}/role
```

## Security measures

- **Passwords**: bcrypt hashing; strong-password rule (8+ chars, upper, lower, digit, special),
  enforced on both frontend and backend.
- **Tokens**: short-lived JWT access token (15 min) + refresh token (7 days), both stored as
  `httpOnly`, `Secure`, `SameSite=None` cookies (never exposed to JS or URLs). Frontend auto-refreshes
  on 401.
- **Sessions**: refresh tokens are backed by a `sessions` collection — logout, password reset and
  account deletion revoke sessions server-side (token invalidation).
- **Brute force**: 5 failed logins per IP+email trigger a 15-minute lockout (`login_attempts`).
- **Account enumeration**: login and forgot-password return generic responses; forgot-password
  always says "if an account exists…".
- **RBAC**: admin routes require `role=admin`; frontend `AdminRoute` guards the UI, backend
  `require_admin` guards the API.
- **Data isolation**: every scan/history/export query is scoped to the authenticated user id.
- **Input validation**: Pydantic models validate all request bodies; CORS restricted to the
  configured frontend origin with credentials.

## Email verification (optional but documented)

Transactional email uses Emergent's managed **Resend** integration (no Resend key required — the
platform owns the provider account). On registration a 24h verification link is emailed; password
reset sends a 1h link. **For local development, both links are also printed to the backend logs**
with a `[DEV]` prefix, so you can verify/reset without a real inbox:

```
tail -f /var/log/supervisor/backend.*.log | grep "\[DEV\]"
```

Email verification is **optional** — unverified users can still use the app, but the dashboard shows
a reminder banner.

## Plant analysis (AI)

Images are sent as base64 to `POST /api/scans` and analysed by **Gemini 3.1 Pro vision** via the
Emergent universal LLM key (`EMERGENT_LLM_KEY`). The model returns structured JSON (plant, status,
health score, confidence, diagnosis, issues, remedies). If the model is unavailable, a deterministic
reference result (`is_mock: true`) is returned so the app keeps working.

## Environment variables

Backend (`/app/backend/.env`):

```
MONGO_URL=...            DB_NAME=...            CORS_ORIGINS=*
FRONTEND_URL=<frontend origin>
JWT_SECRET=<random 64-char hex>
ADMIN_EMAIL=...          ADMIN_PASSWORD=...
EMERGENT_LLM_KEY=...     EMERGENT_EMAIL_KEY=...
EMAIL_FROM_NAME=FLORAai  EMAIL_REPLY_TO=<owner inbox>
```

Frontend (`/app/frontend/.env`): `REACT_APP_BACKEND_URL=<backend origin>`

## Local development

Services are managed by supervisor (backend :8001, frontend :3000, MongoDB).

```
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

A default **admin** account is seeded on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(see `/app/memory/test_credentials.md`).

## Assumptions

- Frontend and backend are served from the same origin via ingress, so auth cookies are first-party.
- MongoDB is the single datastore; TTL indexes auto-expire reset/verification tokens.
- Account deletion is a **soft delete** (status flipped, email tombstoned, sessions revoked).
