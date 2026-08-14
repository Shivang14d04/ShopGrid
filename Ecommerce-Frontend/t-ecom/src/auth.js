export const TOKEN_KEY = "ecommerce_jwt_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const base64 = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const getCurrentUser = () => {
  const token = getToken();
  const decoded = decodeToken(token);

  if (!decoded) {
    return null;
  }

  const role = decoded.role || null;
  return {
    username: decoded.sub || decoded.username || null,
    role,
    isAdmin: role === "ROLE_ADMIN",
    isUser: role === "ROLE_USER",
  };
};

export const isAuthenticated = () => Boolean(getToken());
