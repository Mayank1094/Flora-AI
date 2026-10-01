"""Generates the FLORAai project report PDF."""
from fpdf import FPDF

GREEN = (28, 58, 19)
LIME = (120, 160, 40)
TERRA = (184, 80, 40)
GREY = (90, 100, 85)
LOGO = "/app/frontend/public/logo.png"
OUT = "/app/frontend/public/FLORAai_Project_Report.pdf"


class PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*GREEN)
        self.cell(0, 8, "FLORAai - Project Report", align="L")
        self.set_text_color(*GREY)
        self.cell(0, 8, "by amrutachari", align="R")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*GREY)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")


def h1(pdf, text):
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(*GREEN)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 9, text, new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*LIME)
    pdf.set_line_width(0.6)
    y = pdf.get_y() + 1
    pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
    pdf.ln(4)


def h2(pdf, text):
    pdf.ln(1)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*TERRA)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def body(pdf, text):
    pdf.set_font("Helvetica", "", 10.5)
    pdf.set_text_color(40, 50, 40)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.6, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def bullets(pdf, items):
    pdf.set_font("Helvetica", "", 10.5)
    pdf.set_text_color(40, 50, 40)
    for it in items:
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 5.6, "-  " + it, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def kv_table(pdf, rows):
    for k, v in rows:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*GREEN)
        pdf.cell(42, 6.5, k, border=0, new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(40, 50, 40)
        pdf.multi_cell(0, 6.5, v, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)


pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=18)
pdf.set_margins(18, 16, 18)

# ---- Cover ----
pdf.add_page()
pdf.ln(28)
try:
    pdf.image(LOGO, x=(pdf.w - 46) / 2, w=46)
except Exception:
    pass
pdf.ln(8)
pdf.set_font("Helvetica", "B", 34)
pdf.set_text_color(*GREEN)
pdf.cell(0, 16, "FLORAai", align="C")
pdf.ln(18)
pdf.set_font("Helvetica", "", 13)
pdf.set_text_color(*GREY)
pdf.multi_cell(0, 7, "AI-Powered Plant-Health Diagnostics for\nIndian Subcontinent Spice & Medicinal Plants", align="C")
pdf.ln(10)
pdf.set_font("Helvetica", "B", 11)
pdf.set_text_color(*TERRA)
pdf.cell(0, 7, "Complete Project Report, Tech Stack & Development Plan", align="C")
pdf.ln(16)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(40, 50, 40)
pdf.cell(0, 7, "Authored & owned by: amrutachari", align="C")
pdf.ln(7)
pdf.cell(0, 7, "Contact: amrutachari11112086@gmail.com", align="C")
pdf.ln(7)
pdf.cell(0, 7, "Stack: React - FastAPI - MongoDB - Gemini Vision AI", align="C")

# ---- 1. Overview ----
pdf.add_page()
h1(pdf, "1. Project Overview")
body(pdf, "FLORAai is a full-stack web application that lets growers photograph a plant leaf and instantly "
          "receive an AI-generated health report - a health score, the probable disease, a confidence level "
          "and an organic remedy plan - tailored to Indian subcontinent spice, medicinal and household "
          "plants. Every scan is saved privately to the grower's account so recovery can be tracked over time.")
body(pdf, "The platform is built around a complete, security-hardened authentication system with role-based "
          "access for regular users and administrators. Visitors can browse the marketing homepage freely but "
          "are prompted to sign in to scan plants, save reports, view history or manage preferences.")
h2(pdf, "User Personas")
bullets(pdf, [
    "Grower (user): scans plants, tracks health history, manages profile and preferences.",
    "Administrator: monitors platform stats, manages user roles, reviews scan logs and regional outbreaks.",
])

# ---- 2. Features ----
h1(pdf, "2. Key Features")
h2(pdf, "Authentication & Accounts")
bullets(pdf, [
    "Email + password registration with strong-password enforcement (frontend + backend).",
    "Login, logout, silent token refresh, and 'remember me'.",
    "Email verification and secure password reset (tokenised, time-limited links).",
    "Profile management, preferences, privacy settings, password change.",
    "Account deletion (soft delete) and full data export (JSON).",
    "Role-based access control; protected routes redirect unauthenticated users to login.",
])
h2(pdf, "Plant Diagnostics")
bullets(pdf, [
    "Upload a photo OR capture live from the device camera on the dashboard.",
    "AI diagnosis via Google Gemini 3.1 Pro vision, with a deterministic fallback if the model is offline.",
    "Health score gauge, status badge, confidence bar, detected issues and remedy steps.",
    "Private, searchable, filterable scan history with detail view, delete and export.",
])
h2(pdf, "Admin & Platform")
bullets(pdf, [
    "Admin dashboard: total users, admins, scans, verified users; diagnoses-by-status chart.",
    "Regional outbreak hotspots - severity bars aggregated by grower location.",
    "User role management (promote/demote) and a full scan-log table.",
    "Weekly health-digest email to growers, scheduled via platform cron (Mondays 8am IST).",
    "App-wide light/dark botanical theme, saved to each user's preferences.",
])

# ---- 3. Plants ----
pdf.add_page()
h1(pdf, "3. Supported Plant Species")
body(pdf, "FLORAai's knowledge base and AI prompt are tuned for the following 12 species, each mapped to its "
          "common diseases/pests and organic remedies:")
bullets(pdf, [
    "Curry Leaf (Murraya koenigii)", "Cardamom (Elettaria cardamomum)",
    "Turmeric (Curcuma longa)", "Black Pepper (Piper nigrum)",
    "Cinnamon (Cinnamomum verum)", "Clove (Syzygium aromaticum)",
    "Tulsi / Holy Basil (Ocimum sanctum)", "Neem (Azadirachta indica)",
    "Mango (Mangifera indica)", "Aloe Vera (Aloe barbadensis)",
    "Coconut (Cocos nucifera)", "Money Plant / Pothos (Epipremnum aureum)",
])

# ---- 4. Tech stack ----
h1(pdf, "4. Technology Stack")
h2(pdf, "Frontend")
kv_table(pdf, [
    ("Framework", "React 19 (Create React App + CRACO)"),
    ("Routing", "react-router-dom 7"),
    ("Styling", "Tailwind CSS 3, custom botanical CSS variables"),
    ("UI kit", "shadcn/ui (Radix primitives), lucide-react icons"),
    ("Theming", "next-themes (light/dark class strategy)"),
    ("Data/HTTP", "axios (httpOnly-cookie session), @tanstack/react-query"),
    ("Charts", "Recharts"),
    ("Feedback", "Sonner toasts"),
    ("Fonts", "Playfair Display, Manrope, JetBrains Mono"),
])
h2(pdf, "Backend")
kv_table(pdf, [
    ("Framework", "FastAPI (Python)"),
    ("Database", "MongoDB via Motor (async)"),
    ("Auth", "JWT (PyJWT), bcrypt password hashing"),
    ("AI", "Gemini 3.1 Pro vision via emergentintegrations (universal LLM key)"),
    ("Email", "Resend managed integration (httpx) with anti-phishing gate"),
    ("Scheduling", "Platform cron (.emergent/crons.yml) -> webhook endpoint"),
    ("Server", "Uvicorn, managed by Supervisor"),
])

# ---- 5. Architecture ----
pdf.add_page()
h1(pdf, "5. Architecture")
bullets(pdf, [
    "Single-origin deployment: React frontend and FastAPI backend share one host via ingress; "
    "all backend routes are prefixed with /api.",
    "Stateless JWT access token (15 min) + refresh token (7 days), both stored as httpOnly, Secure, "
    "SameSite=None cookies - never exposed to JavaScript or URLs.",
    "A sessions collection backs refresh tokens so logout, password reset and account deletion revoke "
    "them server-side (true token invalidation).",
    "Plant images are sent as base64 to the backend, analysed by Gemini, and the structured JSON result "
    "is persisted per user.",
    "Backend modules: server.py (routes), emailer.py (templates + safe-send gate), plant_ai.py (vision + "
    "fallback).",
])

# ---- 6. Security ----
h1(pdf, "6. Security Measures")
bullets(pdf, [
    "bcrypt password hashing; strong-password policy (8+ chars, upper, lower, digit, special).",
    "Short-lived access tokens + refresh rotation; expiry enforced; logout invalidation.",
    "Brute-force protection: 5 failed logins lock the account for 15 minutes (proxy-IP independent).",
    "Account-enumeration-safe responses on login and forgot-password.",
    "Role-based guards on both frontend routes and backend endpoints.",
    "Per-user data isolation on all scan/history/export queries.",
    "Pydantic validation at all boundaries; restricted CORS with credentials.",
    "Cron webhook protected by a constant-time bearer-secret comparison.",
    "All secrets (JWT, DB, API keys) stored in environment variables, never in code or logs.",
])

# ---- 7. API ----
pdf.add_page()
h1(pdf, "7. API Endpoints")
h2(pdf, "Authentication")
bullets(pdf, [
    "POST /api/auth/register", "POST /api/auth/login", "POST /api/auth/logout",
    "POST /api/auth/refresh", "GET /api/auth/me", "POST /api/auth/verify-email",
    "POST /api/auth/resend-verification", "POST /api/auth/forgot-password",
    "POST /api/auth/reset-password",
])
h2(pdf, "Users & Scans")
bullets(pdf, [
    "PATCH /api/users/me", "PATCH /api/users/me/password", "DELETE /api/users/me",
    "GET /api/users/me/history", "GET /api/users/me/export",
    "GET /api/spices", "POST /api/scans", "GET /api/scans",
    "GET /api/scans/{id}", "DELETE /api/scans/{id}",
])
h2(pdf, "Admin & Automation")
bullets(pdf, [
    "GET /api/admin/stats", "GET /api/admin/users", "GET /api/admin/scans",
    "GET /api/admin/outbreaks", "PATCH /api/admin/users/{id}/role",
    "POST /api/cron/weekly-digest (webhook, bearer-secured)",
])

# ---- 8. Database ----
h1(pdf, "8. Database Collections")
kv_table(pdf, [
    ("users", "profile, bcrypt hash, role, preferences, privacy, status, timestamps (email unique index)"),
    ("sessions", "refresh-token jti, user_id, revoked flag, expiry (revocation store)"),
    ("scans", "user-scoped diagnosis: plant, status, score, confidence, issues, remedies, image"),
    ("password_reset_tokens", "token, user_id, expiry (TTL index), used flag"),
    ("email_verification_tokens", "token, user_id, expiry (TTL index), used flag"),
    ("login_attempts", "brute-force counter + lockout window per email"),
    ("audit_logs", "security events: login, register, reset, role change, deletion"),
    ("cron_runs", "idempotency keys for scheduled webhook deliveries"),
])

# ---- 9. Plan ----
pdf.add_page()
h1(pdf, "9. Step-by-Step Development Plan")
steps = [
    ("Step 1 - Requirements & choices", "Gathered auth method (JWT email+password), email provider "
     "(Resend), AI model (Gemini vision with mock fallback) and admin seeding."),
    ("Step 2 - Design language", "Defined the organic/earthy botanical theme: deep-forest emerald, lime "
     "pulse and spice-terracotta palette, Playfair Display + Manrope + JetBrains Mono typography."),
    ("Step 3 - Backend foundation", "Modelled MongoDB collections with indexes, TTL and unique "
     "constraints; implemented bcrypt hashing and JWT access/refresh tokens as secure cookies."),
    ("Step 4 - Auth endpoints", "Built register, login, logout, refresh, me, email verification, "
     "forgot/reset password with brute-force protection and enumeration-safe responses."),
    ("Step 5 - AI diagnosis", "Integrated Gemini 3.1 Pro vision for structured plant-health JSON with a "
     "deterministic fallback; persisted per-user scans."),
    ("Step 6 - Frontend experience", "Created the public homepage, split-screen auth pages, dashboard, "
     "history, profile, settings and admin - all responsive and accessible with data-testid hooks."),
    ("Step 7 - Guards & isolation", "Added ProtectedRoute/AdminRoute, auto token refresh, and strict "
     "per-user data scoping."),
    ("Step 8 - Testing & fixes", "Ran automated backend + UI tests; fixed datetime timezone bugs and the "
     "brute-force identifier; verified end-to-end via curl and the browser."),
    ("Step 9 - Feature expansion", "Added 6 more plant species, live camera capture, app-wide dark mode, "
     "the weekly health-digest cron, and the admin regional outbreak map."),
    ("Step 10 - Branding & docs", "Applied the FLORAai leaf logo across the app, added the ownership "
     "footer, and produced this report and the project README."),
]
for title, desc in steps:
    h2(pdf, title)
    body(pdf, desc)

# ---- 10. Setup ----
pdf.add_page()
h1(pdf, "10. Local Development Setup")
bullets(pdf, [
    "Services run under Supervisor: backend (FastAPI :8001), frontend (React :3000), MongoDB.",
    "Restart: 'sudo supervisorctl restart backend' / 'restart frontend'.",
    "Backend env (.env): MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, EMERGENT_LLM_KEY, "
    "EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, FRONTEND_URL, WEBHOOK_CRON_SECRET.",
    "Frontend env (.env): REACT_APP_BACKEND_URL.",
    "A default admin is seeded on startup; password-reset and verification links are also logged to the "
    "backend with a [DEV] prefix for local testing.",
])
h1(pdf, "Credits")
body(pdf, "FLORAai - designed, built and owned by amrutachari. All rights reserved by amrutachari.")

pdf.output(OUT)
print("WROTE", OUT)
