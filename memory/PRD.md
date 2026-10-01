# FLORAai — Product Requirements Document

## Original problem statement
Add a complete JWT authentication system to FLORAai, a plant-health app for Indian subcontinent
spice plants, with dedicated login/signup/logout/account pages, email verification, password reset,
profile & settings, account deletion + data export, role-based access (user/admin), protected
routes, user-specific scan history, and a plant-image AI diagnosis dashboard.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`), MongoDB (motor). Modules: `emailer.py` (Resend
  managed email + guardrail gate), `plant_ai.py` (Gemini 3.1 Pro vision + mock fallback).
- **Frontend**: React 19 + React Router 7, Tailwind (botanical theme), shadcn/ui, Framer-ready,
  Sonner toasts, Recharts. AuthContext + httpOnly-cookie session with auto-refresh interceptor.
- **Auth**: bcrypt hashing, JWT access (15m) + refresh (7d) as httpOnly/Secure/SameSite=None
  cookies, sessions collection for revocation, brute-force lockout, account-enumeration-safe
  responses, strong-password validation (FE + BE).

## User personas
- **Grower (user)**: scans spice plants, tracks health history, manages profile/preferences.
- **Administrator**: monitors platform stats, manages user roles, reviews scan logs.

## Core requirements (static)
- Email+password auth with full lifecycle; RBAC; protected routes; per-user data isolation;
  AI plant diagnosis; secure sessions; email verification + password reset.

## Implemented (2026-10-01)
- Pages/routes: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`,
  `/dashboard`, `/history`, `/profile`, `/settings`, `/admin`.
- Backend endpoints: auth (register/login/logout/refresh/me/verify-email/resend-verification/
  forgot-password/reset-password), users (me PATCH, password, DELETE soft-delete, history, export),
  scans (CRUD, ownership-scoped), spices, admin (stats/users/scans/role).
- Gemini 3.1 Pro vision diagnosis (live, verified `is_mock:false`) with deterministic fallback.
- Resend managed email for verification + reset (delivers to real addresses; links also logged
  `[DEV]` for local dev). Seeded admin: amrutachari11112086@gmail.com.
- Security: brute-force lockout (email-keyed, proxy-IP independent), TTL token expiry, session
  revocation on logout/reset/delete, generic enumeration-safe responses.
- Verified: 25/28 backend tests green at first pass; all 3 reported bugs (tz-aware datetime in
  verify/reset, brute-force identifier) fixed and re-verified via curl.

## Backlog (prioritized)
- P1: Deep UI automation of scan-result card, history filter/delete/export, profile/settings save.
- P2: Camera capture (getUserMedia) on dashboard; regional outbreak map on admin.
- P2: Per-user rate limiting on register/forgot-password; batch admin scan user lookup (N+1).
- P2: Apply saved theme preference globally (next-themes) + dark mode polish.

## Next tasks
- Add live camera capture; enrich AI remedy detail per spice; weekly email digest cron.
