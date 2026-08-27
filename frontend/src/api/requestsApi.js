import { getToken } from './session';

const BASE_URL = 'http://localhost:8080/api/requests';

async function request(path, options = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      ...options,
    });
  } catch (networkError) {
    return {
      ok: false,
      status: 0,
      data: { message: 'Could not reach the server. Is the backend running?' },
    };
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body — leave data as null.
  }

  return { ok: response.ok, status: response.status, data };
}

export function getMyRequests() {
  return request('', { method: 'GET' });
}

export function getRequest(id) {
  return request(`/${id}`, { method: 'GET' });
}

export function createRequest({ title, description, category }) {
  return request('', {
    method: 'POST',
    body: JSON.stringify({ title, description, category }),
  });
}

export function updateRequest(id, { title, description, category }) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, category }),
  });
}

export function deleteRequest(id) {
  return request(`/${id}`, { method: 'DELETE' });
}