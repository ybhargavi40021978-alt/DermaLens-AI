// Real, deterministic image-quality checks computed from actual pixel data
// (no AI, no mock numbers). Runs entirely in the browser before a photo is
// ever uploaded, so the user gets instant retake guidance.

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return gray;
}

// Laplacian variance: a standard, genuinely-used sharpness metric.
// Low variance of the Laplacian == few sharp edges == likely blurry.
function laplacianVariance(gray, width, height) {
  const lap = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const value =
        -4 * gray[idx] +
        gray[idx - 1] +
        gray[idx + 1] +
        gray[idx - width] +
        gray[idx + width];
      lap.push(value);
    }
  }
  const mean = lap.reduce((a, b) => a + b, 0) / lap.length;
  const variance = lap.reduce((a, b) => a + (b - mean) ** 2, 0) / lap.length;
  return variance;
}

export async function analyzePhotoQuality(file) {
  const img = await loadImageFromFile(file);

  // Downscale for speed; sharpness/brightness signal survives fine at this size.
  const MAX_DIM = 600;
  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const { data } = imageData;

  const gray = toGrayscale(imageData);

  // Brightness: mean luminance 0-255
  const meanBrightness = gray.reduce((a, b) => a + b, 0) / gray.length;

  // Glare: % of near-white, low-saturation ("blown out") pixels
  let glarePixels = 0;
  const totalPixels = w * h;
  for (let i = 0; i < totalPixels; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max > 240 && max - min < 20) glarePixels++;
  }
  const glarePct = (glarePixels / totalPixels) * 100;

  // Sharpness via Laplacian variance
  const sharpness = laplacianVariance(gray, w, h);

  URL.revokeObjectURL(img.src);

  const issues = [];
  const BLUR_THRESHOLD = 80; // empirically reasonable for downscaled 600px images
  const DARK_THRESHOLD = 60;
  const BRIGHT_THRESHOLD = 235;
  const GLARE_THRESHOLD = 15; // percent
  const MIN_DIMENSION = 400; // original image, pre-downscale

  if (sharpness < BLUR_THRESHOLD) {
    issues.push({ code: 'blur', message: 'This photo looks blurry. Hold the camera steady and make sure it focuses on the spot before capturing.' });
  }
  if (meanBrightness < DARK_THRESHOLD) {
    issues.push({ code: 'dark', message: 'This photo is quite dark. Move to a brighter, evenly-lit area (indirect natural light works well).' });
  }
  if (meanBrightness > BRIGHT_THRESHOLD) {
    issues.push({ code: 'overexposed', message: 'This photo looks washed out / overexposed. Avoid direct flash or harsh light.' });
  }
  if (glarePct > GLARE_THRESHOLD) {
    issues.push({ code: 'glare', message: 'There is significant glare in this photo. Try a different angle or softer lighting to reduce reflections.' });
  }
  if (Math.min(img.width, img.height) < MIN_DIMENSION) {
    issues.push({ code: 'low_resolution', message: 'This photo is low resolution. Move closer or use a higher-resolution camera setting.' });
  }

  return {
    passed: issues.length === 0,
    issues,
    metrics: {
      width: img.width,
      height: img.height,
      meanBrightness: Math.round(meanBrightness),
      glarePct: Math.round(glarePct * 10) / 10,
      sharpness: Math.round(sharpness),
    },
  };
}
