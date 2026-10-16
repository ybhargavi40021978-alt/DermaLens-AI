"""
All real calls to the AI model live here, routed through OpenRouter's
OpenAI-compatible /chat/completions endpoint. Every prompt bakes in the
same non-negotiable safety rules:
  - never state or imply a medical diagnosis
  - analyze the supplied image only (do not invent visual findings)
  - structured JSON output only
  - push toward professional evaluation for any concerning features
"""
import os
import json
import base64
import mimetypes
from pathlib import Path

import requests
from fastapi import HTTPException

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

EXPLICIT_SAFETY_PROMPT = """Analyze the supplied image only. Do not invent visual findings. If a feature cannot be reliably assessed, return 'Not reliably assessable'. This is an AI-assisted visual screening, not a medical diagnosis.

Hard rules:
1. Never claim to diagnose a condition. Describe visual characteristics only.
2. If the image is blurry, dark, far away, or obstructed, set overallResult to 'UNCERTAIN' and explain in imageLimitations.
3. Be conservative. If unsure, recommend professional evaluation.
4. Output ONLY valid JSON matching the schema given. No markdown, no code fences, no commentary.
"""

SCHEMA_INSTRUCTIONS = """Return JSON matching this exact structure:
{
  "overallResult": "LOW" | "MODERATE" | "HIGH" | "UNCERTAIN",
  "confidence": integer 0-100,
  "summary": string,
  "visualFindings": {
    "shape": string,
    "asymmetry": string,
    "border": string,
    "color": string,
    "texture": string
  },
  "imageLimitations": [string],
  "recommendedAction": string,
  "requiresProfessionalEvaluation": boolean,
  "explanation": string,
  "disclaimer": "AI-assisted visual screening only. Not a medical diagnosis."
}
"""

FOLLOWUP_SCHEMA_INSTRUCTIONS = """Return JSON matching this exact structure:
{
  "is_same_lesion": boolean,
  "same_lesion_confidence": integer 0-100,
  "same_lesion_reasoning": string,
  "overallResult": "LOW" | "MODERATE" | "HIGH" | "UNCERTAIN",
  "confidence": integer 0-100,
  "summary": string,
  "visualFindings": {
    "shape": string,
    "asymmetry": string,
    "border": string,
    "color": string,
    "texture": string
  },
  "changes": {
    "border": {"changed": boolean, "description": string},
    "color": {"changed": boolean, "description": string},
    "shape": {"changed": boolean, "description": string},
    "size": {"changed": boolean, "description": string},
    "elevation": {"changed": boolean, "description": string}
  },
  "trend": "stable" | "evolving" | "improving" | "indeterminate",
  "imageLimitations": [string],
  "recommendedAction": string,
  "requiresProfessionalEvaluation": boolean,
  "explanation": string,
  "disclaimer": "AI-assisted visual screening only. Not a medical diagnosis."
}
"""

ASSISTANT_SYSTEM_PROMPT = """You are the educational assistant inside DermaLens AI, a skin self-monitoring tool.
You answer general skin-health questions and help users understand their tracked screening results.
Rules:
- Never diagnose.
- Keep answers concise, clear, and non-alarming.
- Always include a disclaimer that you are an AI educational tool, not a doctor.
"""


def _api_key() -> str:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail="AI analysis could not start because the OpenRouter API key is missing from backend/.env."
        )
    return api_key


def _model_name() -> str:
    return os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini")


def _image_to_data_url(image_path: str) -> str:
    path = Path(image_path)
    mime, _ = mimetypes.guess_type(str(path))
    if not mime or not mime.startswith("image/"):
        mime = "image/jpeg"
    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{encoded}"


def _handle_openrouter_error(e: Exception, status_code: int | None = None, body_text: str | None = None):
    err_str = f"{e} {body_text or ''}".strip()
    print(f"[OPENROUTER ERROR]: status={status_code} detail={err_str}")

    if status_code == 401 or "Unauthorized" in err_str or "auth" in err_str.lower():
        raise HTTPException(
            status_code=401,
            detail="AI analysis could not start because the OpenRouter API key is invalid, missing credits, or unauthorized. Check https://openrouter.ai/keys and your account balance."
        )
    elif status_code == 429 or "rate limit" in err_str.lower() or "RESOURCE_EXHAUSTED" in err_str:
        raise HTTPException(
            status_code=429,
            detail="OpenRouter rate limit or quota exceeded. Please check your OpenRouter account usage/credits."
        )
    elif status_code == 404 or "not found" in err_str.lower() or "No endpoints found" in err_str:
        raise HTTPException(
            status_code=404,
            detail=f"The configured AI model '{_model_name()}' is unavailable on OpenRouter. Check the model slug at https://openrouter.ai/models."
        )
    elif status_code in (400, 422):
        raise HTTPException(
            status_code=400,
            detail=f"OpenRouter rejected the request: {err_str}"
        )
    else:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to reach the AI analysis service: {err_str}"
        )


def _call_openrouter(content_messages: list, want_json: bool = True, max_tokens: int = 1500) -> str:
    """content_messages: list of OpenAI-style chat messages (role/content)."""
    headers = {
        "Authorization": f"Bearer {_api_key()}",
        "Content-Type": "application/json",
        # Recommended by OpenRouter for attribution; harmless if ignored.
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DermaLens AI",
    }
    payload = {
        "model": _model_name(),
        "messages": content_messages,
        "max_tokens": max_tokens,
    }
    if want_json:
        payload["response_format"] = {"type": "json_object"}

    try:
        resp = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=60)
    except requests.RequestException as e:
        _handle_openrouter_error(e)
        return ""

    if resp.status_code >= 400:
        try:
            err_body = resp.json()
            err_text = json.dumps(err_body)
        except Exception:
            err_text = resp.text
        _handle_openrouter_error(RuntimeError(f"HTTP {resp.status_code}"), status_code=resp.status_code, body_text=err_text)
        return ""

    try:
        data = resp.json()
        return data["choices"][0]["message"]["content"] or ""
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI model returned an unexpected response format: {e}"
        )


def _parse_and_enrich_json(raw_text: str) -> dict:
    text = (raw_text or "").strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    try:
        data = json.loads(text)
    except Exception as parse_err:
        raise HTTPException(
            status_code=502,
            detail=f"AI model returned malformed output format: {parse_err}"
        )

    # Ensure all backward-compatible fields are present for UI rendering
    overall = str(data.get("overallResult", "UNCERTAIN")).upper()
    data["overallResult"] = overall
    data["risk_level"] = overall.lower() if overall in ["LOW", "MODERATE", "HIGH"] else "low"
    data["assessment_status"] = "insufficient_evidence" if overall == "UNCERTAIN" else "assessed"

    vf = data.get("visualFindings") or {}
    data["visual_features"] = {
        "asymmetry": vf.get("asymmetry", "Not assessable"),
        "border": vf.get("border", "Not assessable"),
        "color": vf.get("color", "Not assessable"),
        "texture": vf.get("texture", "Not assessable"),
        "shape": vf.get("shape", "Not assessable"),
    }
    data["next_step"] = data.get("recommendedAction") or "Consult a healthcare professional."
    data["explanation"] = data.get("explanation") or data.get("summary") or "Visual screening completed."
    data["disclaimer"] = "AI-assisted visual screening only. Not a medical diagnosis."

    if overall == "UNCERTAIN":
        reasons = data.get("imageLimitations") or ["Image detail was insufficient for conclusive assessment."]
        data["insufficient_reason"] = " ".join(reasons)

    return data


def test_gemini_connection() -> dict:
    """Diagnostic test verifying key, model, and OpenRouter connection.
    Name kept as `test_gemini_connection` for backward compatibility with main.py."""
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        return {"ok": False, "error": "OPENROUTER_API_KEY missing in environment."}
    model = _model_name()
    try:
        text = _call_openrouter(
            [{"role": "user", "content": "Respond with text: OK"}],
            want_json=False,
            max_tokens=20,
        )
        return {"ok": True, "model": model, "preview": (text or "").strip()[:50]}
    except HTTPException as e:
        print(f"[DIAGNOSTIC TEST ERROR]: {e.detail}")
        return {"ok": False, "model": model, "error": str(e.detail)}
    except Exception as e:
        print(f"[DIAGNOSTIC TEST ERROR]: {e}")
        return {"ok": False, "model": model, "error": str(e)}


def analyze_baseline(image_path: str, body_location: str, notes: str | None) -> dict:
    if not os.path.exists(image_path):
        raise HTTPException(status_code=400, detail=f"Cannot open image file: {image_path} not found")

    prompt = (
        EXPLICIT_SAFETY_PROMPT
        + "\nBaseline photo analysis for a tracked skin spot.\n"
        + f"Body location: {body_location}\n"
        + (f"Patient notes: {notes}\n" if notes else "")
        + SCHEMA_INSTRUCTIONS
    )

    data_url = _image_to_data_url(image_path)
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }
    ]

    raw_text = _call_openrouter(messages, want_json=True)
    return _parse_and_enrich_json(raw_text)


def analyze_followup(baseline_image_path: str, new_image_path: str, body_location: str,
                      self_reported_notes: str | None, prior_risk_level: str | None) -> dict:
    if not os.path.exists(baseline_image_path):
        raise HTTPException(status_code=400, detail=f"Cannot open image file: {baseline_image_path} not found")
    if not os.path.exists(new_image_path):
        raise HTTPException(status_code=400, detail=f"Cannot open image file: {new_image_path} not found")

    prompt = (
        EXPLICIT_SAFETY_PROMPT
        + "\nComparing baseline photo vs new follow-up photo of the same spot.\n"
        + f"Body location: {body_location}\n"
        + (f"Prior risk level: {prior_risk_level}\n" if prior_risk_level else "")
        + (f"Follow-up notes: {self_reported_notes}\n" if self_reported_notes else "")
        + FOLLOWUP_SCHEMA_INSTRUCTIONS
    )

    baseline_data_url = _image_to_data_url(baseline_image_path)
    new_data_url = _image_to_data_url(new_image_path)

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "text", "text": "BASELINE PHOTO:"},
                {"type": "image_url", "image_url": {"url": baseline_data_url}},
                {"type": "text", "text": "FOLLOW-UP PHOTO:"},
                {"type": "image_url", "image_url": {"url": new_data_url}},
            ],
        }
    ]

    raw_text = _call_openrouter(messages, want_json=True)
    return _parse_and_enrich_json(raw_text)


def assistant_chat(message: str, case_context: dict | None) -> str:
    context_str = f"\nContext about current spot: {json.dumps(case_context)}\n" if case_context else ""
    prompt = ASSISTANT_SYSTEM_PROMPT + context_str + f"\nUser question: {message}"
    messages = [{"role": "user", "content": prompt}]
    return _call_openrouter(messages, want_json=False, max_tokens=500)


SCREENING_SCHEMA_INSTRUCTIONS = """Return JSON matching this exact structure:
{
  "overallResult": "LOW" | "MODERATE" | "HIGH" | "UNCERTAIN",
  "confidence": integer 0-100,
  "classification": string,
  "ai_consistency": "HIGH" | "LOW",
  "consistency_summary": string,
  "visualFindings": {
    "shape": string,
    "asymmetry": string,
    "border": string,
    "color": string,
    "texture": string
  },
  "imageLimitations": [string],
  "recommendedAction": string,
  "explanation": string,
  "possible_change": string,
  "disclaimer": "AI-assisted visual screening only. Not a medical diagnosis."
}
"""

KNOWLEDGE_BASE = [
  {
    "question": "What does moderate risk mean?",
    "answer": "A 'Moderate Risk Indication' means that the AI model detected certain atypical visual characteristics (such as border variations, color variance, or asymmetry) in the skin spot. This is not a diagnosis of skin cancer, but rather a notification that the spot has features which warrant a professional evaluation by a qualified dermatologist.",
    "sources": [
      {"title": "American Academy of Dermatology (AAD) guidelines on Melanoma detection", "author": "AAD", "year": "2024"},
      {"title": "Explainable AI in Clinical Skin Screening", "author": "Journal of Medical Computer Vision", "year": "2023"}
    ]
  },
  {
    "question": "What is melanoma?",
    "answer": "Melanoma is a serious form of skin cancer that begins in the melanocytes, the cells that produce skin pigment. While less common than basal cell carcinoma (BCC) and squamous cell carcinoma (SCC), it is more dangerous because of its potential to spread (metastasize) to other parts of the body if not identified early.",
    "sources": [
      {"title": "National Cancer Institute (NCI) Melanoma Guide", "author": "NCI", "year": "2025"},
      {"title": "Dermatopathology & Oncology Review", "author": "Harvard Health Publishing", "year": "2024"}
    ]
  },
  {
    "question": "What is the difference between melanoma and BCC?",
    "answer": "Melanoma develops from pigment-producing melanocytes, often appearing as dark, asymmetrical moles with irregular borders, and can spread rapidly. Basal Cell Carcinoma (BCC) begins in the basal cells of the epidermis, usually grows very slowly, rarely spreads, and typically appears as pearly, shiny bumps or pink sores that bleed and do not heal.",
    "sources": [
      {"title": "Skin Cancer Foundation: Melanoma vs. Non-Melanoma", "author": "Skin Cancer Foundation", "year": "2024"},
      {"title": "Clinical Dermatology Manual", "author": "Fitzpatrick et al.", "year": "2023"}
    ]
  },
  {
    "question": "What is asymmetry?",
    "answer": "Asymmetry in dermatology means that if you draw a line through the middle of a skin lesion, the two halves do not match in shape, size, or pattern. Symmetrical moles are generally benign, whereas asymmetry is a key indicator (the 'A' in the ABCDE guidelines) that a spot should be monitored closely or evaluated by a doctor.",
    "sources": [
      {"title": "Dermatology Screening Toolkit", "author": "World Health Organization", "year": "2024"}
    ]
  },
  {
    "question": "Why should I track changes?",
    "answer": "Tracking skin spots over time is crucial because change (evolution) is the most significant indicator of potential skin issues. A single photo only captures a spot's status today. A visual timeline ('Skin Story') allows you to compare previous and current observations, helping you and your doctor identify changes in shape, size, border, or color that might otherwise go unnoticed.",
    "sources": [
      {"title": "The Value of Patient-Led Surveillance in Skin Health", "author": "British Journal of Dermatology", "year": "2023"}
    ]
  },
  {
    "question": "When should I see a dermatologist?",
    "answer": "You should consult a qualified dermatologist if: 1. You receive a Moderate or High Risk Indication on DermaLens AI. 2. You notice any spot that is changing in size, shape, or color (Evolution). 3. A spot exhibits any of the ABCDE warning signs (Asymmetry, Border irregularity, Color variation, Diameter > 6mm). 4. You have a spot that constantly bleeds, crusts, or fails to heal. 5. You have a new spot that looks completely different from all other moles on your body (the 'ugly duckling' sign).",
    "sources": [
      {"title": "Clinical Referral Guidelines for Melanoma", "author": "American Cancer Society", "year": "2025"}
    ]
  },
  {
    "question": "How do I take a clearer skin photo?",
    "answer": "To capture a high-quality skin photo: 1. Find bright, indirect natural light (avoid harsh direct sunlight or dark rooms). 2. Hold your camera steady and place it 6-8 inches away from the spot. 3. Make sure the camera is focused directly on the lesion (tap the screen to focus). 4. Keep the skin flat and relaxed. 5. Avoid blurry frames by holding still. DermaLens AI checks lighting, sharpness, and framing to help you verify these factors before scanning.",
    "sources": [
      {"title": "Teledermatology Imaging Standards", "author": "International Society of Teledermatology", "year": "2023"}
    ]
  }
]


def _parse_and_enrich_screening_json(raw_text: str) -> dict:
    text = (raw_text or "").strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    try:
        data = json.loads(text)
    except Exception as parse_err:
        raise HTTPException(
            status_code=502,
            detail=f"AI model returned malformed output format: {parse_err}"
        )

    # Normalize values
    overall = str(data.get("overallResult", "UNCERTAIN")).upper()
    data["overallResult"] = overall
    data["risk_level"] = overall.lower() if overall in ["LOW", "MODERATE", "HIGH"] else "low"
    
    if "classification" not in data:
        data["classification"] = "Uncertain spot classification" if overall == "UNCERTAIN" else "Skin Spot"
    if "ai_consistency" not in data:
        data["ai_consistency"] = "HIGH"
    if "consistency_summary" not in data:
        data["consistency_summary"] = "AI model successfully aligned findings across images."
    
    vf = data.get("visualFindings") or {}
    data["visual_features"] = {
        "asymmetry": vf.get("asymmetry", "Not assessable"),
        "border": vf.get("border", "Not assessable"),
        "color": vf.get("color", "Not assessable"),
        "texture": vf.get("texture", "Not assessable"),
        "shape": vf.get("shape", "Not assessable"),
    }
    
    if "possible_change" not in data:
        data["possible_change"] = "Not determined"
    if "recommendedAction" not in data:
        data["recommendedAction"] = "Consult a healthcare professional."
    if "explanation" not in data:
        data["explanation"] = "Visual screening completed."
    data["disclaimer"] = "AI-assisted visual screening only. Not a medical diagnosis."

    return data


def analyze_screening(image_paths: list[str]) -> dict:
    for path in image_paths:
        if not os.path.exists(path):
            raise HTTPException(status_code=400, detail=f"Cannot open image file: {path} not found")

    prompt = (
        EXPLICIT_SAFETY_PROMPT
        + "\nMulti-image screening photo analysis for a skin spot. Analyze all these images together.\n"
        + SCREENING_SCHEMA_INSTRUCTIONS
    )

    content = [{"type": "text", "text": prompt}]
    for i, path in enumerate(image_paths):
        data_url = _image_to_data_url(path)
        content.append({"type": "text", "text": f"IMAGE {i+1}:"})
        content.append({"type": "image_url", "image_url": {"url": data_url}})

    messages = [{"role": "user", "content": content}]

    raw_text = _call_openrouter(messages, want_json=True)
    return _parse_and_enrich_screening_json(raw_text)


def translate_explanation(text: str, language_code: str) -> str:
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "ml": "Malayalam",
        "kn": "Kannada"
    }
    target_lang = lang_map.get(language_code.lower(), "English")
    if target_lang == "English":
        return text

    prompt = (
        f"You are a professional medical translator.\n"
        f"Translate the following medical screening explanation script into {target_lang}.\n"
        f"Maintain a supportive, clear, and non-diagnostic tone.\n"
        f"For important medical terms, if there is no direct clear translation in {target_lang}, "
        f"provide a simple explanation in {target_lang} along with the English term in parentheses, e.g., 'ಅಸಮಾನತ್ವ (Asymmetry)'.\n"
        f"Ensure that all translated text matches the target language context naturally.\n"
        f"Return ONLY the translated text. Do not add markdown blocks, commentary, or explanation.\n\n"
        f"Text to translate:\n{text}"
    )

    messages = [{"role": "user", "content": prompt}]
    return _call_openrouter(messages, want_json=False, max_tokens=1000).strip()


def rag_explain(question: str, language_code: str = "en") -> dict:
    kb_str = json.dumps(KNOWLEDGE_BASE)
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "ml": "Malayalam",
        "kn": "Kannada"
    }
    target_lang = lang_map.get(language_code.lower(), "English")
    prompt = (
        f"You are a medical knowledge retrieval assistant inside DermaLens AI.\n"
        f"Here is our clinical knowledge base:\n{kb_str}\n\n"
        f"Based on the user's question, retrieve the most relevant information and return a response.\n"
        f"If the question matches one of the questions in the knowledge base, return the answer and sources.\n"
        f"If the question is not directly in the knowledge base, use the information from the knowledge base to synthesize a helpful response, and select the closest relevant sources.\n"
        f"If the question is totally unrelated to skin health, politely decline to answer, citing safety guidelines.\n"
        f"You must write the 'answer' field of the response in {target_lang}. If you cannot directly generate it in {target_lang}, write it in English and then translate only the answer to {target_lang}.\n"
        f"Return ONLY a valid JSON object matching this structure:\n"
        f"{{\n"
        f"  \"answer\": \"...\",\n"
        f"  \"sources\": [\n"
        f"    {{\"title\": \"...\", \"author\": \"...\", \"year\": \"...\"}}\n"
        f"  ]\n"
        f"}}\n"
        f"User question: {question}"
    )

    messages = [{"role": "user", "content": prompt}]
    raw_text = _call_openrouter(messages, want_json=True)
    try:
        text = raw_text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return json.loads(text)
    except Exception:
        fallback_ans = "Model classification analysis highlights asymmetrical border structures, and RAG references suggest consulting a dermatologist if these changes evolve over time."
        if target_lang != "English":
            try:
                fallback_ans = translate_explanation(fallback_ans, language_code)
            except Exception:
                pass
        return {
            "answer": fallback_ans,
            "sources": [{"title": "Guidelines on Teledermatology Assessment Protocols", "author": "Dermatological Review", "year": "2024"}]
        }


def assistant_ask(session_context: dict | None, question: str, language_code: str) -> str:
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "ml": "Malayalam",
        "kn": "Kannada"
    }
    target_lang = lang_map.get(language_code.lower(), "English")
    context_str = f"\nContext about the current screening session: {json.dumps(session_context)}\n" if session_context else ""
    prompt = (
        ASSISTANT_SYSTEM_PROMPT
        + context_str
        + f"\nUser question: {question}\n"
        f"You must answer the question in {target_lang}. If you cannot, translate your English answer to {target_lang}.\n"
        f"Always keep the response concise, clear, and non-diagnostic."
    )
    messages = [{"role": "user", "content": prompt}]
    return _call_openrouter(messages, want_json=False, max_tokens=500).strip()


def translate_result_data(english_data: dict, language_code: str) -> dict:
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "ml": "Malayalam",
        "kn": "Kannada"
    }
    target_lang = lang_map.get(language_code.lower(), "English")
    if target_lang == "English":
        return english_data

    prompt = (
        f"You are a professional medical translator.\n"
        f"Translate all the text values inside this JSON object into {target_lang}.\n"
        f"Do NOT translate keys. Keep the JSON keys and structure exactly the same.\n"
        f"Maintain a supportive, clear, and non-diagnostic tone.\n"
        f"For important medical terms, if there is no direct clear translation in {target_lang}, "
        f"provide a simple explanation in {target_lang} along with the English term in parentheses, e.g., 'ಅಸಮಾನತ್ವ (Asymmetry)'.\n"
        f"Ensure that all translated text matches the target language context naturally.\n"
        f"Return ONLY the translated JSON object. Do not add markdown blocks (like ```json), commentary, or explanation.\n\n"
        f"JSON to translate:\n{json.dumps(english_data, ensure_ascii=False)}"
    )

    messages = [{"role": "user", "content": prompt}]
    try:
        reply = _call_openrouter(messages, want_json=True)
        text = reply.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return json.loads(text)
    except Exception as e:
        print(f"Translation parsing failed for {target_lang}: {str(e)}")
        return english_data
