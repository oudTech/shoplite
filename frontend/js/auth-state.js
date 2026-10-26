
const TOKEN_KEY = 'shoplite_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}


function isLoggedIn() {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const payloadPart = token.split('.')[1];

    if (!payloadPart) {
      clearToken();
      return false;
    }

    const base64 = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const payload = JSON.parse(atob(base64));

    if (
      typeof payload.exp !== 'number' ||
      payload.exp * 1000 <= Date.now()
    ) {
      clearToken();
      return false;
    }

    return true;
  } catch (error) {
    clearToken();
    return false;
  }
}
