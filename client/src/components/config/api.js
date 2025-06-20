import axios from "axios";
import { useAuthStore } from "../../hooks/useAuth";

const API_URL = "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().reset();
      window.location.href = "/login";
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const API_ENDPOINTS = {
  BASE_URL: API_URL,
  auth: {
    login: `${API_URL}/api/users/login`,
    register: `${API_URL}/api/users/register`,
    logout: `${API_URL}/api/users/logout`,
  },
  whiteboard: {
    create: `${API_URL}/api/whiteboards`,
    myWhiteboards: `${API_URL}/api/whiteboards/my-whiteboards`,
    getWhiteboard: `${API_URL}/api/whiteboards/`,
    update: `${API_URL}/api/whiteboards/`,
    delete: `${API_URL}/api/whiteboards/`,
    star: `${API_URL}/api/whiteboards/star/`,
  },
};

export { API_ENDPOINTS };

export default api;
