import os
import re
import uuid
import hmac
import secrets
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Optional, List

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import bcrypt
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, APIRouter, Request, Response, Depends, HTTPException, status, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, field_validator

from emailer import send_email, verification_email, reset_email, digest_email
from plant_ai import analyze_plant, SPICE_KNOWLEDGE

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"
ACCESS_MINUTES = 15
REFRESH_DAYS = 7
MAX_FAILED = 5
LOCKOUT_MINUTES = 15
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() in ("true", "1")
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")

app = FastAPI(title="FLORAai API")
api_router = APIRouter(prefix="/api")


# ----------------------------- helpers -----------------------------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def to_aware(dt) -> datetime:
    """Normalize a value read back from Mongo (tz-naive datetime or ISO string) to tz-aware UTC."""
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


PASSWORD_RE = {
    "length": lambda p: len(p) >= 8,
    "upper": lambda p: bool(re.search(r"[A-Z]", p)),
    "lower": lambda p: bool(re.search(r"[a-z]", p)),
    "digit": lambda p: bool(re.search(r"\d", p)),
    "special": lambda p: bool(re.search(r"[^A-Za-z0-9]", p)),
}


def validate_strong_password(password: str) -> Optional[str]:
    if not PASSWORD_RE["length"](password):
        return "Password must be at least 8 characters long."
    if not PASSWORD_RE["upper"](password):
        return "Password must contain an uppercase letter."
    if not PASSWORD_RE["lower"](password):
        return "Password must contain a lowercase letter."
    if not PASSWORD_RE["digit"](password):
        return "Password must contain a number."
    if not PASSWORD_RE["special"](password):
        return "Password must contain a special character."
    return None


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {"sub": user_id, "email": email, "role": role,
               "exp": now_utc() + timedelta(minutes=ACCESS_MINUTES), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str, jti: str) -> str:
    payload = {"sub": user_id, "jti": jti,
               "exp": now_utc() + timedelta(days=REFRESH_DAYS), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
                        max_age=ACCESS_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
                        max_age=REFRESH_DAYS * 86400, path="/")


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
    response.delete_cookie("refresh_token", path="/", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)


def public_user(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "email": doc.get("email", ""),
        "role": doc.get("role", "user"),
        "location": doc.get("location"),
        "experience": doc.get("experience"),
        "spice_interest": doc.get("spice_interest"),
        "bio": doc.get("bio"),
        "email_verified": doc.get("email_verified", False),
        "status": doc.get("status", "active"),
        "preferences": doc.get("preferences", {}),
        "privacy": doc.get("privacy", {}),
        "created_at": doc.get("created_at"),
    }


async def audit(action: str, user_id: Optional[str], request: Request, meta: Optional[dict] = None):
    await db.audit_logs.insert_one({
        "id": str(uuid.uuid4()), "action": action, "user_id": user_id,
        "ip": request.client.host if request.client else None,
        "meta": meta or {}, "timestamp": now_utc().isoformat(),
    })


async def decode_access(token: str) -> dict:
    payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    return payload


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = await decode_access(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    try:
        doc = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    except (InvalidId, Exception):
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    if not doc or doc.get("status") == "deleted":
        raise HTTPException(status_code=401, detail="Account not found.")
    return doc


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required.")
    return user


# ----------------------------- schemas -----------------------------
class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str
    confirm_password: str
    location: Optional[str] = None
    experience: Optional[str] = None
    spice_interest: Optional[str] = None

    @field_validator("password")
    @classmethod
    def strong(cls, v):
        err = validate_strong_password(v)
        if err:
            raise ValueError(err)
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str
    remember: bool = False


class ForgotIn(BaseModel):
    email: EmailStr


class ResetIn(BaseModel):
    token: str
    password: str

    @field_validator("password")
    @classmethod
    def strong(cls, v):
        err = validate_strong_password(v)
        if err:
            raise ValueError(err)
        return v


class VerifyIn(BaseModel):
    token: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=80)
    location: Optional[str] = None
    experience: Optional[str] = None
    spice_interest: Optional[str] = None
    bio: Optional[str] = Field(default=None, max_length=400)
    preferences: Optional[dict] = None
    privacy: Optional[dict] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def strong(cls, v):
        err = validate_strong_password(v)
        if err:
            raise ValueError(err)
        return v


class ScanIn(BaseModel):
    plant_name: Optional[str] = ""
    image_base64: str
    notes: Optional[str] = None


class RoleUpdate(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def ok(cls, v):
        if v not in ("user", "admin"):
            raise ValueError("Role must be 'user' or 'admin'.")
        return v


# ----------------------------- brute force -----------------------------
async def check_lockout(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("lock_until"):
        lock_until = to_aware(rec["lock_until"])
        if lock_until > now_utc():
            mins = int((lock_until - now_utc()).total_seconds() // 60) + 1
            raise HTTPException(status_code=429,
                                detail=f"Too many failed attempts. Try again in {mins} minute(s).")


async def register_failure(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier})
    count = (rec.get("count", 0) if rec else 0) + 1
    update = {"identifier": identifier, "count": count, "updated_at": now_utc().isoformat()}
    if count >= MAX_FAILED:
        update["lock_until"] = (now_utc() + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
        update["count"] = 0
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)


async def clear_failures(identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})


# ----------------------------- auth routes -----------------------------
@api_router.post("/auth/register")
async def register(payload: RegisterIn, request: Request, response: Response):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    doc = {
        "name": payload.name.strip(), "email": email,
        "password_hash": hash_password(payload.password), "role": "user",
        "location": payload.location, "experience": payload.experience,
        "spice_interest": payload.spice_interest, "bio": None,
        "email_verified": False, "status": "active",
        "preferences": {"scan_detail": "standard", "confidence_threshold": 60,
                        "theme": "light", "email_digest": True},
        "privacy": {"public_profile": False, "share_scans": False},
        "created_at": now_utc().isoformat(), "updated_at": now_utc().isoformat(),
    }
    res = await db.users.insert_one(doc)
    uid = str(res.inserted_id)

    vtoken = secrets.token_urlsafe(32)
    await db.email_verification_tokens.insert_one({
        "token": vtoken, "user_id": uid, "used": False,
        "expires_at": now_utc() + timedelta(hours=24),
    })
    link = f"{FRONTEND_URL}/verify-email?token={vtoken}"
    logger.info(f"[DEV] Email verification link for {email}: {link}")
    try:
        subj, html = verification_email(doc["name"], link)
        await send_email(to=email, subject=subj, html=html)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Verification email failed: {e}")

    jti = str(uuid.uuid4())
    await db.sessions.insert_one({"jti": jti, "user_id": uid, "revoked": False,
                                  "expires_at": now_utc() + timedelta(days=REFRESH_DAYS),
                                  "created_at": now_utc().isoformat()})
    access = create_access_token(uid, email, "user")
    refresh = create_refresh_token(uid, jti)
    set_auth_cookies(response, access, refresh)
    await audit("register", uid, request)
    created = await db.users.find_one({"_id": res.inserted_id})
    return {"user": public_user(created), "message": "Account created. Please verify your email."}


@api_router.post("/auth/login")
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower().strip()
    identifier = f"login:{email}"
    await check_lockout(identifier)
    doc = await db.users.find_one({"email": email})
    if not doc or doc.get("status") == "deleted" or not verify_password(payload.password, doc["password_hash"]):
        await register_failure(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    await clear_failures(identifier)
    uid = str(doc["_id"])
    jti = str(uuid.uuid4())
    await db.sessions.insert_one({"jti": jti, "user_id": uid, "revoked": False,
                                  "expires_at": now_utc() + timedelta(days=REFRESH_DAYS),
                                  "created_at": now_utc().isoformat()})
    access = create_access_token(uid, email, doc.get("role", "user"))
    refresh = create_refresh_token(uid, jti)
    set_auth_cookies(response, access, refresh)
    await audit("login", uid, request)
    return {"user": public_user(doc), "message": "Logged in successfully."}


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token.")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type.")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")
    sess = await db.sessions.find_one({"jti": payload.get("jti")})
    if not sess or sess.get("revoked"):
        raise HTTPException(status_code=401, detail="Session is no longer valid.")
    doc = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not doc or doc.get("status") == "deleted":
        raise HTTPException(status_code=401, detail="Account not found.")
    access = create_access_token(str(doc["_id"]), doc["email"], doc.get("role", "user"))
    response.set_cookie("access_token", access, httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
                        max_age=ACCESS_MINUTES * 60, path="/")
    return {"message": "Token refreshed."}


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if token:
        try:
            payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM],
                                 options={"verify_exp": False})
            await db.sessions.update_one({"jti": payload.get("jti")}, {"$set": {"revoked": True}})
        except jwt.InvalidTokenError:
            pass
    clear_auth_cookies(response)
    return {"message": "Logged out."}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"user": public_user(user)}


@api_router.post("/auth/verify-email")
async def verify_email(payload: VerifyIn):
    rec = await db.email_verification_tokens.find_one({"token": payload.token})
    if not rec or rec.get("used"):
        raise HTTPException(status_code=400, detail="This verification link is invalid or already used.")
    if to_aware(rec["expires_at"]) < now_utc():
        raise HTTPException(status_code=400, detail="This verification link has expired.")
    await db.users.update_one({"_id": ObjectId(rec["user_id"])}, {"$set": {"email_verified": True}})
    await db.email_verification_tokens.update_one({"token": payload.token}, {"$set": {"used": True}})
    return {"message": "Email verified successfully."}


@api_router.post("/auth/resend-verification")
async def resend_verification(user: dict = Depends(get_current_user)):
    if user.get("email_verified"):
        return {"message": "Your email is already verified."}
    uid = str(user["_id"])
    vtoken = secrets.token_urlsafe(32)
    await db.email_verification_tokens.insert_one({
        "token": vtoken, "user_id": uid, "used": False,
        "expires_at": now_utc() + timedelta(hours=24),
    })
    link = f"{FRONTEND_URL}/verify-email?token={vtoken}"
    logger.info(f"[DEV] Resent verification link for {user['email']}: {link}")
    try:
        subj, html = verification_email(user["name"], link)
        await send_email(to=user["email"], subject=subj, html=html)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Resend verification failed: {e}")
    return {"message": "Verification email sent."}


@api_router.post("/auth/forgot-password")
async def forgot_password(payload: ForgotIn, request: Request):
    email = payload.email.lower().strip()
    doc = await db.users.find_one({"email": email})
    generic = {"message": "If an account exists for that email, a reset link has been sent."}
    if not doc or doc.get("status") == "deleted":
        return generic
    rtoken = secrets.token_urlsafe(32)
    await db.password_reset_tokens.insert_one({
        "token": rtoken, "user_id": str(doc["_id"]), "used": False,
        "expires_at": now_utc() + timedelta(hours=1),
    })
    link = f"{FRONTEND_URL}/reset-password?token={rtoken}"
    logger.info(f"[DEV] Password reset link for {email}: {link}")
    try:
        subj, html = reset_email(doc["name"], link)
        await send_email(to=email, subject=subj, html=html)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Reset email failed: {e}")
    await audit("forgot_password", str(doc["_id"]), request)
    return generic


@api_router.post("/auth/reset-password")
async def reset_password(payload: ResetIn, request: Request):
    rec = await db.password_reset_tokens.find_one({"token": payload.token})
    if not rec or rec.get("used"):
        raise HTTPException(status_code=400, detail="This reset link is invalid or already used.")
    if to_aware(rec["expires_at"]) < now_utc():
        raise HTTPException(status_code=400, detail="This reset link has expired.")
    await db.users.update_one({"_id": ObjectId(rec["user_id"])},
                              {"$set": {"password_hash": hash_password(payload.password),
                                        "updated_at": now_utc().isoformat()}})
    await db.password_reset_tokens.update_one({"token": payload.token}, {"$set": {"used": True}})
    await db.sessions.update_many({"user_id": rec["user_id"]}, {"$set": {"revoked": True}})
    await audit("reset_password", rec["user_id"], request)
    return {"message": "Password has been reset. You can now log in."}


# ----------------------------- user routes -----------------------------
@api_router.patch("/users/me")
async def update_me(payload: ProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if updates:
        updates["updated_at"] = now_utc().isoformat()
        await db.users.update_one({"_id": user["_id"]}, {"$set": updates})
    doc = await db.users.find_one({"_id": user["_id"]})
    return {"user": public_user(doc)}


@api_router.patch("/users/me/password")
async def change_password(payload: PasswordChange, request: Request, user: dict = Depends(get_current_user)):
    if not verify_password(payload.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Your current password is incorrect.")
    await db.users.update_one({"_id": user["_id"]},
                              {"$set": {"password_hash": hash_password(payload.new_password),
                                        "updated_at": now_utc().isoformat()}})
    await audit("password_change", str(user["_id"]), request)
    return {"message": "Password updated successfully."}


@api_router.get("/users/me/export")
async def export_data(user: dict = Depends(get_current_user)):
    scans = await db.scans.find({"user_id": str(user["_id"])}, {"image_base64": 0}).to_list(1000)
    for s in scans:
        s["_id"] = str(s["_id"])
    return {"account": public_user(user), "scans": scans,
            "exported_at": now_utc().isoformat()}


@api_router.delete("/users/me")
async def delete_me(request: Request, response: Response, user: dict = Depends(get_current_user)):
    await db.users.update_one({"_id": user["_id"]},
                              {"$set": {"status": "deleted", "deleted_at": now_utc().isoformat(),
                                        "email": f"deleted_{user['_id']}@floraai.invalid"}})
    await db.sessions.update_many({"user_id": str(user["_id"])}, {"$set": {"revoked": True}})
    clear_auth_cookies(response)
    await audit("account_deleted", str(user["_id"]), request)
    return {"message": "Your account has been deleted."}


@api_router.get("/users/me/history")
async def my_history(user: dict = Depends(get_current_user)):
    scans = await db.scans.find({"user_id": str(user["_id"])}, {"image_base64": 0}).sort("created_at", -1).to_list(500)
    for s in scans:
        s["_id"] = str(s["_id"])
    return {"scans": scans}


# ----------------------------- scan routes -----------------------------
@api_router.get("/spices")
async def list_spices():
    return {"spices": SPICE_KNOWLEDGE}


@api_router.post("/scans")
async def create_scan(payload: ScanIn, user: dict = Depends(get_current_user)):
    img = payload.image_base64
    if "," in img and img.strip().startswith("data:"):
        img = img.split(",", 1)[1]
    result = await analyze_plant(img, payload.plant_name or "")
    scan_id = str(uuid.uuid4())
    doc = {
        "id": scan_id, "user_id": str(user["_id"]),
        "plant_name": result.get("plant_name") or payload.plant_name,
        "scientific_name": result.get("scientific_name", ""),
        "plant_family": result.get("plant_family", ""),
        "plant_role": result.get("plant_role", ""),
        "plant_description": result.get("plant_description", ""),
        "problem_cause": result.get("problem_cause", ""),
        "precautions": result.get("precautions", []),
        "status": result.get("status", "Unknown"),
        "health_score": result.get("health_score", 0),
        "confidence": result.get("confidence", 0),
        "diagnosis": result.get("diagnosis", ""),
        "issues": result.get("issues", []),
        "remedies": result.get("remedies", []),
        "is_mock": result.get("is_mock", False),
        "notes": payload.notes,
        "image_base64": payload.image_base64,
        "created_at": now_utc().isoformat(),
    }
    await db.scans.insert_one(doc)
    doc.pop("_id", None)
    return {"scan": doc}


@api_router.get("/scans")
async def list_scans(user: dict = Depends(get_current_user)):
    scans = await db.scans.find({"user_id": str(user["_id"])}).sort("created_at", -1).to_list(500)
    for s in scans:
        s["_id"] = str(s["_id"])
    return {"scans": scans}


@api_router.get("/scans/{scan_id}")
async def get_scan(scan_id: str, user: dict = Depends(get_current_user)):
    doc = await db.scans.find_one({"id": scan_id, "user_id": str(user["_id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Scan not found.")
    doc["_id"] = str(doc["_id"])
    return {"scan": doc}


@api_router.delete("/scans/{scan_id}")
async def delete_scan(scan_id: str, user: dict = Depends(get_current_user)):
    res = await db.scans.delete_one({"id": scan_id, "user_id": str(user["_id"])})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return {"message": "Scan deleted."}


# ----------------------------- admin routes -----------------------------
@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({"status": {"$ne": "deleted"}})
    total_admins = await db.users.count_documents({"role": "admin", "status": {"$ne": "deleted"}})
    total_scans = await db.scans.count_documents({})
    verified = await db.users.count_documents({"email_verified": True, "status": {"$ne": "deleted"}})
    by_status = {}
    for st in ["Healthy", "Leaf Spot", "Blight", "Root Rot", "Deficiency", "Pest Infestation", "Viral", "Unknown"]:
        by_status[st] = await db.scans.count_documents({"status": st})
    return {"total_users": total_users, "total_admins": total_admins, "total_scans": total_scans,
            "verified_users": verified, "scans_by_status": by_status}


@api_router.get("/admin/users")
async def admin_users(admin: dict = Depends(require_admin)):
    users = await db.users.find({}).sort("created_at", -1).to_list(1000)
    out = []
    for u in users:
        pu = public_user(u)
        pu["scan_count"] = await db.scans.count_documents({"user_id": str(u["_id"])})
        out.append(pu)
    return {"users": out}


@api_router.patch("/admin/users/{user_id}/role")
async def admin_set_role(user_id: str, payload: RoleUpdate, request: Request, admin: dict = Depends(require_admin)):
    try:
        target = await db.users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise HTTPException(status_code=404, detail="User not found.")
    if not target:
        raise HTTPException(status_code=404, detail="User not found.")
    if str(target["_id"]) == str(admin["_id"]) and payload.role != "admin":
        raise HTTPException(status_code=400, detail="You cannot remove your own admin role.")
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": payload.role}})
    await audit("role_change", str(admin["_id"]), request, {"target": user_id, "role": payload.role})
    doc = await db.users.find_one({"_id": ObjectId(user_id)})
    return {"user": public_user(doc)}


@api_router.get("/admin/scans")
async def admin_scans(admin: dict = Depends(require_admin)):
    scans = await db.scans.find({}, {"image_base64": 0}).sort("created_at", -1).to_list(500)
    for s in scans:
        s["_id"] = str(s["_id"])
        u = await db.users.find_one({"_id": ObjectId(s["user_id"])}) if ObjectId.is_valid(s["user_id"]) else None
        s["user_email"] = u.get("email") if u else "unknown"
    return {"scans": scans}


@api_router.get("/admin/outbreaks")
async def admin_outbreaks(admin: dict = Depends(require_admin)):
    scans = await db.scans.find({}, {"image_base64": 0}).to_list(3000)
    locmap = {}
    regions = {}
    for s in scans:
        uid = s.get("user_id", "")
        if uid not in locmap:
            u = await db.users.find_one({"_id": ObjectId(uid)}) if ObjectId.is_valid(uid) else None
            locmap[uid] = (u.get("location") if u else None) or "Unspecified region"
        region = locmap[uid]
        r = regions.setdefault(region, {"region": region, "total": 0, "unhealthy": 0, "statuses": {}})
        r["total"] += 1
        if s.get("status") not in ("Healthy", None):
            r["unhealthy"] += 1
            st = s.get("status", "Unknown")
            r["statuses"][st] = r["statuses"].get(st, 0) + 1
    out = []
    for r in regions.values():
        top = max(r["statuses"].items(), key=lambda x: x[1])[0] if r["statuses"] else None
        severity = round((r["unhealthy"] / r["total"]) * 100) if r["total"] else 0
        out.append({"region": r["region"], "total": r["total"], "unhealthy": r["unhealthy"],
                    "top_status": top, "severity": severity})
    out.sort(key=lambda x: (x["unhealthy"], x["severity"]), reverse=True)
    return {"outbreaks": out}


async def send_weekly_digests():
    cutoff_iso = (now_utc() - timedelta(days=7)).isoformat()
    users = await db.users.find({"status": {"$ne": "deleted"}, "email_verified": True,
                                 "preferences.email_digest": True}).to_list(2000)
    for u in users:
        scans = await db.scans.find(
            {"user_id": str(u["_id"]), "created_at": {"$gte": cutoff_iso}}, {"image_base64": 0}
        ).to_list(500)
        if not scans:
            continue
        total = len(scans)
        avg = round(sum(int(s.get("health_score", 0)) for s in scans) / total)
        unhealthy = [s for s in scans if s.get("status") != "Healthy"]
        try:
            subj, html = digest_email(u.get("name", "Grower"), total, avg, unhealthy[:5])
            await send_email(to=u["email"], subject=subj, html=html)
        except Exception as e:  # noqa: BLE001
            logger.error(f"Weekly digest failed for {u.get('email')}: {e}")


@api_router.post("/cron/weekly-digest")
async def cron_weekly_digest(request: Request, background: BackgroundTasks):
    # Cron endpoints must ack 2xx immediately; enqueue/background the actual work.
    secret = os.environ.get("WEBHOOK_CRON_SECRET", "")
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    if not secret or not token or not hmac.compare_digest(token, secret):
        raise HTTPException(status_code=401, detail="Unauthorized")
    run_id = request.headers.get("X-Webhook-Id")
    if run_id:
        if await db.cron_runs.find_one({"run_id": run_id}):
            return {"status": "duplicate"}
        await db.cron_runs.insert_one({"run_id": run_id, "at": now_utc()})
    background.add_task(send_weekly_digests)
    return {"status": "accepted"}


@api_router.get("/")
async def root():
    return {"message": "FLORAai API", "status": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------- startup -----------------------------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@floraai.app").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "name": "FLORAai Admin", "email": admin_email,
            "password_hash": hash_password(admin_password), "role": "admin",
            "location": "Kerala, India", "experience": "Spice Plantation Owner",
            "spice_interest": "Cardamom", "bio": "Platform administrator.",
            "email_verified": True, "status": "active",
            "preferences": {"scan_detail": "detailed", "confidence_threshold": 60,
                            "theme": "light", "email_digest": True},
            "privacy": {"public_profile": False, "share_scans": False},
            "created_at": now_utc().isoformat(), "updated_at": now_utc().isoformat(),
        })
        logger.info(f"Seeded admin account: {admin_email}")
    else:
        update = {"role": "admin", "status": "active"}
        if not verify_password(admin_password, existing["password_hash"]):
            update["password_hash"] = hash_password(admin_password)
        await db.users.update_one({"email": admin_email}, {"$set": update})


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.sessions.create_index("jti", unique=True)
    await db.sessions.create_index("user_id")
    await db.password_reset_tokens.create_index("token", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=86400)
    await db.email_verification_tokens.create_index("token", unique=True)
    await db.email_verification_tokens.create_index("expires_at", expireAfterSeconds=172800)
    await db.login_attempts.create_index("identifier", unique=True)
    await db.scans.create_index("user_id")
    await db.scans.create_index("id", unique=True)
    await db.cron_runs.create_index("at", expireAfterSeconds=604800)
    await seed_admin()
    logger.info("FLORAai backend ready.")


@app.on_event("shutdown")
async def shutdown():
    client.close()
