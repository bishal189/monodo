import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
  if (typeof window === "undefined" || !tokens) {
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

export const logout = () => {
  clearAuthStorage();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const refreshAccessToken = async () => {
  const storedTokens = getStoredTokens();

  if (!storedTokens?.refresh) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
      refresh: storedTokens.refresh,
    });

    const updatedTokens = {
      refresh: response.data?.refresh ?? storedTokens.refresh,
      access: response.data?.access,
    };

    storeTokens(updatedTokens);

    return updatedTokens;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 400) {
      throw new Error("Refresh token expired");
    }
    throw error;
  }
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await refreshAccessToken();
        if (tokens?.access) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
          processQueue(null, tokens.access);
          isRefreshing = false;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

