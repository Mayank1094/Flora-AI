import os
import json
import logging
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logger = logging.getLogger(__name__)

SPICE_KNOWLEDGE = [
    {
        "name": "Curry Leaf Plant (Murraya koenigii)",
        "common_issues": ["Citrus Psyllid", "Leaf Spot (Cercospora)", "Iron Chlorosis", "Scale Insects"],
        "remedies": "Neem oil spray, copper fungicide, balance soil pH to 6.0-7.0.",
    },
    {
        "name": "Cardamom (Elettaria cardamomum)",
        "common_issues": ["Cardamom Mosaic Virus (Katte)", "Rhizome Rot", "Thrips Damage"],
        "remedies": "Improve shade drainage, destroy affected clumps, apply Trichoderma bio-agents.",
    },
    {
        "name": "Turmeric (Curcuma longa)",
        "common_issues": ["Leaf Blotch (Taphrina maculans)", "Rhizome Rot (Pythium)", "Shoot Borer"],
        "remedies": "Crop rotation, treat seed rhizomes with Trichoderma viride, organic potash.",
    },
    {
        "name": "Black Pepper (Piper nigrum)",
        "common_issues": ["Quick Wilt (Phytophthora foot rot)", "Slow Decline", "Pollu Beetle"],
        "remedies": "Apply 1% Bordeaux mixture, soil drenching, prune shaded canopy.",
    },
    {
        "name": "Cinnamon (Cinnamomum verum)",
        "common_issues": ["Pink Disease", "Leaf Blight", "Gall Mite"],
        "remedies": "Prune infected shoots, organic sulfur spray, maintain compost mulching.",
    },
    {
        "name": "Clove (Syzygium aromaticum)",
        "common_issues": ["Leaf Blight", "Sudden Death", "Seedling Wilt"],
        "remedies": "Improve drainage, Bordeaux spray, shade regulation for seedlings.",
    },
    {
        "name": "Tulsi / Holy Basil (Ocimum sanctum)",
        "common_issues": ["Fusarium Wilt", "Powdery Mildew", "Leaf Roller", "Aphids"],
        "remedies": "Avoid overwatering, neem oil spray, remove affected shoots, ensure full sun.",
    },
    {
        "name": "Neem (Azadirachta indica)",
        "common_issues": ["Dieback", "Leaf Spot", "Scale Insects", "Root Rot"],
        "remedies": "Prune dead branches, improve soil drainage, horticultural oil for scale.",
    },
    {
        "name": "Mango (Mangifera indica)",
        "common_issues": ["Anthracnose", "Powdery Mildew", "Mango Hopper", "Malformation"],
        "remedies": "Copper fungicide at flowering, prune dense canopy, control hoppers early.",
    },
    {
        "name": "Aloe Vera (Aloe barbadensis)",
        "common_issues": ["Root Rot", "Aloe Rust", "Mealybugs", "Sunburn / Overwatering"],
        "remedies": "Use well-draining soil, water sparingly, wipe mealybugs, part shade in peak heat.",
    },
    {
        "name": "Coconut (Cocos nucifera)",
        "common_issues": ["Bud Rot", "Root Wilt", "Rhinoceros Beetle", "Leaf Spot"],
        "remedies": "Remove rotten spindle, Bordeaux paste on crown, trap beetles, balanced potash.",
    },
    {
        "name": "Money Plant / Pothos (Epipremnum aureum)",
        "common_issues": ["Root Rot", "Leaf Yellowing (Overwatering)", "Bacterial Leaf Spot", "Mealybugs"],
        "remedies": "Let soil dry between watering, trim rotten roots, isolate spotted leaves, indirect light.",
    },
]

VALID_STATUSES = ["Healthy", "Leaf Spot", "Blight", "Root Rot", "Deficiency", "Pest Infestation", "Viral", "Unknown"]


def _mock_result(plant_name: str) -> dict:
    known = next((s for s in SPICE_KNOWLEDGE if plant_name.lower() in s["name"].lower()), SPICE_KNOWLEDGE[0])
    return {
        "plant_name": plant_name or known["name"],
        "scientific_name": known["name"].split("(")[-1].rstrip(")") if "(" in known["name"] else "",
        "status": "Leaf Spot",
        "health_score": 68,
        "confidence": 82,
        "diagnosis": f"The {known['name']} shows early signs consistent with {known['common_issues'][1]}. "
                     "Leaves display localized discoloration. Monitor closely over the next week.",
        "issues": known["common_issues"][:3],
        "remedies": [known["remedies"]],
        "is_mock": True,
    }


async def analyze_plant(image_base64: str, plant_name: str) -> dict:
    """Run Gemini vision analysis; fall back to a deterministic mock on any failure."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key or not image_base64:
        return _mock_result(plant_name)
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
        import uuid

        system = (
            "You are FLORAai, an expert botanical plant-pathologist specialising in Indian subcontinent "
            "spice, medicinal and household plants (curry leaf, cardamom, turmeric, black pepper, clove, "
            "cinnamon, ginger, chilli, tulsi/holy basil, neem, mango, aloe vera, coconut, money plant/pothos). "
            "Analyse the plant photo and respond with STRICT JSON only, no markdown, with keys: "
            "plant_name (string), scientific_name (string), status (one of "
            f"{VALID_STATUSES}), health_score (0-100 integer), confidence (0-100 integer), "
            "diagnosis (2-3 sentence string), issues (array of short strings), "
            "remedies (array of actionable string steps). If not a plant, set status 'Unknown'."
        )
        chat = LlmChat(api_key=api_key, session_id=f"scan-{uuid.uuid4()}", system_message=system).with_model(
            "gemini", "gemini-3.1-pro-preview"
        )
        hint = f"The user says this is a {plant_name}. " if plant_name else ""
        msg = UserMessage(
            text=f"{hint}Diagnose this spice plant's health and return the JSON described.",
            file_contents=[ImageContent(image_base64=image_base64)],
        )
        raw = await chat.send_message(msg)
        text = raw if isinstance(raw, str) else str(raw)
        text = text.strip()
        if text.startswith("```"):
            text = text.strip("`")
            if text.lower().startswith("json"):
                text = text[4:]
        start, end = text.find("{"), text.rfind("}")
        data = json.loads(text[start:end + 1])
        data["health_score"] = int(max(0, min(100, data.get("health_score", 50))))
        data["confidence"] = int(max(0, min(100, data.get("confidence", 50))))
        if data.get("status") not in VALID_STATUSES:
            data["status"] = "Unknown"
        data.setdefault("plant_name", plant_name)
        data.setdefault("scientific_name", "")
        data.setdefault("issues", [])
        data.setdefault("remedies", [])
        data["is_mock"] = False
        return data
    except Exception as e:  # noqa: BLE001
        logger.error(f"AI analysis failed, using fallback: {e}")
        return _mock_result(plant_name)
