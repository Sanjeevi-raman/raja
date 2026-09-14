const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const apiBaseUrl = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
const API = apiBaseUrl ? `${apiBaseUrl}/api` : '/api';
async function readPayload(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    console.error('API non-JSON response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      bodyPreview: text.slice(0, 200)
    });
    throw new Error('The API returned an invalid response. Make sure the backend server is running.');
  }
}

export async function getContent() {
  const response = await fetch(`${API}/content`, { cache: 'no-store' });
  const payload = await readPayload(response);
  if (!response.ok) throw new Error(payload?.error || 'Could not load website content.');
  return payload;
}

export async function request(path, method = 'GET', body) {
  const token = localStorage.getItem('raja_admin_token');
  const response = await fetch(`${API}${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (response.status === 204) return null;
  const payload = await readPayload(response);
  if (!response.ok) throw new Error(payload?.error || 'Request failed.');
  return payload;
}
