"""FLORAai backend regression tests."""
import os
import re
import time
import base64
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fall back to reading frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.strip().split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "amrutachari11112086@gmail.com"
ADMIN_PASSWORD = "FloraAdmin@2026"

# unique test user per run
RUN = str(int(time.time()))
TEST_EMAIL = f"testuser_{RUN}@floraai.app"
TEST_PASSWORD = "TestUser@2026"
TEST_NAME = "Test User"

# 1x1 PNG
TINY_PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
)


@pytest.fixture(scope="session")
def admin_sess():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["user"]["role"] == "admin"
    return s


@pytest.fixture(scope="session")
def user_sess():
    s = requests.Session()
    r = s.post(f"{API}/auth/register", json={
        "name": TEST_NAME, "email": TEST_EMAIL,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
        "location": "Kerala", "experience": "Hobbyist", "spice_interest": "Cardamom",
    })
    assert r.status_code == 200, f"Register failed: {r.status_code} {r.text}"
    return s


# --------------- health ---------------
def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --------------- register ---------------
def test_register_weak_password():
    r = requests.post(f"{API}/auth/register", json={
        "name": "Weak", "email": f"weak_{RUN}@floraai.app",
        "password": "weakpass", "confirm_password": "weakpass",
    })
    assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"


def test_register_duplicate(user_sess):
    r = requests.post(f"{API}/auth/register", json={
        "name": TEST_NAME, "email": TEST_EMAIL,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
    })
    assert r.status_code == 409


def test_register_password_mismatch():
    r = requests.post(f"{API}/auth/register", json={
        "name": "Mm", "email": f"mm_{RUN}@floraai.app",
        "password": "Str0ng@Pass", "confirm_password": "Different@2026",
    })
    assert r.status_code == 400


# --------------- login ---------------
def test_login_invalid():
    r = requests.post(f"{API}/auth/login", json={"email": "nouser@floraai.app", "password": "WrongPass@1"})
    assert r.status_code == 401
    assert "Invalid email or password" in r.text


def test_admin_login_works():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    assert r.json()["user"]["role"] == "admin"


def test_brute_force_lockout():
    email = f"locktest_{RUN}@floraai.app"
    # Register first so account exists; but lockout is on identifier (ip:email), works regardless
    hits = []
    for i in range(6):
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "WrongPass@1"})
        hits.append(r.status_code)
    # After 5 failures the 6th should be 429 (or earlier)
    assert 429 in hits, f"No lockout triggered. codes={hits}"


# --------------- /auth/me ---------------
def test_me_requires_auth():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_me_with_cookie(user_sess):
    r = user_sess.get(f"{API}/auth/me")
    assert r.status_code == 200
    assert r.json()["user"]["email"] == TEST_EMAIL


# --------------- refresh / logout ---------------
def test_refresh_then_logout():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    r2 = s.post(f"{API}/auth/refresh")
    assert r2.status_code == 200
    r3 = s.post(f"{API}/auth/logout")
    assert r3.status_code == 200
    # Refresh after logout should fail
    r4 = s.post(f"{API}/auth/refresh")
    assert r4.status_code == 401


# --------------- forgot/reset ---------------
def test_forgot_password_generic():
    r = requests.post(f"{API}/auth/forgot-password", json={"email": "nouser@floraai.app"})
    assert r.status_code == 200
    assert "If an account exists" in r.text


def _tail_logs() -> str:
    import glob, subprocess
    text = ""
    for p in glob.glob("/var/log/supervisor/backend.*.log"):
        try:
            text += subprocess.check_output(["tail", "-n", "500", p], text=True)
        except Exception:
            pass
    return text


def test_password_reset_flow():
    # user exists via user_sess fixture indirectly? create a fresh user
    email = f"reset_{RUN}@floraai.app"
    r = requests.post(f"{API}/auth/register", json={
        "name": "Reset", "email": email,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
    })
    assert r.status_code == 200

    r = requests.post(f"{API}/auth/forgot-password", json={"email": email})
    assert r.status_code == 200

    time.sleep(0.5)
    logs = _tail_logs()
    m = re.search(rf"\[DEV\] Password reset link for {re.escape(email)}:.*?token=([A-Za-z0-9_-]+)", logs)
    assert m, "Reset token not found in logs"
    token = m.group(1)

    new_pw = "NewPass@2026"
    r = requests.post(f"{API}/auth/reset-password", json={"token": token, "password": new_pw})
    assert r.status_code == 200

    # login with new password
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": new_pw})
    assert r.status_code == 200


def test_email_verification_flow():
    email = f"verify_{RUN}@floraai.app"
    s = requests.Session()
    r = s.post(f"{API}/auth/register", json={
        "name": "Verify", "email": email,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
    })
    assert r.status_code == 200
    assert r.json()["user"]["email_verified"] is False

    time.sleep(0.5)
    logs = _tail_logs()
    m = re.search(rf"\[DEV\] Email verification link for {re.escape(email)}:.*?token=([A-Za-z0-9_-]+)", logs)
    assert m, "Verification token not found in logs"
    token = m.group(1)

    r = requests.post(f"{API}/auth/verify-email", json={"token": token})
    assert r.status_code == 200

    r = s.get(f"{API}/auth/me")
    assert r.json()["user"]["email_verified"] is True


# --------------- protected routes ---------------
@pytest.mark.parametrize("method,path", [
    ("GET", "/users/me/history"),
    ("POST", "/scans"),
    ("PATCH", "/users/me"),
    ("DELETE", "/users/me"),
    ("GET", "/users/me/export"),
])
def test_protected_requires_auth(method, path):
    r = requests.request(method, f"{API}{path}", json={})
    assert r.status_code == 401


# --------------- admin RBAC ---------------
@pytest.mark.parametrize("path", ["/admin/stats", "/admin/users", "/admin/scans"])
def test_admin_forbidden_for_user(user_sess, path):
    r = user_sess.get(f"{API}{path}")
    assert r.status_code == 403


@pytest.mark.parametrize("path", ["/admin/stats", "/admin/users", "/admin/scans"])
def test_admin_ok_for_admin(admin_sess, path):
    r = admin_sess.get(f"{API}{path}")
    assert r.status_code == 200


# --------------- scans ---------------
def test_create_scan_and_history(user_sess):
    r = user_sess.post(f"{API}/scans", json={
        "plant_name": "Cardamom", "image_base64": TINY_PNG_B64, "notes": "test scan",
    })
    assert r.status_code == 200, r.text
    scan = r.json()["scan"]
    assert "health_score" in scan
    assert "status" in scan
    assert "confidence" in scan
    assert "diagnosis" in scan
    assert "issues" in scan
    assert "remedies" in scan
    sid = scan["id"]

    # list
    r = user_sess.get(f"{API}/users/me/history")
    assert r.status_code == 200
    ids = [s["id"] for s in r.json()["scans"]]
    assert sid in ids

    # get own scan
    r = user_sess.get(f"{API}/scans/{sid}")
    assert r.status_code == 200

    return sid


def test_scan_data_isolation(user_sess, admin_sess):
    # user creates a scan
    r = user_sess.post(f"{API}/scans", json={"plant_name": "Turmeric", "image_base64": TINY_PNG_B64})
    assert r.status_code == 200
    sid = r.json()["scan"]["id"]
    # admin tries to GET that scan via /scans/{id} => should 404 (different user)
    r2 = admin_sess.get(f"{API}/scans/{sid}")
    assert r2.status_code == 404


# --------------- profile / password / export / delete ---------------
def test_profile_update_and_password_change_and_delete():
    email = f"full_{RUN}@floraai.app"
    s = requests.Session()
    r = s.post(f"{API}/auth/register", json={
        "name": "Full Flow", "email": email,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
    })
    assert r.status_code == 200

    r = s.patch(f"{API}/users/me", json={"name": "Updated Name", "bio": "Hello"})
    assert r.status_code == 200
    assert r.json()["user"]["name"] == "Updated Name"

    # wrong current password
    r = s.patch(f"{API}/users/me/password", json={
        "current_password": "WrongPass@1", "new_password": "NewOne@2026"})
    assert r.status_code == 400

    r = s.patch(f"{API}/users/me/password", json={
        "current_password": TEST_PASSWORD, "new_password": "NewOne@2026"})
    assert r.status_code == 200

    r = s.get(f"{API}/users/me/export")
    assert r.status_code == 200
    assert "account" in r.json() and "scans" in r.json()

    r = s.delete(f"{API}/users/me")
    assert r.status_code == 200

    # cookies cleared -> me should 401
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_admin_role_change(admin_sess):
    # create a user, then promote via admin
    email = f"promote_{RUN}@floraai.app"
    r = requests.post(f"{API}/auth/register", json={
        "name": "Promote", "email": email,
        "password": TEST_PASSWORD, "confirm_password": TEST_PASSWORD,
    })
    assert r.status_code == 200
    uid = r.json()["user"]["id"]

    r = admin_sess.patch(f"{API}/admin/users/{uid}/role", json={"role": "admin"})
    assert r.status_code == 200
    assert r.json()["user"]["role"] == "admin"

    # revert
    r = admin_sess.patch(f"{API}/admin/users/{uid}/role", json={"role": "user"})
    assert r.status_code == 200
