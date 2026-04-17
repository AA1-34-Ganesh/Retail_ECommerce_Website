import { auth } from './firebase';

const API_BASE = '/api';

async function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // Not authenticated — continue without token
  }
  return headers;
}

// Products
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`, {
    headers: await getHeaders()
  });
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    headers: await getHeaders()
  });
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/products/categories`, {
    headers: await getHeaders()
  });
  return res.json();
}

// AI
export async function chatWithAI(message, preferences = null, history = [], context = {}) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ message, preferences, history, context })
  });
  return res.json();
}

export async function getRecommendations(preferences) {
  const res = await fetch(`${API_BASE}/ai/recommend`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ preferences })
  });
  return res.json();
}

// Vision
export async function searchByImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const headers = {};
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) { /* skip */ }

  const res = await fetch(`${API_BASE}/vision/search`, {
    method: 'POST',
    headers,
    body: formData
  });
  return res.json();
}

// Maps
export async function getNearbyStores(lat, lng, query = '') {
  const params = new URLSearchParams({ lat, lng, query });
  const res = await fetch(`${API_BASE}/maps/nearby?${params}`, {
    headers: await getHeaders()
  });
  return res.json();
}

export async function getMapsKey() {
  const res = await fetch(`${API_BASE}/maps/key`);
  return res.json();
}

// Analytics
export async function logActivity(type, data = {}) {
  try {
    await fetch(`${API_BASE}/analytics/log`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ type, ...data })
    });
  } catch (e) { /* logging is best-effort */ }
}

export async function getTopSearches() {
  const res = await fetch(`${API_BASE}/analytics/top-searches`, {
    headers: await getHeaders()
  });
  return res.json();
}

export async function getUserStats() {
  const res = await fetch(`${API_BASE}/analytics/user-stats`, {
    headers: await getHeaders()
  });
  return res.json();
}
