/**
 * Utilitaire pour les appels API vers le backend FastAPI
 */

const API_BASE_URL = "https://api-mytone.onrender.com";

export async function apiCall(endpoint, options = {}) {
  const { method = "GET", body, headers = {}, token } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Erreur API");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Authentification
export async function signup(userData) {
  return apiCall("/auth/register", {
    method: "POST",
    body: userData,
  });
}

export async function login(identifier, password) {
  const formData = new URLSearchParams();
  formData.append("username", identifier);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur de connexion");
  }

  return data;
}

export async function getCurrentUser(token) {
  return apiCall("/auth/me", { token });
}

export async function refreshAccessToken(refreshToken) {
  return apiCall("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export async function logout(refreshToken) {
  return apiCall("/auth/logout", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export async function verifyEmail(email) {
  return apiCall("/auth/verify-email", {
    method: "POST",
    body: { email },
  });
}

export async function verifyUsername(username) {
  return apiCall("/auth/verify-username", {
    method: "POST",
    body: { username },
  });
}
