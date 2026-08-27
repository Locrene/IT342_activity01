const SESSION_KEY = 'activity01_user';

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getToken() {
  const session = getSession();
  return session ? session.token : null;
}

export function isLoggedIn() {
  return getToken() !== null;
}