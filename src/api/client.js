// Real backend API client. No mock data, no fabricated results --
// every function here hits the FastAPI backend in /backend, which itself
// calls the Gemini vision API. See backend/.env.example for setup.

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

async function handleResponse(res) {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch (_parseError) {
      // response wasn't JSON
    }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return handleResponse(res);
}

export async function listLesions() {
  const res = await fetch(`${API_BASE}/api/lesions`);
  return handleResponse(res);
}

export async function getLesion(lesionId) {
  const res = await fetch(`${API_BASE}/api/lesions/${lesionId}`);
  return handleResponse(res);
}

export async function createLesion({ label, bodyLocation, notes, imageFile }) {
  const form = new FormData();
  form.append('label', label);
  form.append('body_location', bodyLocation);
  if (notes) form.append('notes', notes);
  form.append('image', imageFile);
  const res = await fetch(`${API_BASE}/api/lesions`, { method: 'POST', body: form });
  return handleResponse(res);
}

export async function addScan(lesionId, { notes, imageFile }) {
  const form = new FormData();
  if (notes) form.append('notes', notes);
  form.append('image', imageFile);
  const res = await fetch(`${API_BASE}/api/lesions/${lesionId}/scans`, { method: 'POST', body: form });
  return handleResponse(res);
}

export async function getReport(lesionId) {
  const res = await fetch(`${API_BASE}/api/lesions/${lesionId}/report`);
  return handleResponse(res);
}

export async function assistantChat(message, lesionId) {
  const form = new FormData();
  form.append('message', message);
  if (lesionId) form.append('lesion_id', lesionId);
  const res = await fetch(`${API_BASE}/api/assistant/chat`, { method: 'POST', body: form });
  return handleResponse(res);
}

export function imageUrl(imagePath) {
  // backend stores absolute filesystem paths; we only need the filename,
  // which is served under /images
  if (!imagePath) return '';
  const filename = imagePath.split(/[\/\\]/).pop();
  return `${API_BASE}/images/${filename}`;
}

export async function uploadScreeningImages(files, sessionId = null) {
  const form = new FormData();
  files.forEach(file => {
    form.append('files', file);
  });
  if (sessionId) {
    form.append('session_id', sessionId);
  }
  const guestId = localStorage.getItem('guest_id');
  if (guestId) {
    form.append('guest_id', guestId);
  }
  const res = await fetch(`${API_BASE}/api/screening/upload`, {
    method: 'POST',
    body: form
  });
  return handleResponse(res);
}

export async function getHistory(guestId) {
  const res = await fetch(`${API_BASE}/history?guest_id=${guestId}`);
  return handleResponse(res);
}

export async function runScreeningAnalysis(sessionId, imageIds) {
  const res = await fetch(`${API_BASE}/api/screening/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, image_ids: imageIds })
  });
  return handleResponse(res);
}

export async function getScreeningResult(sessionId) {
  const res = await fetch(`${API_BASE}/api/screening/${sessionId}/result`);
  return handleResponse(res);
}

export async function getLocalizedExplanation(sessionId, language) {
  const res = await fetch(`${API_BASE}/api/explanation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, language: language })
  });
  return handleResponse(res);
}

export async function getExplanationAudio(sessionId, language) {
  const res = await fetch(`${API_BASE}/api/explanation/audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, language: language })
  });
  return handleResponse(res);
}

export async function getExplanationVideo(sessionId, language) {
  const res = await fetch(`${API_BASE}/api/explanation/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, language: language })
  });
  return handleResponse(res);
}

export async function askRAGQuestion(question, language = 'en') {
  const res = await fetch(`${API_BASE}/api/rag/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: question, language: language })
  });
  return handleResponse(res);
}

export async function askLensAI(sessionId, question, language) {
  const res = await fetch(`${API_BASE}/api/lens-ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, question: question, language: language })
  });
  return handleResponse(res);
}

export async function generateDoctorReport(sessionId) {
  const res = await fetch(`${API_BASE}/api/reports/doctor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return handleResponse(res);
}

export async function getNearbyDoctors({ latitude, longitude, radius, specialization, sort, rating, openNow, address }) {
  const params = new URLSearchParams();
  if (latitude !== undefined && latitude !== null) params.append('latitude', latitude);
  if (longitude !== undefined && longitude !== null) params.append('longitude', longitude);
  if (radius) params.append('radius', radius);
  if (specialization) params.append('specialization', specialization);
  if (sort) params.append('sort', sort);
  if (rating) params.append('rating', rating);
  if (openNow) params.append('open_now', openNow);
  if (address) params.append('address', address);

  const res = await fetch(`${API_BASE}/api/doctors/nearby?${params.toString()}`);
  return handleResponse(res);
}

export async function updateImageMetadata(imageId, angle, type) {
  const res = await fetch(`${API_BASE}/api/screening/image/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_id: imageId, angle, type })
  });
  return handleResponse(res);
}

export async function getDatasetStats() {
  const res = await fetch(`${API_BASE}/api/dataset/stats`);
  return handleResponse(res);
}
