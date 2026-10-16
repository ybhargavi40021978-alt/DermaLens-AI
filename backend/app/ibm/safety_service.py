import re

# Fallback message for safety violation
SAFE_FALLBACK = (
    "I can help explain the available screening information, but a qualified "
    "healthcare professional should make a medical diagnosis and treatment decision."
)

UNSAFE_PATTERNS = [
    # Absolute diagnoses
    r"\byou\s+have\s+cancer\b",
    r"\byou\s+have\s+melanoma\b",
    r"\byou\s+have\s+carcinoma\b",
    r"\byou\s+definitely\s+have\b",
    r"\bdefinitely\s+diagnostic\b",
    r"\bdiagnosis\s+is\s+cancer\b",
    r"\bdiagnosis\s+is\s+melanoma\b",
    
    # Overconfident statistics/probabilities
    r"\b\d{2}%\s+likely\s+to\s+have\s+cancer\b",
    r"\bprobability\s+of\s+cancer\s+is\s+\d{2}%\b",
    
    # Treatment promises
    r"\bthis\s+treatment\s+will\s+cure\b",
    r"\bcure\s+your\s+skin\s+cancer\b",
    r"\bthis\s+medicine\s+will\s+treat\b",
    r"\bprescription\b",
    r"\bprescribe\b",
    r"\byou\s+should\s+take\s+(?:cream|ointment|medication|pill)\b",
]

def validate_response(text: str) -> tuple[bool, str]:
    """
    Scans the response for safety violations.
    Returns (is_safe, validated_text)
    """
    if not text:
        return True, ""
        
    lower_text = text.lower()
    for pattern in UNSAFE_PATTERNS:
        if re.search(pattern, lower_text):
            print(f"[IBM SAFETY ACTION] Triggered pattern match for: {pattern}")
            return False, SAFE_FALLBACK
            
    return True, text
