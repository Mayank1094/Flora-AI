"""FLORAai iteration-2 feature tests: 12 species, outbreaks, weekly digest cron."""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"
ADMIN_EMAIL = "amrutachari11112086@gmail.com"
ADMIN_PASSWORD = "FloraAdmin@2026"
WEBHOOK_SECRET = "flora_cron_2b9d4f7a1c6e8035b2d9f4a7c1e68053"

EXPECTED_PLANTS = ["Tulsi", "Neem", "Mango", "Aloe Vera", "Coconut", "Money Plant"]


@pytest.fixture(scope="module")
def admin_sess():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# --- feature 1: 12 species ---
def test_spices_returns_12_with_new_plants():
    r = requests.get(f"{API}/spices")
    assert r.status_code == 200
    spices = r.json()["spices"]
    assert len(spices) == 12, f"Expected 12 spices, got {len(spices)}"
    names = " | ".join(s["name"] for s in spices)
    for plant in EXPECTED_PLANTS:
        assert plant.lower() in names.lower(), f"Missing new plant: {plant} in {names}"


# --- feature 4: cron weekly-digest ---
def test_cron_weekly_digest_no_auth():
    r = requests.post(f"{API}/cron/weekly-digest")
    assert r.status_code == 401


def test_cron_weekly_digest_wrong_token():
    r = requests.post(f"{API}/cron/weekly-digest", headers={"Authorization": "Bearer wrong_token_xyz"})
    assert r.status_code == 401


def test_cron_weekly_digest_valid_bearer():
    r = requests.post(f"{API}/cron/weekly-digest", headers={"Authorization": f"Bearer {WEBHOOK_SECRET}"})
    assert r.status_code == 200
    assert r.json().get("status") == "accepted"


def test_cron_weekly_digest_duplicate_webhook_id():
    wid = f"test-webhook-{uuid.uuid4()}"
    headers = {"Authorization": f"Bearer {WEBHOOK_SECRET}", "X-Webhook-Id": wid}
    r1 = requests.post(f"{API}/cron/weekly-digest", headers=headers)
    assert r1.status_code == 200
    assert r1.json()["status"] == "accepted"
    r2 = requests.post(f"{API}/cron/weekly-digest", headers=headers)
    assert r2.status_code == 200
    assert r2.json()["status"] == "duplicate"


# --- feature 5: admin outbreaks ---
def test_admin_outbreaks_requires_admin():
    r = requests.get(f"{API}/admin/outbreaks")
    assert r.status_code == 401


def test_admin_outbreaks_ok(admin_sess):
    r = admin_sess.get(f"{API}/admin/outbreaks")
    assert r.status_code == 200
    data = r.json()
    assert "outbreaks" in data
    assert isinstance(data["outbreaks"], list)
    for o in data["outbreaks"]:
        assert "region" in o
        assert "severity" in o
        assert "total" in o
        assert "unhealthy" in o
