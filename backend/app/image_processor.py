"""
Real image validation, quality analysis, pixel math metrics, and hashing.
"""
import io
import hashlib
from PIL import Image

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB
MIN_FILE_SIZE = 1 * 1024  # 1 KB
MIN_DIMENSION = 200  # 200px minimum width/height


def compute_image_hash(file_bytes: bytes) -> str:
    """Compute SHA-256 hash of raw image bytes for duplicate detection."""
    return hashlib.sha256(file_bytes).hexdigest()


def compute_perceptual_hash(img: Image.Image) -> str:
    """Compute a simple average hash (aHash) for visual duplicate detection."""
    small = img.convert("L").resize((8, 8), Image.Resampling.BILINEAR)
    pixels = list(small.getdata())
    avg = sum(pixels) / len(pixels)
    bits = "".join(["1" if p > avg else "0" for p in pixels])
    return hex(int(bits, 2))[2:].zfill(16)


def validate_image_file(file_bytes: bytes, filename: str) -> tuple[bool, str | None, Image.Image | None]:
    """Validate image file type, size, format, and corruption status."""
    if not file_bytes or len(file_bytes) < MIN_FILE_SIZE:
        return False, "File is empty or too small to be a valid image.", None

    if len(file_bytes) > MAX_FILE_SIZE:
        return False, f"File size exceeds maximum allowed limit of {MAX_FILE_SIZE // (1024 * 1024)}MB.", None

    ext = ("." + filename.split(".")[-1]).lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension '{ext}'. Allowed types: JPG, JPEG, PNG, WEBP.", None

    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
        # Reopen image after verify() as verify resets image pointer/state
        img = Image.open(io.BytesIO(file_bytes))
    except Exception as e:
        return False, f"Corrupted or unreadable image file: {str(e)}", None

    if img.format not in ALLOWED_FORMATS:
        return False, f"Unsupported image format '{img.format}'. Allowed formats: JPEG, PNG, WEBP.", None

    w, h = img.size
    if w < MIN_DIMENSION or h < MIN_DIMENSION:
        return False, f"Image resolution ({w}x{h}) is too low. Minimum dimension is {MIN_DIMENSION}x{MIN_DIMENSION}px.", None

    return True, None, img


def analyze_image_quality(img: Image.Image) -> dict:
    """Calculate real image quality metrics: resolution, brightness, contrast, sharpness."""
    width, height = img.size
    gray = img.convert("L")
    pixels = list(gray.getdata())
    n = len(pixels)

    # Brightness (mean pixel intensity 0..255)
    mean_brightness = sum(pixels) / n

    # Contrast (standard deviation of pixel intensities)
    variance_brightness = sum((p - mean_brightness) ** 2 for p in pixels) / n
    contrast = variance_brightness ** 0.5

    # Sharpness / Blur metric (variance of adjacent pixel differences)
    # Resize to max 300px dimension for fast pixel math
    scaled = gray.copy()
    scaled.thumbnail((300, 300))
    w_s, h_s = scaled.size
    s_pixels = scaled.load()

    diffs = []
    for y in range(h_s - 1):
        for x in range(w_s - 1):
            dx = abs(s_pixels[x, y] - s_pixels[x + 1, y])
            dy = abs(s_pixels[x, y] - s_pixels[x, y + 1])
            diffs.append(dx + dy)

    diff_mean = sum(diffs) / len(diffs) if diffs else 0
    diff_var = sum((d - diff_mean) ** 2 for d in diffs) / len(diffs) if diffs else 0
    sharpness = diff_var ** 0.5

    issues = []
    usable = True

    if width < 300 or height < 300:
        issues.append(f"Low resolution ({width}x{height}px). Minimum recommended is 300x300px.")

    if mean_brightness < 40:
        issues.append(f"Image is too dark (brightness index: {round(mean_brightness, 1)}/255). Please use better lighting.")
        usable = False
    elif mean_brightness > 225:
        issues.append(f"Image has glare or is overexposed (brightness index: {round(mean_brightness, 1)}/255). Avoid direct harsh glare.")
        usable = False

    if contrast < 15:
        issues.append(f"Low contrast ({round(contrast, 1)}). The spot may be hard to distinguish from background.")

    if sharpness < 10:
        issues.append(f"Image appears blurry or out of focus (sharpness index: {round(sharpness, 1)}). Please hold camera steady.")
        usable = False

    return {
        "width": width,
        "height": height,
        "resolution": f"{width}x{height}",
        "brightness": round(mean_brightness, 1),
        "contrast": round(contrast, 1),
        "sharpness": round(sharpness, 1),
        "usable": usable,
        "issues": issues,
    }
