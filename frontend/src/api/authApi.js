const BASE_URL = 'http://localhost:8080/api';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
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
  } catch {}

  return { ok: response.ok, status: response.status, data };
}

export function registerUser({ username, email, password }) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export function loginUser({ username, password }) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getUser(id) {
  return request(`/user/${id}`, { method: 'GET' });
}