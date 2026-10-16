"""
Lightweight SQLite persistence for lesions and scans.
No ORM needed for this scope -- plain sqlite3 with row factory.
"""
import sqlite3
import json
import os
from datetime import datetime, timezone
from pathlib import Path

DB_PATH_STR = os.environ.get("DATABASE_PATH")
if DB_PATH_STR:
    DB_PATH = Path(DB_PATH_STR)
else:
    DB_PATH = Path(__file__).resolve().parent.parent / "dermalens.db"



def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_conn()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS lesions (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            body_location TEXT NOT NULL,
            created_at TEXT NOT NULL,
            baseline_scan_id TEXT
        );

        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY,
            lesion_id TEXT NOT NULL REFERENCES lesions(id) ON DELETE CASCADE,
            image_path TEXT NOT NULL,
            image_hash TEXT,
            quality_json TEXT,
            is_baseline INTEGER NOT NULL DEFAULT 0,
            self_reported_notes TEXT,
            created_at TEXT NOT NULL,
            result_json TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS screening_sessions (
            session_id TEXT PRIMARY KEY,
            guest_id TEXT,
            created_at TEXT NOT NULL,
            result_json TEXT,
            assets_json TEXT
        );

        CREATE TABLE IF NOT EXISTS screening_images (
            image_id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL REFERENCES screening_sessions(session_id) ON DELETE CASCADE,
            filename TEXT NOT NULL,
            image_path TEXT NOT NULL,
            image_hash TEXT,
            quality_json TEXT,
            image_angle TEXT,
            image_type TEXT,
            user_id TEXT,
            created_at TEXT NOT NULL
        );
        """
    )
    # Ensure new columns exist on existing databases
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(scans)")
    columns = [col["name"] for col in cursor.fetchall()]
    if "image_hash" not in columns:
        cursor.execute("ALTER TABLE scans ADD COLUMN image_hash TEXT")
    if "quality_json" not in columns:
        cursor.execute("ALTER TABLE scans ADD COLUMN quality_json TEXT")

    cursor.execute("PRAGMA table_info(screening_sessions)")
    screening_columns = [col["name"] for col in cursor.fetchall()]
    if "guest_id" not in screening_columns:
        cursor.execute("ALTER TABLE screening_sessions ADD COLUMN guest_id TEXT")

    cursor.execute("PRAGMA table_info(screening_images)")
    image_columns = [col["name"] for col in cursor.fetchall()]
    if "image_angle" not in image_columns:
        cursor.execute("ALTER TABLE screening_images ADD COLUMN image_angle TEXT")
    if "image_type" not in image_columns:
        cursor.execute("ALTER TABLE screening_images ADD COLUMN image_type TEXT")
    if "user_id" not in image_columns:
        cursor.execute("ALTER TABLE screening_images ADD COLUMN user_id TEXT")

    conn.commit()
    conn.close()


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def create_lesion(lesion_id: str, label: str, body_location: str) -> dict:
    conn = get_conn()
    conn.execute(
        "INSERT INTO lesions (id, label, body_location, created_at) VALUES (?, ?, ?, ?)",
        (lesion_id, label, body_location, now_iso()),
    )
    conn.commit()
    conn.close()
    return get_lesion(lesion_id)


def set_baseline_scan(lesion_id: str, scan_id: str):
    conn = get_conn()
    conn.execute("UPDATE lesions SET baseline_scan_id = ? WHERE id = ?", (scan_id, lesion_id))
    conn.commit()
    conn.close()


def get_lesion(lesion_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute("SELECT * FROM lesions WHERE id = ?", (lesion_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def list_lesions() -> list[dict]:
    conn = get_conn()
    rows = conn.execute("SELECT * FROM lesions ORDER BY created_at DESC").fetchall()
    conn.close()
    lesions = []
    for row in rows:
        lesion = dict(row)
        lesion["scans"] = list_scans(lesion["id"])
        lesions.append(lesion)
    return lesions


def find_scan_by_hash(image_hash: str) -> dict | None:
    if not image_hash:
        return None
    conn = get_conn()
    row = conn.execute("SELECT * FROM scans WHERE image_hash = ?", (image_hash,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["result"] = json.loads(d.pop("result_json"))
    if d.get("quality_json"):
        d["quality"] = json.loads(d.pop("quality_json"))
    d["is_baseline"] = bool(d["is_baseline"])
    return d


def create_scan(scan_id: str, lesion_id: str, image_path: str, is_baseline: bool,
                 self_reported_notes: str | None, result: dict,
                 image_hash: str | None = None, quality: dict | None = None) -> dict:
    conn = get_conn()
    conn.execute(
        """INSERT INTO scans (id, lesion_id, image_path, image_hash, quality_json, is_baseline, self_reported_notes, created_at, result_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            scan_id,
            lesion_id,
            image_path,
            image_hash,
            json.dumps(quality) if quality else None,
            1 if is_baseline else 0,
            self_reported_notes,
            now_iso(),
            json.dumps(result),
        ),
    )
    conn.commit()
    conn.close()
    return get_scan(scan_id)


def get_scan(scan_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["result"] = json.loads(d.pop("result_json"))
    if d.get("quality_json"):
        d["quality"] = json.loads(d["quality_json"])
    d["is_baseline"] = bool(d["is_baseline"])
    return d


def list_scans(lesion_id: str) -> list[dict]:
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM scans WHERE lesion_id = ? ORDER BY created_at ASC", (lesion_id,)
    ).fetchall()
    conn.close()
    scans = []
    for row in rows:
        d = dict(row)
        d["result"] = json.loads(d.pop("result_json"))
        if d.get("quality_json"):
            d["quality"] = json.loads(d["quality_json"])
        d["is_baseline"] = bool(d["is_baseline"])
        scans.append(d)
    return scans


def get_lesion_with_scans(lesion_id: str) -> dict | None:
    lesion = get_lesion(lesion_id)
    if not lesion:
        return None
    lesion["scans"] = list_scans(lesion_id)
    return lesion


def create_screening_session(session_id: str, guest_id: str | None = None) -> dict:
    conn = get_conn()
    conn.execute(
        "INSERT INTO screening_sessions (session_id, guest_id, created_at, assets_json) VALUES (?, ?, ?, ?)",
        (session_id, guest_id, now_iso(), json.dumps({})),
    )
    conn.commit()
    conn.close()
    return get_screening_session(session_id)


def list_screening_sessions(guest_id: str) -> list[dict]:
    if not guest_id:
        return []
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM screening_sessions WHERE guest_id = ? AND result_json IS NOT NULL ORDER BY created_at DESC",
        (guest_id,),
    ).fetchall()
    conn.close()
    sessions = []
    for row in rows:
        d = dict(row)
        if d.get("result_json"):
            d["result"] = json.loads(d["result_json"])
        else:
            d["result"] = None
        if d.get("assets_json"):
            d["assets"] = json.loads(d["assets_json"])
        else:
            d["assets"] = {}
        sessions.append(d)
    return sessions


def get_screening_session(session_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute("SELECT * FROM screening_sessions WHERE session_id = ?", (session_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if d.get("result_json"):
        d["result"] = json.loads(d["result_json"])
    else:
        d["result"] = None
    if d.get("assets_json"):
        d["assets"] = json.loads(d["assets_json"])
    else:
        d["assets"] = {}
    return d


def update_screening_result(session_id: str, result: dict):
    conn = get_conn()
    conn.execute(
        "UPDATE screening_sessions SET result_json = ? WHERE session_id = ?",
        (json.dumps(result), session_id),
    )
    conn.commit()
    conn.close()


def update_screening_assets(session_id: str, assets: dict):
    conn = get_conn()
    conn.execute(
        "UPDATE screening_sessions SET assets_json = ? WHERE session_id = ?",
        (json.dumps(assets), session_id),
    )
    conn.commit()
    conn.close()


def add_screening_image(image_id: str, session_id: str, filename: str, image_path: str, image_hash: str | None, quality: dict | None, image_angle: str | None = None, image_type: str | None = None, user_id: str | None = None) -> dict:
    conn = get_conn()
    conn.execute(
        """INSERT INTO screening_images (image_id, session_id, filename, image_path, image_hash, quality_json, image_angle, image_type, user_id, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            image_id,
            session_id,
            filename,
            image_path,
            image_hash,
            json.dumps(quality) if quality else None,
            image_angle,
            image_type,
            user_id,
            now_iso(),
        ),
    )
    conn.commit()
    conn.close()
    return get_screening_image(image_id)


def get_screening_image(image_id: str) -> dict | None:
    conn = get_conn()
    row = conn.execute("SELECT * FROM screening_images WHERE image_id = ?", (image_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if d.get("quality_json"):
        d["quality"] = json.loads(d["quality_json"])
    else:
        d["quality"] = None
    return d


def list_screening_images(session_id: str) -> list[dict]:
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM screening_images WHERE session_id = ? ORDER BY created_at ASC", (session_id,)
    ).fetchall()
    conn.close()
    imgs = []
    for row in rows:
        d = dict(row)
        if d.get("quality_json"):
            d["quality"] = json.loads(d["quality_json"])
        else:
            d["quality"] = None
        imgs.append(d)
    return imgs
