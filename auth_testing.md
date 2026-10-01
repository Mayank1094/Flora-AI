# FLORAai Authentication — Backend Testing Playbook

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`. Indexes exist on users.email (unique),
sessions.jti (unique), password_reset_tokens.expires_at (TTL),
email_verification_tokens.expires_at (TTL), login_attempts.identifier.

## Step 2: API Testing (cookies)
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amrutachari11112086@gmail.com","password":"FloraAdmin@2026"}'
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login returns the user + sets access_token & refresh_token cookies. /me returns the same user.

## Flows to validate
- Register (strong password enforced), duplicate email -> 409.
- Login invalid creds -> 401 "Invalid email or password." (no enumeration).
- Brute force: 5 wrong passwords -> 429 lockout.
- Refresh: POST /api/auth/refresh with refresh cookie issues new access cookie.
- Logout revokes session (refresh no longer valid).
- Forgot-password always returns generic message (check backend logs for [DEV] link).
- Reset-password with token updates hash and revokes sessions.
- Verify-email with token sets email_verified true.
- PATCH /api/users/me, /password, DELETE /api/users/me (soft delete), GET /history, /export.
- Scans: POST /api/scans (base64 image), only owner can GET/DELETE their scans.
- Admin: /api/admin/* require role=admin (403 otherwise). Role change endpoint.
