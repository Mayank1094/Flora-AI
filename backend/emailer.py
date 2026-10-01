import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "FLORAai")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping email send")
        return None
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _shell(inner: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#f3f6ee;padding:32px 0;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td align="center">'
        '<table role="presentation" width="520" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(28,58,19,0.12)">'
        '<tr><td style="background:#1c3a13;padding:24px 32px">'
        '<span style="color:#d3fa99;font-size:22px;font-weight:bold;letter-spacing:1px">FLORAai</span>'
        '</td></tr>'
        f'<tr><td style="padding:32px">{inner}</td></tr>'
        '<tr><td style="padding:20px 32px;background:#f3f6ee;font-size:12px;color:#6b7c63">'
        'Sent by FLORAai, your AI plant-health companion for Indian spice plants. '
        'We will never ask for your password or payment details by email.'
        '</td></tr>'
        '</table></td></tr></table>'
    )


def verification_email(name: str, link: str) -> tuple[str, str]:
    inner = (
        f'<h1 style="color:#1c3a13;font-size:22px;margin:0 0 16px">Welcome to FLORAai, {escape(name)}!</h1>'
        '<p style="color:#2c3e2a;font-size:15px;line-height:1.6">Confirm your email address to unlock plant '
        'scanning, saved reports and your full diagnostic history.</p>'
        f'<p style="margin:28px 0"><a href="{escape(link)}" '
        'style="background:#1c3a13;color:#d3fa99;text-decoration:none;padding:14px 28px;border-radius:999px;'
        'font-weight:bold;font-size:15px;display:inline-block">Verify my email</a></p>'
        '<p style="color:#6b7c63;font-size:13px;line-height:1.6">This link expires in 24 hours. '
        'If you did not create a FLORAai account, you can safely ignore this message.</p>'
    )
    return "Verify your FLORAai email address", _shell(inner)


def digest_email(name: str, total: int, avg: int, unhealthy: list) -> tuple[str, str]:
    if unhealthy:
        items = "".join(
            f'<li style="margin:6px 0;color:#2c3e2a">'
            f'<strong>{escape(str(s.get("plant_name") or "Plant"))}</strong> — '
            f'{escape(str(s.get("status") or "Unknown"))} '
            f'({int(s.get("health_score") or 0)}/100)</li>'
            for s in unhealthy
        )
        attention = (
            '<p style="color:#2c3e2a;font-size:15px;line-height:1.6;margin-top:20px">'
            'Plants that may need your attention:</p>'
            f'<ul style="padding-left:20px;margin:8px 0">{items}</ul>'
        )
    else:
        attention = (
            '<p style="color:#2c3e2a;font-size:15px;line-height:1.6;margin-top:20px">'
            'Great news — every plant you scanned this week looked healthy. 🌿</p>'
        )
    inner = (
        f'<h1 style="color:#1c3a13;font-size:22px;margin:0 0 16px">Your weekly plant report, {escape(name)}</h1>'
        f'<p style="color:#2c3e2a;font-size:15px;line-height:1.6">You ran '
        f'<strong>{total}</strong> scan(s) this week with an average health score of '
        f'<strong>{avg}/100</strong>.</p>'
        f'{attention}'
        '<p style="margin:28px 0"><a href="https://flora-login-1.preview.emergentagent.com/dashboard" '
        'style="background:#1c3a13;color:#d3fa99;text-decoration:none;padding:14px 28px;border-radius:999px;'
        'font-weight:bold;font-size:15px;display:inline-block">Open my dashboard</a></p>'
        '<p style="color:#6b7c63;font-size:13px;line-height:1.6">You receive this because weekly digests are '
        'on in your settings. You can turn them off anytime under Settings → Notifications.</p>'
    )
    return "Your weekly FLORAai plant-health digest", _shell(inner)


def reset_email(name: str, link: str) -> tuple[str, str]:
    inner = (
        f'<h1 style="color:#1c3a13;font-size:22px;margin:0 0 16px">Reset your FLORAai password</h1>'
        f'<p style="color:#2c3e2a;font-size:15px;line-height:1.6">Hi {escape(name)}, we received a request to '
        'reset your password. Click the button below to choose a new one.</p>'
        f'<p style="margin:28px 0"><a href="{escape(link)}" '
        'style="background:#b85028;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;'
        'font-weight:bold;font-size:15px;display:inline-block">Reset password</a></p>'
        '<p style="color:#6b7c63;font-size:13px;line-height:1.6">This link expires in 1 hour. '
        'If you did not request this, no action is needed and your password stays the same.</p>'
    )
    return "Reset your FLORAai password", _shell(inner)
