import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const safeJsonParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Unable to parse stored tokens.", error);
    return null;
  }
};

export const getStoredTokens = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return safeJsonParse(localStorage.getItem("authTokens"));
};

export const storeTokens = (tokens) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!tokens) {
    return;
  }
  localStorage.setItem("authTokens", JSON.stringify(tokens));
};

export const storeUser = (user) => {
  if (typeof window === "undefined" || !user) {
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return safeJsonParse(localStorage.getItem("user"));
};

export const isAuthenticated = () => {
  const tokens = getStoredTokens();
  return Boolean(tokens?.access);
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("authTokens");
  localStorage.removeItem("user");
};

const refreshAccessToken = async () => {
  const storedTokens = getStoredTokens();

  if (!storedTokens?.refresh) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
    refresh: storedTokens.refresh,
  });

  const updatedTokens = {
    refresh: response.data?.refresh ?? storedTokens.refresh,
    access: response.data?.access,
  };

  storeTokens(updatedTokens);

  return updatedTokens;
};

apiClient.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = await refreshAccessToken();
        if (tokens?.access) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

