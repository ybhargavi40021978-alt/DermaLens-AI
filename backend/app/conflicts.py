"""
Deterministic, rule-based checks that flag disagreements between different
pieces of evidence. Intentionally NOT AI-generated -- these are plain
comparisons so they're predictable and auditable.
"""

RISK_ORDER = {"low": 0, "moderate": 1, "high": 2}

GROWTH_KEYWORDS = ["growing", "grew", "bigger", "larger", "spreading", "expanding"]
BLEEDING_KEYWORDS = ["bleed", "bleeding", "blood", "oozing", "crust"]
PAIN_KEYWORDS = ["pain", "hurts", "hurting", "itch", "itchy", "tender", "sore"]


def detect_conflicts(result: dict, self_reported_notes: str | None, prior_risk_level: str | None) -> list[str]:
    conflicts: list[str] = []
    notes = (self_reported_notes or "").lower()

    trend = result.get("trend")
    risk_level = result.get("risk_level")
    confidence = result.get("confidence")

    # 1. Self-report vs measured trend
    self_reports_growth = any(k in notes for k in GROWTH_KEYWORDS)
    if self_reports_growth and trend in ("stable", "improving"):
        conflicts.append(
            "You reported the spot is growing, but the image comparison found it "
            f"{trend}. Consider a follow-up photo taken with the same lighting/distance to double-check."
        )

    self_reports_bleeding_or_pain = any(k in notes for k in BLEEDING_KEYWORDS + PAIN_KEYWORDS)
    if self_reports_bleeding_or_pain and risk_level == "low":
        conflicts.append(
            "You reported bleeding, crusting, or pain, which the visual model can't always "
            "assess from a photo. Symptoms like these warrant a professional check regardless "
            "of the visual risk indication."
        )

    # 2. Trend vs risk level
    if trend == "evolving" and risk_level == "low":
        conflicts.append(
            "The comparison found active visual change (evolving trend) but scored overall risk "
            "as low. Evolution over time is itself a warning sign worth monitoring closely."
        )

    # 3. Large risk-level swing vs stated visual evidence
    if prior_risk_level and risk_level and prior_risk_level in RISK_ORDER and risk_level in RISK_ORDER:
        jump = RISK_ORDER[risk_level] - RISK_ORDER[prior_risk_level]
        if jump >= 2:
            conflicts.append(
                f"Risk indication jumped from {prior_risk_level} to {risk_level} in one comparison. "
                "Large swings can reflect a real change, or photo conditions (lighting/angle/distance) "
                "differing between scans -- review both photos closely."
            )

    # 4. Low confidence + high urgency
    if risk_level == "high" and isinstance(confidence, (int, float)) and confidence < 60:
        conflicts.append(
            f"This high-risk call has relatively low model confidence ({confidence}%). "
            "Treat it as a strong reason to get checked, not as a certain finding."
        )

    return conflicts
